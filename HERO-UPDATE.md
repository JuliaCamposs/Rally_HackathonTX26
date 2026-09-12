# Rally hero update

The landing hero now uses slowly moving forest, teal, and lime gradient fields inspired by the supplied reference, with a fine grain texture. The background is CSS-based, requires no new packages, and does not download the reference image.

Changes:
- components/landing/landing-hero.tsx
- components/landing/landing-hero.module.css (new)

The hero also has a larger high-contrast headline, lime call-to-action, secondary How it works link, and a cleaner phone composition. Existing download copy and /app destination are retained. Styles are scoped to this hero.

Motion: three transform animations run on 22, 26, and 30 second alternating loops. The Pause motion button pauses all three fields and resumes from the same position. The prefers-reduced-motion setting disables the animations and hides the motion button. A stable dark scrim preserves text contrast.

Validation:
- Targeted ESLint check passed.
- Production compilation and TypeScript checks passed; next build exited 0 and generated the landing page.
- During page-data collection, the unchanged Prisma dependency reported that its Windows query-engine DLL could not load under this machine's ARM64 Node runtime. Backend/database functionality was not validated. Use a compatible Node/Prisma runtime for backend testing.
- Browser checks at desktop and 390px mobile width: no horizontal overflow; headline, CTA, and phone rendered correctly.
- Verified all three animation layers run, pause, and resume; no browser console errors on the landing page.
- Reduced-motion behavior is implemented via CSS media query; OS-level emulation was not exercised.

To run: extract the archive, enter rally, run pnpm install --frozen-lockfile, then pnpm dev. The landing page is at http://localhost:4317.

The included archive preserves the supplied app and replaces only the hero component, adds its CSS module, and adds this handoff note. Dependency installs and local build artifacts are not included.
