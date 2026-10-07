# Portfolio

Based on [DavidHDev/rbp-portfolio](https://github.com/DavidHDev/rbp-portfolio), adapted to a single page with Home, Projects, About, and Contact sections. Content is personalized from Usman’s resume and current professional summary.

## Development

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run typecheck`
- `npm run lint`

Light and dark themes follow the system preference initially and persist manual selections. Customize the co-located content in `components/hero`, `components/projects`, `components/about`, and `components/contact`. Original personal images remain in `public/images`.

Profile and contact details are shared through `lib/profile.ts`. Featured projects summarize OLA TMS and OPAL STMS; add site links and screenshots when available. Set `NEXT_PUBLIC_SITE_URL` to your actual portfolio URL before deployment.

## Contact email setup

The contact form posts to `/api/contact` and sends through Gmail SMTP. You receive the enquiry with the client's reply address; the client receives a branded confirmation with your reply address. Both emails include HTML and plain-text versions.

Copy `.env.example` to `.env.local`, set `GMAIL_USER` to your Gmail address, and set `GMAIL_APP_PASSWORD` to a Google App Password. Enable 2-Step Verification, then create the password at https://myaccount.google.com/apppasswords. Use an App Password rather than your regular account password. `CONTACT_TO_EMAIL` optionally overrides the enquiry inbox. Restart the dev server after editing environment variables; add the same variables to your production host. Never prefix these credentials with `NEXT_PUBLIC_` or commit `.env.local`.

The hosting environment must allow outbound TLS SMTP on port 465. The endpoint validates submissions, escapes email HTML, checks request origin, and limits requests per IP/email within each server instance. For multiple production instances, use a shared rate limiter or your hosting firewall. SMTP acceptance does not guarantee inbox delivery; check spam folders during the first live test. Live delivery requires your account configuration.

Run `node --test tests/contact.test.mjs` to check validation, templates, delivery flow, and SMTP failure handling with mocked delivery. No real emails are sent by these tests.
