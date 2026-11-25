import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';

const contentTypes = {
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

test('Blog 列表、本站详情、层级回复与评论投票', { timeout: 60_000 }, async () => {
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const relative = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
      let body = await readFile(join(process.cwd(), 'dist', relative));
      if (relative === '/blog/article/hello-world/index.html') body = Buffer.from(body.toString().replace(/data-turnstile-sitekey(?:="[^"]*")?/, 'data-turnstile-sitekey="test-site-key"'));
      res.setHeader('Content-Type', contentTypes[extname(relative)] || 'application/octet-stream');
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const requests = [];
  let browser;
  let votingUnavailable = false;

  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(baseUrl) ? route.continue() : route.fallback());
    await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js**', route => route.fulfill({ contentType: 'application/javascript', body: 'window.turnstile = { render: (el, options) => { window.testTurnstile = options; return "widget"; }, reset: () => { window.testTurnstileResets = (window.testTurnstileResets || 0) + 1; } };' }));
    await page.route('**/graphql', async route => {
      const request = JSON.parse(route.request().postData());
      requests.push({ ...request, headers: route.request().headers() });
      if (request.query.includes('BlogIndex')) {
        await new Promise(resolve => setTimeout(resolve, 600));
        await route.fulfill({ json: { data: {
          categories: { nodes: [{ databaseId: 3, name: 'Manufacturing', slug: 'manufacturing' }] },
          posts: { nodes: [{
            databaseId: 10,
            slug: 'hello-world',
            title: 'CNC Guide',
            uri: '/cnc-guide/',
            date: '2026-11-25T08:00:00Z',
            excerpt: '<p>A practical guide.</p>',
            featuredImage: null,
            categories: { nodes: [{ databaseId: 3, name: 'Manufacturing', slug: 'manufacturing' }] },
          }] },
        } } });
      } else if (request.query.includes('BlogVotes')) {
        await route.fulfill({ json: votingUnavailable
          ? { errors: [{ message: 'Cannot query field "belaroCommentVotes" on type "Post".' }] }
          : { data: { post: { belaroCommentVotes: [{ commentId: 21, up: 2, down: 0, score: 2, viewerVote: '' }] } } } });
      } else if (request.query.includes('CreateBlogComment')) {
        await route.fulfill({ json: { data: { createComment: { success: true, comment: { databaseId: 23 } } } } });
      } else if (request.query.includes('VoteBlogComment')) {
        await route.fulfill({ json: { data: { belaroVoteComment: { up: 3, down: 0, score: 3, viewerVote: 'up' } } } });
      } else {
        await route.fulfill({ json: { data: { post: {
          databaseId: 10,
          slug: 'hello-world',
          title: 'CNC Guide',
          content: '<h2>Drawing review</h2><p>Confirm the current revision.</p><img src="javascript:alert(1)" onerror="alert(2)"><script>alert(3)</script>',
          excerpt: '<p>A practical guide.</p>',
          date: '2026-11-25T08:00:00Z',
          modified: '2026-11-25T08:00:00Z',
          featuredImage: null,
          categories: { nodes: [{ databaseId: 3, name: 'Manufacturing', slug: 'manufacturing' }] },
          belaroCommentVotes: [
            { commentId: 21, up: 2, down: 0, score: 2, viewerVote: '' },
            { commentId: 22, up: 0, down: 1, score: -1, viewerVote: '' },
          ],
          comments: { nodes: [
            { databaseId: 21, content: '<p>Useful article.</p>', date: '2026-11-25T09:00:00Z', parentDatabaseId: 0, author: { node: { name: 'Alex' } } },
            { databaseId: 22, content: '<p>Thanks for sharing.</p>', date: '2026-11-25T10:00:00Z', parentDatabaseId: 21, author: { node: { name: 'Sam' } } },
          ] },
        } } } });
      }
    });
    await page.goto(`${baseUrl}/blog/`);
    await page.locator('[data-blog-grid][aria-busy="true"]').waitFor();
    assert.equal(await page.locator('.blog-skeleton').count(), 3);
    const articleLink = page.getByRole('link', { name: 'CNC Guide', exact: true });
    await articleLink.waitFor();
    assert.equal(await articleLink.getAttribute('href'), '/blog/article/hello-world/');
    assert.equal((await articleLink.getAttribute('href')).includes('belaroprecision.local'), false);
    assert.equal(await page.locator('.blog-skeleton').count(), 0);
    assert.equal(await page.locator('.blog-card').evaluate(el => getComputedStyle(el).borderTopStyle), 'solid');
    assert.equal(await page.getByRole('button', { name: 'All articles' }).evaluate(el => getComputedStyle(el).minHeight), '46px');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (process.env.BLOG_SCREENSHOT_DIR) await page.screenshot({ path: join(process.env.BLOG_SCREENSHOT_DIR, 'blog-list-mobile.png'), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 900 });
    if (process.env.BLOG_SCREENSHOT_DIR) await page.screenshot({ path: join(process.env.BLOG_SCREENSHOT_DIR, 'blog-list-desktop.png'), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });

    const staticHtml = await (await fetch(`${baseUrl}/blog/article/hello-world/`)).text();
    assert.match(staticHtml, /data-prerendered="true"/);
    assert.match(staticHtml, /Welcome to WordPress/);
    assert.match(staticHtml, /rel="canonical" href="https:\/\/belaroprecision.com\/blog\/article\/hello-world\/?"/);
    await page.goto(`${baseUrl}/blog/article/hello-world/`);
    await page.getByRole('heading', { level: 1, name: 'CNC Guide' }).waitFor();
    assert.equal(await page.getByText('Thanks for sharing.').count(), 1);
    assert.equal(await page.locator('.comment').count(), 2);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.equal(await page.getByRole('button', { name: 'Upvote comment' }).count(), 2);
    await page.getByRole('button', { name: 'Upvote comment' }).first().waitFor({ state: 'visible' });
    assert.equal(await page.locator('.article-content script').count(), 0);
    assert.equal(await page.locator('.article-content').getByText('alert(3)').count(), 0);
    assert.equal(await page.locator('.article-content img').getAttribute('src'), null);
    assert.equal(await page.locator('.article-content img').getAttribute('onerror'), null);
    if (process.env.BLOG_SCREENSHOT_DIR) {
      await page.screenshot({ path: join(process.env.BLOG_SCREENSHOT_DIR, 'blog-article-mobile.png'), fullPage: true });
    }

    await page.getByRole('button', { name: 'Upvote comment' }).first().click();
    assert.equal(await page.getByRole('button', { name: 'Upvote comment' }).first().getAttribute('aria-pressed'), 'true');
    assert.equal(await page.getByRole('button', { name: 'Upvote comment' }).first().locator('span').innerText(), '3');
    const selectedStyle = await page.getByRole('button', { name: 'Upvote comment' }).first().evaluate(el => ({ color: getComputedStyle(el).color, background: getComputedStyle(el).backgroundColor, border: getComputedStyle(el).borderTopColor }));
    assert.equal(selectedStyle.color, 'rgb(169, 84, 18)');
    assert.equal(selectedStyle.background, 'rgba(0, 0, 0, 0)');
    assert.equal(selectedStyle.border, 'rgba(0, 0, 0, 0)');

    await page.getByRole('button', { name: 'Reply' }).first().click();
    await page.getByLabel('Name').fill('Taylor');
    await page.getByLabel('Email').fill('taylor@example.com');
    await page.getByRole('textbox', { name: 'Comment', exact: true }).fill('This is a reply.');
    await page.waitForFunction(() => window.testTurnstile);
    assert.equal(await page.getByRole('button', { name: 'Post comment' }).isDisabled(), true);
    await page.evaluate(() => window.testTurnstile.callback('test-token'));
    await page.evaluate(() => window.testTurnstile['expired-callback']());
    assert.equal(await page.getByRole('button', { name: 'Post comment' }).isDisabled(), true);
    await page.evaluate(() => window.testTurnstile.callback('test-token'));
    await page.getByRole('button', { name: 'Post comment' }).click();
    await page.getByText('Your comment was submitted and may be awaiting moderation.').waitFor();
    const commentRequest = requests.find(request => request.query.includes('CreateBlogComment'));
    assert.equal(commentRequest.variables.input.parent, 21);
    assert.equal(commentRequest.variables.input.commentOn, 10);
    assert.equal(commentRequest.headers['x-turnstile-token'], 'test-token');
    assert.equal(await page.evaluate(() => window.testTurnstileResets), 1);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.reload();
    await page.getByRole('heading', { level: 1, name: 'CNC Guide' }).waitFor();
    assert.equal(await page.getByLabel('Name').inputValue(), 'Taylor');
    assert.equal(await page.getByLabel('Email').inputValue(), 'taylor@example.com');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (process.env.BLOG_SCREENSHOT_DIR) {
      await page.screenshot({ path: join(process.env.BLOG_SCREENSHOT_DIR, 'blog-article-desktop.png'), fullPage: true });
    }
    assert.deepEqual(errors, []);
    votingUnavailable = true;
    await page.reload();
    await page.getByText('Voting is currently unavailable. You can still join the discussion.').waitFor();
    assert.equal(await page.getByRole('heading', { level: 1, name: 'CNC Guide' }).count(), 1);
    assert.equal(await page.getByText('Useful article.').count(), 1);
    assert.equal(await page.getByRole('button', { name: 'Upvote comment' }).first().isDisabled(), true);
    assert.equal(await page.getByRole('button', { name: 'Post comment' }).isDisabled(), true);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});
