export const blogQuery = `
  query BlogIndex {
    categories(first: 100) {
      nodes { databaseId name slug }
    }
    posts(first: 12, where: { status: PUBLISH }) {
      nodes {
        databaseId slug title uri date excerpt
        featuredImage { node { sourceUrl altText } }
        categories { nodes { databaseId name slug } }
      }
    }
  }
`;

export const articleContentFields = `
  articleContent {
    contentBlocks {
      __typename
      ... on ArticleContentContentBlocksRichTextLayout { content width }
      ... on ArticleContentContentBlocksHeadingLayout { text level width }
      ... on ArticleContentContentBlocksImageLayout { image { node { sourceUrl altText } } caption width }
      ... on ArticleContentContentBlocksMediaTextLayout { heading content width image { node { sourceUrl altText } } imagePosition }
      ... on ArticleContentContentBlocksCalloutLayout { variant content attribution width }
      ... on ArticleContentContentBlocksSpecTableLayout { heading width rows { label value } }
      ... on ArticleContentContentBlocksCallToActionLayout { heading description width link { url title target } }
      ... on ArticleContentContentBlocksFixedBackgroundLayout {
        heading description buttonType buttonLabel link { url title target }
        document { node { mediaItemUrl } }
        backgroundImage { node { sourceUrl altText } }
        minHeight width
      }
    }
  }
`;

export const blogPostQuery = `
  query BlogPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      databaseId slug title content excerpt date modified
      featuredImage { node { sourceUrl altText } }
      categories { nodes { databaseId name slug } }
      comments(first: 100) {
        nodes {
          databaseId content date parentDatabaseId
          author { node { name } }
        }
      }
    }
  }
`;

export const blogVotesQuery = `
  query BlogVotes($slug: ID!, $visitorToken: String!) {
    post(id: $slug, idType: SLUG) {
      belaroCommentVotes(visitorToken: $visitorToken) { commentId up down score viewerVote }
    }
  }
`;

export function articlePath(slug) {
  return `/post/${encodeURIComponent(String(slug))}/`;
}

export function categoryPath(slug) {
  return `/category/${encodeURIComponent(String(slug))}/`;
}

export function articleBreadcrumbCategory(categories) {
  const sorted = (Array.isArray(categories) ? categories : [])
    .filter(category => typeof category?.name === 'string' && category.name.trim() && typeof category.slug === 'string' && category.slug.trim())
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) || a.slug.localeCompare(b.slug, 'en'));
  const first = sorted[0];
  return first && first.name.trim().toLowerCase() !== 'uncategorized' && first.slug.toLowerCase() !== 'uncategorized' ? first : null;
}

export function blogCategories(posts) {
  return [...new Map(posts.flatMap(post => post.categories?.nodes || []).filter(category => category.slug).map(category => [category.databaseId, category])).values()];
}

export async function fetchPublishedBlogPosts(endpoint, fetchImpl = fetch) {
  const posts = [];
  let after = null;
  do {
    const data = await requestGraphQL(endpoint, `
      query BlogStaticPosts($after: String) {
        posts(first: 100, after: $after, where: { status: PUBLISH }) {
          nodes {
            databaseId slug title content excerpt date modified
            featuredImage { node { sourceUrl altText } }
            categories { nodes { databaseId name slug } }
            ${articleContentFields}
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    `, { after }, fetchImpl);
    if (!Array.isArray(data?.posts?.nodes) || !data.posts.pageInfo) throw new Error('WordPress article routes are incomplete');
    posts.push(...data.posts.nodes);
    if (!data.posts.pageInfo.hasNextPage) break;
    const next = data.posts.pageInfo.endCursor;
    if (!next || next === after) throw new Error('WordPress article pagination did not advance');
    after = next;
  } while (true);
  return posts;
}

export const createCommentMutation = `
  mutation CreateBlogComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      success
      comment { databaseId }
    }
  }
`;

export const voteCommentMutation = `
  mutation VoteBlogComment($input: BelaroVoteCommentInput!) {
    belaroVoteComment(input: $input) {
      up down score viewerVote
    }
  }
`;

async function requestGraphQL(endpoint, query, variables, fetchImpl, token = '') {
  const response = await fetchImpl(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { 'X-Turnstile-Token': token } : {}) },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`WordPress returned HTTP ${response.status}`);
  const result = await response.json();
  if (result.errors?.length) {
    const message = result.errors.map(error => error?.message).filter(Boolean).join(' ');
    throw new Error(`WordPress GraphQL query failed${message ? `: ${message}` : ''}`);
  }
  return result.data;
}

export async function fetchBlogData(endpoint, fetchImpl = fetch) {
  const data = await requestGraphQL(endpoint, blogQuery, undefined, fetchImpl);
  if (!Array.isArray(data?.categories?.nodes) || !Array.isArray(data?.posts?.nodes)) {
    throw new Error('WordPress GraphQL response is incomplete');
  }
  return { categories: data.categories.nodes, posts: data.posts.nodes };
}

export async function fetchBlogPost(endpoint, slug, visitorToken, fetchImpl = fetch) {
  const normalizedSlug = String(slug || '').trim();
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(normalizedSlug)) throw new Error('A valid article slug is required');
  const data = await requestGraphQL(endpoint, blogPostQuery, { slug: normalizedSlug }, fetchImpl);
  if (!data?.post) return null;
  if (!Array.isArray(data.post.comments?.nodes)) throw new Error('WordPress comment response is incomplete');
  return { ...data.post, comments: data.post.comments.nodes };
}

export async function fetchBlogVotes(endpoint, slug, visitorToken, fetchImpl = fetch) {
  const data = await requestGraphQL(endpoint, blogVotesQuery, { slug, visitorToken }, fetchImpl);
  if (!Array.isArray(data?.post?.belaroCommentVotes)) throw new Error('WordPress voting is unavailable');
  return data.post.belaroCommentVotes;
}

export function attachCommentVotes(comments, summaries) {
  const votes = new Map(summaries.map(summary => [Number(summary.commentId), summary]));
  return comments.map(comment => ({
    ...comment,
    belaroVotes: votes.get(Number(comment.databaseId)) || { up: 0, down: 0, score: 0, viewerVote: '' },
  }));
}

export async function submitBlogComment(endpoint, input, fetchImpl = fetch, turnstileToken = '') {
  const commentOn = Number(input?.commentOn);
  const content = String(input?.content || '').trim();
  const author = String(input?.author || '').trim();
  const authorEmail = String(input?.authorEmail || '').trim();
  const parent = Number(input?.parent || 0);
  if (!Number.isInteger(commentOn) || commentOn < 1 || !content || !author || !authorEmail) {
    throw new Error('Complete all required comment fields');
  }
  const mutationInput = { commentOn, content, author, authorEmail };
  if (Number.isInteger(parent) && parent > 0) mutationInput.parent = parent;
  const data = await requestGraphQL(endpoint, createCommentMutation, { input: mutationInput }, fetchImpl, turnstileToken);
  if (!data?.createComment?.success) throw new Error('WordPress did not accept the comment');
  return data.createComment.comment || null;
}

export async function voteBlogComment(endpoint, input, fetchImpl = fetch) {
  const commentId = Number(input?.commentId);
  const direction = String(input?.direction || '');
  const visitorToken = String(input?.visitorToken || '');
  if (!Number.isInteger(commentId) || commentId < 1 || !['up', 'down', 'clear'].includes(direction)) {
    throw new Error('Invalid comment vote');
  }
  const data = await requestGraphQL(endpoint, voteCommentMutation, {
    input: { commentId, direction, visitorToken },
  }, fetchImpl);
  const summary = data?.belaroVoteComment;
  if (!summary || !Number.isInteger(summary.up) || !Number.isInteger(summary.down)) {
    throw new Error('WordPress vote response is incomplete');
  }
  return summary;
}

export function buildCommentTree(comments = []) {
  const nodes = new Map();
  for (const comment of comments) {
    const id = Number(comment?.databaseId);
    if (Number.isInteger(id) && id > 0) nodes.set(id, { ...comment, children: [] });
  }
  const roots = [];
  for (const comment of nodes.values()) {
    const parentId = Number(comment.parentDatabaseId || comment.parent?.node?.databaseId || 0);
    if (parentId && parentId !== comment.databaseId && nodes.has(parentId)) nodes.get(parentId).children.push(comment);
    else roots.push(comment);
  }
  const byDate = (a, b) => Date.parse(a.date || 0) - Date.parse(b.date || 0);
  const sortBranch = branch => {
    branch.sort(byDate);
    branch.forEach(comment => sortBranch(comment.children));
  };
  sortBranch(roots);
  return roots;
}

export function plainText(value = '') {
  return String(value).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#039;|&apos;/gi, "'").replace(/\s+/g, ' ').trim();
}
