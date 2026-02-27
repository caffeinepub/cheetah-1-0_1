# Specification

## Summary
**Goal:** Add a new Proxy page to the Cheetah 1.0 app that lists the three proxy services used by the app, accessible from the sidebar navigation.

**Planned changes:**
- Add a "Proxy" entry to the sidebar navigation alongside Home, Games, AI, Code, Quick Open, and Education.
- Create a new Proxy page displaying three proxy cards: ProxySite, ProxyOrb, and ProxyProxy.
- Visually distinguish ProxyProxy as the primary proxy with a "Primary" badge or highlighted border.
- Each card shows the proxy name, a truncated URL, and a launch button.
- Launch buttons open the respective proxy URL using the existing tab/proxy navigation system (useTabs.ts).
- Style the page consistently with the existing amethyst/purple dark theme.

**User-visible outcome:** Users can navigate to the Proxy page from the sidebar, see all three proxy services listed as cards, identify the primary proxy at a glance, and launch any proxy directly through the app's tab system.
