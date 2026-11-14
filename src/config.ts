import { resolveLiveChatConfig } from './lib/livechat-config.mjs';

export const site = {
  name: 'Belaro Precision',
  shortName: 'BELARO',
  legalName: 'Shenzhen GEEKMATE Technology Co., Ltd.',
  legalNameZh: '深圳市极客码头科技有限公司',
  location: "Shajing, Bao'an District, Shenzhen, China",
  domain: 'https://belaroprecision.com',
  email: 'sales@belaroprecision.com', // Replace with your monitored business email.
  phone: '', // Add only a published business number.
  whatsapp: '+86 186 8218 8709',
  whatsappUrl: 'https://wa.me/8618682188709',
  description: 'Precision CNC machining for OEM manufacturers. Drawing-based components for industrial machinery and automation applications.',
};

export const googleTagManagerId = (import.meta.env.PUBLIC_GTM_ID || '').trim();

// 公开配置在构建时读取，修改平台变量后需重新构建部署。
export const liveChat = resolveLiveChatConfig({
  PUBLIC_LIVECHAT_ENABLED: import.meta.env.PUBLIC_LIVECHAT_ENABLED,
  PUBLIC_LIVECHAT_SCRIPT_URL: import.meta.env.PUBLIC_LIVECHAT_SCRIPT_URL,
  PUBLIC_LIVECHAT_CHANNEL_ID: import.meta.env.PUBLIC_LIVECHAT_CHANNEL_ID,
});

// Public settings only: never add WordPress passwords or API secrets here.
export const gravityForms = {
  graphqlUrl: (import.meta.env.PUBLIC_GRAPHQL_URL || '').trim() || 'https://belaroprecision.local/graphql',
  formId: 1,
  // Actual database field IDs in form 1; recheck when switching forms.
  fields: {
    name: { id: 1, type: 'name' },
    email: { id: 3, type: 'email' },
    company: { id: 4, type: 'text' },
    country: { id: 5, type: 'text' },
    phone: { id: 6, type: 'text' },
    process: { id: 7, type: 'text' },
    material: { id: 8, type: 'text' },
    quantity: { id: 9, type: 'text' },
    tolerance: { id: 11, type: 'text' },
    attachment: { id: 12, type: 'file' },
    details: { id: 13, type: 'text' },
    consent: { id: 14, type: 'consent' },
    documents: { id: 15, type: 'checkboxes', choices: [
      { inputId: 15.1, value: 'FAI report' },
      { inputId: 15.2, value: 'CMM / dimensional report' },
      { inputId: 15.3, value: 'EN 10204 3.1 material cert' },
    ] },
  },
  uploadsEnabled: true,
  turnstileSiteKey: (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '').trim(),
};
