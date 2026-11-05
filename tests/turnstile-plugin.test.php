<?php
// 使用 WordPress 函数替身验证插件分支，不连接真实后台或 Cloudflare。
define('ABSPATH', __DIR__);
$scenario = $argv[1] ?? 'disabled';
if ($scenario !== 'disabled') {
    define('BELARO_TURNSTILE_SECRET_KEY', $scenario === 'blank' ? '   ' : 'test-secret');
}
if ($scenario !== 'missing-hostname') {
    define('BELARO_TURNSTILE_HOSTNAME', 'example.com');
}
$_SERVER['HTTP_X_TURNSTILE_TOKEN'] = $scenario === 'missing-token' ? '' : 'test-token';
$filters = [];
$calls = 0;
function add_filter($name, $callback, ...$args) { global $filters; $filters[$name] = $callback; }
function sanitize_text_field($value) { return trim($value); }
function wp_unslash($value) { return $value; }
function wp_remote_post($url, $options) {
    global $calls;
    $calls++;
    return [];
}
function is_wp_error($response) { global $scenario; return $scenario === 'network-error'; }
function wp_remote_retrieve_response_code($response) { return 200; }
function wp_remote_retrieve_body($response) {
    global $scenario;
    return json_encode([
        'success' => $scenario !== 'invalid',
        'hostname' => $scenario === 'wrong-hostname' ? 'other.example.com' : 'example.com',
        'action' => $scenario === 'wrong-action' ? 'other' : 'rfq',
    ]);
}
require __DIR__ . '/../wordpress/mu-plugins/belaro-graphql-upload.php';
$input = ['query' => 'mutation SubmitRFQ { submitGfForm { entry { id } } }', 'variables' => ['input' => []], 'operationName' => 'SubmitRFQ'];
$output = $filters['graphql_request_data']($input);
$allowed = in_array($scenario, ['disabled', 'blank', 'valid'], true);
if ($allowed ? $output !== $input : ($output !== ['query' => 'query { __typename }'])) {
    throw new RuntimeException('验证失败：' . $scenario);
}
if (in_array($scenario, ['disabled', 'blank', 'missing-token', 'missing-hostname'], true) && $calls !== 0) {
    throw new RuntimeException('不应调用外部验证服务：' . $scenario);
}
echo '通过：' . $scenario . PHP_EOL;
