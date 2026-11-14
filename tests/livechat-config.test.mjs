import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLiveChatConfig } from '../src/lib/livechat-config.mjs';

test('客服默认值与空白变量保留现有配置', () => {
  const defaults = resolveLiveChatConfig({});
  assert.equal(defaults.enabled, true);
  assert.equal(defaults.scriptUrl, 'https://wsdesk.geekmt.com/livechat/embed.js');
  assert.equal(defaults.channelId, '3c60547b-7bb7-48c3-8f4a-813af839ff13');
  assert.deepEqual(resolveLiveChatConfig({ PUBLIC_LIVECHAT_ENABLED: ' ', PUBLIC_LIVECHAT_SCRIPT_URL: '', PUBLIC_LIVECHAT_CHANNEL_ID: ' ' }), defaults);
});

test('客服配置支持去除首尾空白、更换地址与频道，以及独立停用', () => {
  assert.deepEqual(resolveLiveChatConfig({
    PUBLIC_LIVECHAT_ENABLED: ' true ',
    PUBLIC_LIVECHAT_SCRIPT_URL: ' https://chat.example.com/embed.js ',
    PUBLIC_LIVECHAT_CHANNEL_ID: ' 12345678-1234-1234-1234-123456789abc ',
  }), { enabled: true, scriptUrl: 'https://chat.example.com/embed.js', channelId: '12345678-1234-1234-1234-123456789abc' });
  assert.equal(resolveLiveChatConfig({ PUBLIC_LIVECHAT_ENABLED: ' false ', PUBLIC_LIVECHAT_SCRIPT_URL: 'invalid', PUBLIC_LIVECHAT_CHANNEL_ID: 'invalid' }).enabled, false);
});

test('客服拒绝无效开关、不安全地址和无效频道，不回显配置值', () => {
  for (const value of ['0', '1', 'FALSE', 'yes']) {
    assert.throws(() => resolveLiveChatConfig({ PUBLIC_LIVECHAT_ENABLED: value }), /PUBLIC_LIVECHAT_ENABLED/);
  }
  for (const value of ['invalid', 'http://chat.example.com/embed.js', 'javascript:alert(1)', 'https://user:secret@chat.example.com/embed.js', 'https://chat.example.com/embed.js#fragment']) {
    assert.throws(() => resolveLiveChatConfig({ PUBLIC_LIVECHAT_SCRIPT_URL: value }), error => {
      assert.match(error.message, /PUBLIC_LIVECHAT_SCRIPT_URL/);
      assert.ok(!error.message.includes(value));
      return true;
    });
  }
  assert.throws(() => resolveLiveChatConfig({ PUBLIC_LIVECHAT_CHANNEL_ID: 'invalid' }), /PUBLIC_LIVECHAT_CHANNEL_ID/);
});
