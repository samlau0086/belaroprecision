import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import { parseHTML } from 'linkedom';
import { resolveLiveChatConfig } from '../src/lib/livechat-config.mjs';

// 显式开启耗时的双平台构建矩阵；最后恢复默认产物供其他回归使用。
test('双平台构建实际应用客服替换、停用与默认配置', { skip: process.env.LIVECHAT_BUILD_MATRIX !== '1', timeout: 300000 }, async () => {
  const variants = [
    { PUBLIC_LIVECHAT_ENABLED: 'true', PUBLIC_LIVECHAT_SCRIPT_URL: 'https://chat.example.com/embed.js', PUBLIC_LIVECHAT_CHANNEL_ID: '12345678-1234-1234-1234-123456789abc' },
    { PUBLIC_LIVECHAT_ENABLED: 'false', PUBLIC_LIVECHAT_SCRIPT_URL: 'invalid', PUBLIC_LIVECHAT_CHANNEL_ID: 'invalid' },
    { PUBLIC_LIVECHAT_ENABLED: '', PUBLIC_LIVECHAT_SCRIPT_URL: '', PUBLIC_LIVECHAT_CHANNEL_ID: '' },
  ];
  for (const variables of variants) {
    for (const [config, directory] of [[null, 'dist'], ['astro.pages.config.mjs', 'dist-pages']]) {
      const result = spawnSync(process.execPath, ['node_modules/astro/astro.js', 'build', ...(config ? ['--config', config] : [])], {
        env: { ...process.env, PUBLIC_GRAPHQL_URL: 'https://cms.example.com/graphql', ...variables, ASTRO_TELEMETRY_DISABLED: '1' },
        encoding: 'utf8', timeout: 90000,
      });
      assert.ifError(result.error);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      const expected = resolveLiveChatConfig(variables);
      const files = (await readdir(directory, { recursive: true })).filter(path => path.endsWith('.html') && path !== '404.html');
      assert.equal(files.length, 14);
      for (const file of files) {
        const { document } = parseHTML(await readFile(`${directory}/${file}`, 'utf8'));
        const scripts = document.querySelectorAll('script[data-channel]');
        assert.equal(scripts.length, expected.enabled ? 1 : 0, `${directory}/${file}`);
        assert.equal(document.querySelector('[data-back-to-top]').classList.contains('with-livechat'), expected.enabled);
        if (expected.enabled) {
          assert.equal(scripts[0].getAttribute('src'), expected.scriptUrl);
          assert.equal(scripts[0].getAttribute('data-channel'), expected.channelId);
          assert.ok(scripts[0].hasAttribute('async'));
        }
      }
      console.log(`${directory}: ${variables.PUBLIC_LIVECHAT_ENABLED || '默认'} 配置通过 14 页验证`);
    }
  }
});
