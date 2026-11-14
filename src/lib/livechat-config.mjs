/** @param {Record<string, string | undefined>} env */
export function resolveLiveChatConfig(env) {
  const enabled = env.PUBLIC_LIVECHAT_ENABLED?.trim() || 'true';
  if (!['true', 'false'].includes(enabled)) {
    throw new Error('PUBLIC_LIVECHAT_ENABLED 必须为 true 或 false');
  }
  const config = {
    enabled: enabled === 'true',
    scriptUrl: env.PUBLIC_LIVECHAT_SCRIPT_URL?.trim() || 'https://wsdesk.geekmt.com/livechat/embed.js',
    channelId: env.PUBLIC_LIVECHAT_CHANNEL_ID?.trim() || '3c60547b-7bb7-48c3-8f4a-813af839ff13',
  };
  // 关闭时不校验未使用的配置，确保可独立停用客服。
  if (!config.enabled) return config;
  let url;
  try { url = new URL(config.scriptUrl); } catch {
    throw new Error('PUBLIC_LIVECHAT_SCRIPT_URL 必须为有效 HTTPS 地址');
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.hash) {
    throw new Error('PUBLIC_LIVECHAT_SCRIPT_URL 必须为 HTTPS 地址，且不能包含凭证或片段');
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(config.channelId)) {
    throw new Error('PUBLIC_LIVECHAT_CHANNEL_ID 必须为 UUID 格式的公开频道标识');
  }
  return config;
}
