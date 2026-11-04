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

1. **Configure the production RFQ endpoint.** The local Gravity Forms integration is connected. Update `gravityForms` in `src/config.ts` for production, install the backend compatibility file described below, and verify an entry, drawing attachment and notification on the production domain.
2. **Confirm the contact email.** Replace `sales@belaroprecision.com` in `src/config.ts` with a monitored address.
3. **Replace stock imagery.** The current Unsplash images are visual placeholders. Replace them with genuine photos of your own machining, parts and inspection process. Do not imply a pictured machine or process is owned or operated by Belaro unless it is.
4. **Verify capability statements.** The ±0.01–0.02 mm range is explicitly qualified as typical and feature-dependent. Confirm it against your actual process before publication. Confirm CNC turning, materials, batch sizes and inspection documentation are genuinely available.
5. **Add company details.** Add your verified legal entity name, address, telephone, business hours, shipping terms and any certifications only after confirming them.
6. **Add legal pages.** Publish a privacy policy, cookie notice if required, terms and file-handling/confidentiality policy. Explain how uploaded CAD files are stored, accessed and deleted.
7. **Configure analytics and Ads.** Add GA4 and Google Ads conversion tracking after consent requirements are reviewed. Track successful RFQ submissions, not just button clicks. Add a conversion event only after the backend confirms successful receipt.
8. **SEO.** Each page has a title and description. Add real project case studies, unique material pages and industry-specific landing pages only when you have enough original information to make them useful.

## RFQ form integration

The RFQ uses the `submitGfForm` GraphQL mutation provided by **WPGraphQL for Gravity Forms**, alongside WPGraphQL and Gravity Forms. Text submissions use JSON; attachments use the GraphQL multipart request specification and require **WPGraphQL Upload**. No WordPress passwords or API secrets belong in this static website.

Configure `gravityForms` in `src/config.ts`:

- `graphqlUrl`: currently `https://belaroprecision.local/graphql`; replace for deployment.
- `formId`: defaults to `1`; change this when selecting a different backend form.
- `fields`: map each RFQ field to its database field `id` and `type`. Supported types are `text`, `name`, `email`, `file`, `consent`, and `checkbox`. A standard Checkbox mapping also requires `inputId` (e.g. `12.1`) and `choiceValue` matching the actual backend choice. A Consent field uses `type: 'consent'`.
- `uploadsEnabled`: set to `true` only after installing WPGraphQL Upload and verifying the `fileUploadValues` input exists.

On November 4, 2026, local form 1 (`RFQ`) was configured with Name=1, Email=3, Company=4, Country=5, optional Phone=6, Process=7, Material=8, Quantity=9, Delivery=10, Tolerance=11, Attachment=12, Project details=13, and required Consent=14. WPGraphQL Upload 0.1.5 is installed and active, alongside WPGraphQL 2.23.1 and WPGraphQL for Gravity Forms 0.13.4. These actual field mappings are configured and uploads are enabled. Changing form ID also requires checking every field mapping.

The optional Phone field follows Country / Region. Its calling-country selector is a searchable dropdown with flag icons and calling codes, populated from libphonenumber-js metadata at build time. Selecting a different phone country updates the code and keeps the entered number; it does not change the RFQ Country / Region field. Phone submits as one value (calling code plus number) to field 6; an empty number submits blank, and a pasted number starting with `+` is preserved without adding a second code. Backend Phone field 6 uses the plain International format (`phoneFormat: 'international'`), rather than the structured Formatted format. Live submissions verified the combined number `+86 13800138000` in entry 7 and a blank optional phone in entry 8.

The local site also has `wordpress/mu-plugins/belaro-graphql-upload.php` installed in its `wp-content/mu-plugins/` directory. Copy this file to the same directory on a new WordPress installation. It uses the WPGraphQL content-type filter to accept WPGraphQL Upload multipart requests only with `GraphQL-Require-Preflight: 1`, and adds that header to the GraphQL CORS allow-list. This is necessary because WPGraphQL 2.x otherwise rejects multipart requests with HTTP 415. It also registers the advertised CAD extensions with WordPress; file-content validation and Gravity Forms extension checks remain enabled. Text-based CAD formats and DWG use their registered MIME types; package CAD files in ZIP if their binary format fails WordPress MIME validation.

Use a single-page backend form. The current Name field uses `nameValues`: the first word goes to first name and the remaining words to last name. If the backend requires a last name, single-word names will receive its validation error; a Single Line Text full-name field with `type: 'text'` is an alternative. Email uses `emailValues`. Text, paragraph and dropdown fields use `value`. Material accepts custom text and delivery accepts values like “4–6 weeks”; keep compatible backend fields. Process and quantity may use text or dropdowns with matching stored values. Match required settings to the frontend.

Map `attachment` to a **single-file File Upload** field. Local field 12 allows `pdf, step, stp, iges, igs, x_t, dwg, dxf, zip` with a 20 MB limit, also enforced in the frontend. Ensure server upload and POST limits permit this size. Keep confirmations set to Text. Success requires a saved `entry.id` with no GraphQL or validation errors; backend HTML is never rendered. GraphQL multipart uploads set `operations`, `map` and the binary file, leaving the browser to set the content type.

Verify anonymous `submitGfForm` is allowed by the WordPress setup. For a frontend on a different origin, WordPress must allow the frontend origin through CORS, including JSON POST preflight and validation/error responses. The local HTTPS certificate must be trusted by the browser. Test from the actual frontend domain; a successful command-line request does not verify browser CORS. Do not expose administrative credentials. CAPTCHA or additional required fields need their corresponding integration. No automatic REST fallback or retry occurs, since an ambiguous response could already have saved an entry.

The form blocks duplicate clicks while submitting and after confirmed success. Validation errors appear beside their RFQ fields; network or unconfirmed responses retain entered details and never display success. When configuration is incomplete, no request is sent. Rebuild and redeploy the static site after changing any settings.

Integration reference: https://github.com/axewp/wp-graphql-gravity-forms/blob/develop/docs/submitting-forms.md

Run mapping tests with `node --test tests/gravity-forms.test.mjs`. After a build, run browser integration tests with `node --test tests/rfq-submission.test.mjs` (requires Playwright and Chromium).

Live verification on November 4, 2026: anonymous browser submissions from `http://localhost:4322` to the local HTTPS GraphQL endpoint passed for PDF, STEP and no attachment, including browser CORS/preflight. Entries 3, 4 and 5 contain the expected project details and consent; PDF/STEP file bytes were verified on disk. These are synthetic entries labeled `LOCAL TEST`; entry 2 is an earlier PDF test. Local email uses Mailpit. Production delivery and other CAD variants still need production checks. The automated tests mock submissions and do not create WordPress entries.

## Image and font notes

The starter references Unsplash-hosted placeholder photos and Google Fonts. For production, use licensed, optimized images and consider self-hosting fonts. Add descriptive alt text to every meaningful image.

## Deployment

The site is configured for static output. Run `npm run build`; deploy the generated `dist/` directory to your hosting provider or web server. Configure HTTPS, redirects, sitemap generation, robots.txt and 404 handling before launch.
