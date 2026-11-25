<?php
/**
 * Plugin Name: Belaro Blog GraphQL
 * Description: Adds anonymous comment vote fields and mutations for the Astro Blog.
 */

defined('ABSPATH') || exit;

const BELARO_BLOG_VOTE_DB_VERSION = '1';

function belaro_blog_vote_table()
{
    global $wpdb;
    return $wpdb->prefix . 'belaro_comment_votes';
}

function belaro_blog_install_vote_table()
{
    if (get_option('belaro_blog_vote_db_version') === BELARO_BLOG_VOTE_DB_VERSION) {
        return;
    }

    global $wpdb;
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    $table = belaro_blog_vote_table();
    $charset = $wpdb->get_charset_collate();
    dbDelta("CREATE TABLE {$table} (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        comment_id bigint(20) unsigned NOT NULL,
        visitor_hash char(64) NOT NULL,
        vote tinyint(2) NOT NULL,
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY  (id),
        UNIQUE KEY comment_visitor (comment_id, visitor_hash),
        KEY comment_vote (comment_id, vote)
    ) {$charset};");
    $installed_table = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($table)));
    if ($installed_table === $table) {
        update_option('belaro_blog_vote_db_version', BELARO_BLOG_VOTE_DB_VERSION, false);
    }
}
add_action('init', 'belaro_blog_install_vote_table', 5);

function belaro_blog_post_id($post)
{
    foreach (['databaseId', 'postId', 'ID'] as $property) {
        if (is_object($post) && isset($post->{$property})) {
            return absint($post->{$property});
        }
    }
    if (is_object($post) && isset($post->source) && $post->source instanceof WP_Post) {
        return absint($post->source->ID);
    }
    return 0;
}

function belaro_blog_visitor_hash($token)
{
    $token = is_string($token) ? trim($token) : '';
    if (!preg_match('/^[A-Za-z0-9_-]{32,128}$/', $token)) {
        return '';
    }
    return hash_hmac('sha256', $token, wp_salt('auth'));
}

function belaro_blog_is_public_comment($comment)
{
    if (!$comment instanceof WP_Comment || (string) $comment->comment_approved !== '1') {
        return false;
    }
    $post = get_post($comment->comment_post_ID);
    $post_type = $post ? get_post_type_object($post->post_type) : null;
    return $post instanceof WP_Post
        && $post->post_status === 'publish'
        && $post->post_password === ''
        && $post_type
        && $post_type->public;
}

function belaro_blog_vote_summary($comment_id, $visitor_token = '')
{
    global $wpdb;
    $table = belaro_blog_vote_table();
    $counts = $wpdb->get_row($wpdb->prepare(
        "SELECT
            COALESCE(SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END), 0) AS upvotes,
            COALESCE(SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END), 0) AS downvotes
        FROM {$table}
        WHERE comment_id = %d",
        $comment_id
    ), ARRAY_A);
    $up = isset($counts['upvotes']) ? absint($counts['upvotes']) : 0;
    $down = isset($counts['downvotes']) ? absint($counts['downvotes']) : 0;
    $viewer_vote = '';
    $visitor_hash = belaro_blog_visitor_hash($visitor_token);

    if ($visitor_hash !== '') {
        $vote = $wpdb->get_var($wpdb->prepare(
            "SELECT vote FROM {$table} WHERE comment_id = %d AND visitor_hash = %s",
            $comment_id,
            $visitor_hash
        ));
        if ((int) $vote === 1) {
            $viewer_vote = 'up';
        } elseif ((int) $vote === -1) {
            $viewer_vote = 'down';
        }
    }

    return [
        'up' => $up,
        'down' => $down,
        'score' => $up - $down,
        'viewerVote' => $viewer_vote,
    ];
}

function belaro_blog_post_vote_summaries($post_id, $visitor_token = '')
{
    global $wpdb;
    $comment_ids = get_comments([
        'post_id' => $post_id,
        'status' => 'approve',
        'fields' => 'ids',
        'number' => 0,
        'orderby' => 'comment_date_gmt',
        'order' => 'ASC',
    ]);
    $comment_ids = array_values(array_filter(array_map('absint', $comment_ids)));
    if ($comment_ids === []) {
        return [];
    }

    $table = belaro_blog_vote_table();
    $placeholders = implode(', ', array_fill(0, count($comment_ids), '%d'));
    $rows = $wpdb->get_results($wpdb->prepare(
        "SELECT comment_id,
            COALESCE(SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END), 0) AS upvotes,
            COALESCE(SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END), 0) AS downvotes
        FROM {$table}
        WHERE comment_id IN ({$placeholders})
        GROUP BY comment_id",
        ...$comment_ids
    ), ARRAY_A);
    $summaries = [];
    foreach ($comment_ids as $comment_id) {
        $summaries[$comment_id] = [
            'commentId' => $comment_id,
            'up' => 0,
            'down' => 0,
            'score' => 0,
            'viewerVote' => '',
        ];
    }
    foreach ($rows as $row) {
        $comment_id = absint($row['comment_id']);
        $up = absint($row['upvotes']);
        $down = absint($row['downvotes']);
        if (isset($summaries[$comment_id])) {
            $summaries[$comment_id]['up'] = $up;
            $summaries[$comment_id]['down'] = $down;
            $summaries[$comment_id]['score'] = $up - $down;
        }
    }

    $visitor_hash = belaro_blog_visitor_hash($visitor_token);
    if ($visitor_hash !== '') {
        $viewer_rows = $wpdb->get_results($wpdb->prepare(
            "SELECT comment_id, vote FROM {$table}
            WHERE comment_id IN ({$placeholders}) AND visitor_hash = %s",
            ...array_merge($comment_ids, [$visitor_hash])
        ), ARRAY_A);
        foreach ($viewer_rows as $row) {
            $comment_id = absint($row['comment_id']);
            if (isset($summaries[$comment_id])) {
                $summaries[$comment_id]['viewerVote'] = (int) $row['vote'] === 1 ? 'up' : 'down';
            }
        }
    }

    return array_values($summaries);
}

function belaro_blog_graphql_error($message)
{
    if (class_exists('GraphQL\\Error\\UserError')) {
        throw new GraphQL\Error\UserError($message);
    }
    throw new Exception($message);
}

add_action('graphql_register_types', static function () {
    register_graphql_object_type('BelaroCommentVoteSummary', [
        'description' => __('Comment vote totals and the current visitor vote.', 'belaro'),
        'fields' => [
            'commentId' => ['type' => 'Int'],
            'up' => ['type' => 'Int'],
            'down' => ['type' => 'Int'],
            'score' => ['type' => 'Int'],
            'viewerVote' => ['type' => 'String'],
        ],
    ]);

    register_graphql_field('Post', 'belaroCommentVotes', [
        'type' => ['list_of' => 'BelaroCommentVoteSummary'],
        'description' => __('Vote totals for the public comments on this post.', 'belaro'),
        'args' => [
            'visitorToken' => ['type' => 'String'],
        ],
        'resolve' => static function ($post, $args) {
            $post_id = belaro_blog_post_id($post);
            return belaro_blog_post_vote_summaries($post_id, $args['visitorToken'] ?? '');
        },
    ]);

    register_graphql_mutation('belaroVoteComment', [
        'description' => __('Create, change or clear an anonymous comment vote.', 'belaro'),
        'inputFields' => [
            'commentId' => ['type' => ['non_null' => 'Int']],
            'direction' => ['type' => ['non_null' => 'String']],
            'visitorToken' => ['type' => ['non_null' => 'String']],
        ],
        'outputFields' => [
            'up' => ['type' => 'Int', 'resolve' => static fn($payload) => $payload['up']],
            'down' => ['type' => 'Int', 'resolve' => static fn($payload) => $payload['down']],
            'score' => ['type' => 'Int', 'resolve' => static fn($payload) => $payload['score']],
            'viewerVote' => ['type' => 'String', 'resolve' => static fn($payload) => $payload['viewerVote']],
        ],
        'mutateAndGetPayload' => static function ($input) {
            global $wpdb;
            $comment_id = absint($input['commentId'] ?? 0);
            $direction = sanitize_key($input['direction'] ?? '');
            $visitor_hash = belaro_blog_visitor_hash($input['visitorToken'] ?? '');
            $comment = $comment_id ? get_comment($comment_id) : null;

            if (!belaro_blog_is_public_comment($comment)) {
                belaro_blog_graphql_error(__('The comment is unavailable.', 'belaro'));
            }
            if (!in_array($direction, ['up', 'down', 'clear'], true) || $visitor_hash === '') {
                belaro_blog_graphql_error(__('The vote request is invalid.', 'belaro'));
            }

            $table = belaro_blog_vote_table();
            if ($direction === 'clear') {
                $result = $wpdb->delete($table, [
                    'comment_id' => $comment_id,
                    'visitor_hash' => $visitor_hash,
                ], ['%d', '%s']);
            } else {
                $vote = $direction === 'up' ? 1 : -1;
                $result = $wpdb->query($wpdb->prepare(
                    "INSERT INTO {$table} (comment_id, visitor_hash, vote)
                    VALUES (%d, %s, %d)
                    ON DUPLICATE KEY UPDATE vote = VALUES(vote), updated_at = CURRENT_TIMESTAMP",
                    $comment_id,
                    $visitor_hash,
                    $vote
                ));
            }

            if ($result === false) {
                belaro_blog_graphql_error(__('The vote could not be saved.', 'belaro'));
            }
            return belaro_blog_vote_summary($comment_id, $input['visitorToken']);
        },
    ]);
});

add_action('delete_comment', static function ($comment_id) {
    global $wpdb;
    $wpdb->delete(belaro_blog_vote_table(), ['comment_id' => absint($comment_id)], ['%d']);
});
