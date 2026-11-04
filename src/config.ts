export const site = {
  name: 'Belaro Precision',
  shortName: 'BELARO',
  domain: 'https://belaroprecision.com',
  email: 'sales@belaroprecision.com', // Replace with your monitored business email.
  phone: '', // Add only a published business number.
  description: 'Precision CNC machining for OEM manufacturers. Drawing-based components for industrial machinery and automation applications.',
};

// Public settings only: never add WordPress passwords or API secrets here.
export const gravityForms = {
  graphqlUrl: 'https://belaroprecision.local/graphql',
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
    delivery: { id: 10, type: 'text' },
    tolerance: { id: 11, type: 'text' },
    attachment: { id: 12, type: 'file' },
    details: { id: 13, type: 'text' },
    consent: { id: 14, type: 'consent' },
  },
  uploadsEnabled: true,
};
