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
