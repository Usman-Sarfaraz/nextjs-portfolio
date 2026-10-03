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
