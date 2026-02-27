# Specification

## Summary
**Goal:** Remove all loading states and loading UI from the iframe tab browsing experience in Cheetah 1.0.

**Planned changes:**
- Remove per-tab loading indicators from `TabBar.tsx`
- Remove the loading overlay/spinner from `TabContent.tsx` so the iframe renders immediately when a URL is set
- Remove or stop using `isLoading`/`loading` state tracking in `useTabs.ts` for tab rendering
- Preserve error state UI for when all proxy fallbacks fail

**User-visible outcome:** When a URL is loaded in any iframe tab, no loading spinner or overlay appears at any point — the iframe is shown immediately. Error messages still display if all proxy attempts fail.
