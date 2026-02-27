# Specification

## Summary
**Goal:** Expand the proxy fallback chain to load more websites successfully in iframes, add dedicated TikTok handling, and improve the error state with retry and open-in-new-window options.

**Planned changes:**
- Add three additional proxies to the fallback chain (`codetabs.com`, `thingproxy.freeboard.io`, `yacdn.org`) after the existing three, attempted in sequence before showing an error state
- Add dedicated TikTok handling: try full proxy chain first, then fall back to `https://www.tiktok.com/embed/`, and if all fail show a direct link to TikTok opening in a new tab
- Update the TikTok card in QuickOpen to use `https://www.tiktok.com`
- Add a "Try Again" button in the error state that re-initiates the full proxy chain from the beginning
- Add an "Open in New Window" button in the error state that opens the original URL directly in a new browser tab
- Style both new buttons with the existing amethyst/purple neon glow theme

**User-visible outcome:** More websites load successfully inside tabs due to a longer proxy chain; TikTok has a best-effort embed strategy with a direct link fallback; users can retry or open any failed tab in a new window from the error screen.
