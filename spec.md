# Specification

## Summary
**Goal:** Switch the CORS proxy service back to allorigins.win across the frontend.

**Planned changes:**
- Replace the proxy base URL in `useTabs.ts` with `https://api.allorigins.win/raw?url=`
- Update any hardcoded proxy references in `HomeSearch.tsx` and `TabContent.tsx` to use allorigins.win
- Ensure proxy status labels/indicators reflect allorigins.win as the active proxy

**User-visible outcome:** All proxied tab navigations route through allorigins.win, and the proxy label in the UI correctly shows allorigins.win.
