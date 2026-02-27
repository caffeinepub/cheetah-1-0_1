# Specification

## Summary
**Goal:** Replace the `allorigins.win` CORS proxy provider with `https://proxycroxy.io` across the Cheetah 1.0 frontend.

**Planned changes:**
- In `useTabs.ts`, replace all `allorigins.win` references with `https://proxycroxy.io` in the proxy fallback chain and URL construction logic
- In `TabContent.tsx` and `HomeSearch.tsx`, replace any hardcoded `allorigins.win` references with `https://proxycroxy.io`
- In `ProxyInfoPanel.tsx`, update displayed labels and descriptions that reference `allorigins.win` to show `https://proxycroxy.io`

**User-visible outcome:** All proxied content and iframe loading routes through `https://proxycroxy.io` instead of `allorigins.win`, and the ProxyInfoPanel displays the updated provider.
