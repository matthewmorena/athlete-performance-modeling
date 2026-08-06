# Trackside Detail Pages Patch

This patch re-themes the existing data-driven detail pages without changing their routes or API behavior.

## Updated files

- `tfrrs-frontend/app/athletes/[id]/page.tsx`
- `tfrrs-frontend/app/meets/tf/[id]/page.tsx`
- `tfrrs-frontend/app/meets/xc/[id]/page.tsx`
- `tfrrs-frontend/app/teams/[team_slug]/page.tsx`
- `tfrrs-frontend/components/TFEventSection.tsx`
- `tfrrs-frontend/components/XCEventSection.tsx`
- `tfrrs-frontend/components/TickerChart.tsx`
- `tfrrs-frontend/app/globals.css`

## Highlights

- Uses the centralized Trackside palette tokens already defined in `globals.css`.
- Replaces the previous white/green cards and tables with dark panels, charcoal surfaces, warm text, and yellow accents.
- Adds responsive horizontal scrolling to result and roster tables.
- Adds accessible event accordion controls with content-height animations.
- Re-themes the Recharts ticker, including axes, grid, active point, trend summary, empty state, and tooltip.
- Preserves all existing API calls, route parameters, result scoring, and links.

## Validation

- ESLint: passed with zero errors and warnings.
- TypeScript (`tsc --noEmit`): passed.
- Next.js build could not run in the Linux sandbox because the uploaded dependencies contain a Windows SWC binary and external package retrieval is unavailable. Run `npm run build` locally.
