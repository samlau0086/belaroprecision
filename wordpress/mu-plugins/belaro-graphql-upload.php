<?php
/**
 * Plugin Name: Belaro GraphQL Upload Compatibility
 * Description: Accept preflighted multipart requests parsed by WPGraphQL Upload on WPGraphQL 2.x.
 */

defined('ABSPATH') || exit;

// Register only the CAD formats advertised by the RFQ; keep WordPress file checks enabled.
add_filter('upload_mimes', static function ($mimes) {
    $mimes['step|stp|iges|igs|x_t|dxf'] = 'text/plain';
    $mimes['dwg'] = 'image/vnd.dwg';
    return $mimes;
});

add_filter('graphql_access_control_allow_headers', static function ($headers) {
    $headers[] = 'GraphQL-Require-Preflight';
    $headers[] = 'X-Turnstile-Token';
    return array_unique($headers);
});

add_filter('graphql_is_valid_http_content_type', static function ($valid, $content_type) {
    if ($valid) {
        return true;
    }

    return class_exists('WPGraphQL\\Upload\\Request\\BodyParser')
        && preg_match('/^multipart\/form-data(?:;|$)/i', $content_type)
        && isset($_SERVER['HTTP_GRAPHQL_REQUIRE_PREFLIGHT'])
        && $_SERVER['HTTP_GRAPHQL_REQUIRE_PREFLIGHT'] === '1';
}, 10, 2);

// Reject RFQ mutations before WPGraphQL executes them unless Turnstile verifies.
add_filter('graphql_request_data', static function ($data) {
    if (!is_array($data) || !isset($data['query']) || !is_string($data['query'])) {
        return $data;
    }

    if (!preg_match('/\bmutation\b/i', $data['query']) || !preg_match('/\bsubmitGfForm\b/', $data['query'])) {
        return $data;
    }

    $token = isset($_SERVER['HTTP_X_TURNSTILE_TOKEN']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_X_TURNSTILE_TOKEN'])) : '';
    $secret = defined('BELARO_TURNSTILE_SECRET_KEY') ? BELARO_TURNSTILE_SECRET_KEY : '';
    $hostname = defined('BELARO_TURNSTILE_HOSTNAME') ? BELARO_TURNSTILE_HOSTNAME : '';
    $verified = false;

    if ($token !== '' && $secret !== '' && $hostname !== '') {
        $response = wp_remote_post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
            'timeout' => 5,
            'body' => ['secret' => $secret, 'response' => $token],
        ]);

        if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
            $result = json_decode(wp_remote_retrieve_body($response), true);
            $verified = is_array($result)
                && !empty($result['success'])
                && isset($result['hostname'], $result['action'])
                && hash_equals($hostname, (string) $result['hostname'])
                && hash_equals('rfq', (string) $result['action']);
        }
    }

    if (!$verified) {
        // Replace the operation so the caller cannot accidentally save an RFQ.
        $data['query'] = 'query { __typename }';
        unset($data['variables'], $data['operationName']);
    }

    return $data;
}, 1);
