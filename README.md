# Belaro Precision — Astro Website Template

A responsive, English-language B2B website starter for Belaro Precision. Built with Astro and plain CSS; no UI framework required.

## Included pages

- `/` — Homepage and primary conversion journey
- `/services/` — CNC milling, turning and production support
- `/industries/` — Industrial automation, machinery, hydraulic/pneumatic and laboratory equipment
- `/quality/` — Drawing review, inspection approach and tolerance qualification
- `/about/` — Company positioning and operating principles
- `/contact/` — RFQ form with drawing upload field

## Requirements

- Node.js 22.23.4 or newer in the Node 22 line (or a currently supported Astro Node version)
- npm

## Run locally

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Before publishing — important checklist

1. **Connect the RFQ form.** Edit `src/config.ts` and set `formEndpoint` to a form provider endpoint (for example, a Formspree endpoint configured to accept file uploads) or your own secure RFQ API. The current form is a front-end template and does not transmit enquiries until connected. Test file upload size/type limits, spam protection, notification delivery and success/error states.
2. **Confirm the contact email.** Replace `sales@belaroprecision.com` in `src/config.ts` with a monitored address.
3. **Replace stock imagery.** The current Unsplash images are visual placeholders. Replace them with genuine photos of your own machining, parts and inspection process. Do not imply a pictured machine or process is owned or operated by Belaro unless it is.
4. **Verify capability statements.** The ±0.01–0.02 mm range is explicitly qualified as typical and feature-dependent. Confirm it against your actual process before publication. Confirm CNC turning, materials, batch sizes and inspection documentation are genuinely available.
5. **Add company details.** Add your verified legal entity name, address, telephone, business hours, shipping terms and any certifications only after confirming them.
6. **Add legal pages.** Publish a privacy policy, cookie notice if required, terms and file-handling/confidentiality policy. Explain how uploaded CAD files are stored, accessed and deleted.
7. **Configure analytics and Ads.** Add GA4 and Google Ads conversion tracking after consent requirements are reviewed. Track successful RFQ submissions, not just button clicks. Add a conversion event only after the backend confirms successful receipt.
8. **SEO.** Each page has a title and description. Add real project case studies, unique material pages and industry-specific landing pages only when you have enough original information to make them useful.

## RFQ form integration

The form uses `site.formEndpoint` from `src/config.ts` as its action. Set it to your chosen provider's endpoint and follow that provider's requirements for multipart file uploads. The current no-endpoint state intentionally prevents a false success message. A production implementation should add server-side validation, upload limits, malware scanning, access controls, retention/deletion rules, rate limiting and a clear success page.

## Image and font notes

The starter references Unsplash-hosted placeholder photos and Google Fonts. For production, use licensed, optimized images and consider self-hosting fonts. Add descriptive alt text to every meaningful image.

## Deployment

The site is configured for static output. Run `npm run build`; deploy the generated `dist/` directory to your hosting provider or web server. Configure HTTPS, redirects, sitemap generation, robots.txt and 404 handling before launch.
