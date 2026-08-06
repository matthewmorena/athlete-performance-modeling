# TFRRS frontend lint-clean patch

Apply this ZIP from the repository root so the included `tfrrs-frontend/` paths replace the matching files.

Verified in the supplied project:

- `npm run lint` — passes with zero errors and zero warnings
- `npx tsc --noEmit` — passes

The full Next.js build could not be executed in the Linux sandbox because the uploaded `node_modules` contains the Windows SWC binary. Run `npm run build` locally after applying the patch.
