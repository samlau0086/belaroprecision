import test from 'node:test';
import assert from 'node:assert/strict';
import {
  blogPostQuery,
  blogVotesQuery,
  blogQuery,
  buildCommentTree,
  createCommentMutation,
  fetchBlogData,
  fetchBlogPost,
  fetchBlogVotes,
  fetchPublishedBlogPosts,
  attachCommentVotes,
  articlePath,
  articleBreadcrumbCategory,
  articleContentFields,
  plainText,
  submitBlogComment,
  voteBlogComment,
  voteCommentMutation,
} from '../src/lib/blog.mjs';
import { sanitizeBlogHtml } from '../src/lib/blog-html.mjs';

const sampleData = {
  categories: { nodes: [{ databaseId: 3, name: 'Manufacturing', slug: 'manufacturing' }] },
  posts: { nodes: [{ databaseId: 10, slug: 'cnc-guide', title: 'CNC <strong>Guide</strong>', uri: '/blog/cnc-guide/', date: '2026-11-25T08:00:00+00:00', excerpt: '<p>Practical&nbsp;tips &amp; examples.</p>', categories: { nodes: [] }, featuredImage: null }] },
};

const response = (body, options = {}) => ({
  ok: true,
  status: 200,
  json: async () => body,
  ...options,
});

test('文章面包屑按名称选择首个分类，默认分类不生成链接', () => {
  const categories = [{ name: 'Zinc', slug: 'zinc' }, { name: 'Engineering', slug: 'engineering' }];
  assert.equal(articleBreadcrumbCategory(categories).slug, 'engineering');
  assert.equal(categories[0].name, 'Zinc');
  assert.equal(articleBreadcrumbCategory([{ name: 'Uncategorized', slug: 'uncategorized' }]), null);
  assert.equal(articleBreadcrumbCategory([{ name: 'Zinc', slug: 'zinc' }, { name: 'Uncategorized', slug: 'uncategorized' }]), null);
  assert.equal(articleBreadcrumbCategory([]), null);
  assert.equal(articleBreadcrumbCategory([{ name: '', slug: 'bad' }]), null);
});

test('Blog GraphQL 请求使用 POST、JSON 且解析分类与文章', async () => {
  let request;
  const result = await fetchBlogData('https://cms.example/graphql', async (endpoint, init) => {
    request = { endpoint, init };
    return response({ data: sampleData });
  });

  assert.equal(request.endpoint, 'https://cms.example/graphql');
  assert.equal(request.init.method, 'POST');
  assert.equal(request.init.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(request.init.body), { query: blogQuery });
  assert.deepEqual(result, { categories: sampleData.categories.nodes, posts: sampleData.posts.nodes });
});

test('Blog GraphQL 请求拒绝 HTTP 错误、GraphQL 错误和不完整响应', async () => {
  await assert.rejects(
    fetchBlogData('https://cms.example/graphql', async () => response({}, { ok: false, status: 503 })),
    /HTTP 503/,
  );
  await assert.rejects(
    fetchBlogData('https://cms.example/graphql', async () => response({ errors: [{ message: 'Denied' }] })),
    /GraphQL query failed/,
  );
  await assert.rejects(
    fetchBlogData('https://cms.example/graphql', async () => response({ data: { categories: { nodes: [] } } })),
    /response is incomplete/,
  );
});

test('摘要清理 HTML、常见实体并合并空白字符', () => {
  assert.equal(plainText('<p>Practical&nbsp;tips &amp; &lt;examples&gt; &quot;now&quot;.</p>'), 'Practical tips & <examples> "now".');
  assert.equal(plainText(null), 'null');
});

test('文章正文查询不依赖投票插件，单独加载并合并投票', async () => {
  let request;
  const post = {
    databaseId: 10,
    slug: 'cnc-guide',
    belaroCommentVotes: [{ commentId: 21, up: 2, down: 1, score: 1, viewerVote: 'up' }],
    comments: { nodes: [{ databaseId: 21, content: '<p>Helpful.</p>', parentDatabaseId: 0 }] },
  };
  const result = await fetchBlogPost('https://cms.example/graphql', 'cnc-guide', 'a'.repeat(32), async (endpoint, init) => {
    request = { endpoint, init };
    return response({ data: { post } });
  });

  assert.deepEqual(JSON.parse(request.init.body), {
    query: blogPostQuery,
    variables: { slug: 'cnc-guide' },
  });
  assert.equal(blogPostQuery.includes('belaroCommentVotes'), false);
  const summaries = await fetchBlogVotes('https://cms.example/graphql', 'cnc-guide', 'a'.repeat(32), async (_, init) => {
    assert.equal(JSON.parse(init.body).query, blogVotesQuery);
    return response({ data: { post } });
  });
  assert.deepEqual(attachCommentVotes(result.comments, summaries)[0].belaroVotes, post.belaroCommentVotes[0]);
  await assert.rejects(fetchBlogVotes('https://cms.example/graphql', 'cnc-guide', 'a'.repeat(32), async () => response({ errors: [{ message: 'Cannot query field belaroCommentVotes' }] })), /belaroCommentVotes/);
  await assert.rejects(fetchBlogPost('https://cms.example/graphql', '../bad', 'a'.repeat(32)), /valid article slug/);
});

test('静态文章路由分页读取全部已发布文章，并拒绝失败或停滞分页', async () => {
  const cursors = [];
  const posts = await fetchPublishedBlogPosts('https://cms.example/graphql', async (_, init) => {
    const { query, variables } = JSON.parse(init.body);
    assert.ok(query.includes(articleContentFields));
    assert.match(query, /rows\s*\{\s*label\s+value\s*\}/);
    assert.doesNotMatch(query, /value\s*:\s*va\b/);
    cursors.push(variables.after);
    return response({ data: { posts: { nodes: [{ slug: variables.after ? 'second' : 'first' }], pageInfo: { hasNextPage: !variables.after, endCursor: 'next' } } } });
  });
  assert.deepEqual(cursors, [null, 'next']);
  assert.deepEqual(posts.map(post => articlePath(post.slug)), ['/post/first/', '/post/second/']);
  await assert.rejects(fetchPublishedBlogPosts('', async () => response({ data: { posts: { nodes: [], pageInfo: { hasNextPage: true, endCursor: null } } } })), /did not advance/);
});

test('构建期正文保留排版，移除脚本、事件和危险 URL', () => {
  const html = sanitizeBlogHtml('<h2>Review</h2><p onclick="alert(1)">Text</p><script>alert(2)</script><a href="javascript:alert(3)">Link</a><img src="https://cms.example/image.jpg" onerror="alert(4)">');
  assert.match(html, /<h2>Review<\/h2>/);
  assert.match(html, /https:\/\/cms.example\/image.jpg/);
  assert.doesNotMatch(html, /script|onclick|onerror|javascript:|alert/);
});

test('评论提交支持顶层评论与层级回复', async () => {
  const requests = [];
  const headers = [];
  const fetchImpl = async (endpoint, init) => {
    requests.push(JSON.parse(init.body));
    headers.push(init.headers);
    return response({ data: { createComment: { success: true, comment: { databaseId: 99 } } } });
  };

  await submitBlogComment('https://cms.example/graphql', {
    commentOn: 10,
    author: 'Alex',
    authorEmail: 'alex@example.com',
    content: 'Useful guide.',
  }, fetchImpl, 'verification-token');
  await submitBlogComment('https://cms.example/graphql', {
    commentOn: 10,
    parent: 99,
    author: 'Sam',
    authorEmail: 'sam@example.com',
    content: 'Agreed.',
  }, fetchImpl);

  assert.equal(requests[0].query, createCommentMutation);
  assert.equal(requests[0].variables.input.parent, undefined);
  assert.equal(requests[1].variables.input.parent, 99);
  assert.equal(headers[0]['X-Turnstile-Token'], 'verification-token');
  assert.equal(headers[1]['X-Turnstile-Token'], undefined);
});

test('评论树按 parent 组装，孤立回复保留为根评论', () => {
  const tree = buildCommentTree([
    { databaseId: 2, date: '2026-11-25T02:00:00Z', parentDatabaseId: 1 },
    { databaseId: 3, date: '2026-11-25T03:00:00Z', parentDatabaseId: 404 },
    { databaseId: 1, date: '2026-11-25T01:00:00Z', parentDatabaseId: 0 },
  ]);
  assert.deepEqual(tree.map(comment => comment.databaseId), [1, 3]);
  assert.deepEqual(tree[0].children.map(comment => comment.databaseId), [2]);
});

test('评论投票 mutation 返回最新计数', async () => {
  let request;
  const summary = { up: 4, down: 1, score: 3, viewerVote: 'up' };
  const result = await voteBlogComment('https://cms.example/graphql', {
    commentId: 99,
    direction: 'up',
    visitorToken: 'b'.repeat(32),
  }, async (endpoint, init) => {
    request = JSON.parse(init.body);
    return response({ data: { belaroVoteComment: summary } });
  });
  assert.equal(request.query, voteCommentMutation);
  assert.deepEqual(request.variables.input, { commentId: 99, direction: 'up', visitorToken: 'b'.repeat(32) });
  assert.deepEqual(result, summary);
});
