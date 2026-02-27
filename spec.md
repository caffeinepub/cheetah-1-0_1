# Specification

## Summary
**Goal:** Replace the CORS proxy provider from `allorigins.win` to `google.com` across the frontend codebase.

**Planned changes:**
- Update proxy URL generation logic in `useTabs.ts` to use `google.com` instead of `allorigins.win`
- Update proxy provider references in `HomeSearch.tsx` to use `google.com`
- Update proxy provider references in `TabContent.tsx` to use `google.com`

**User-visible outcome:** The browser now routes requests through `google.com` as the CORS proxy provider instead of `allorigins.win`.
