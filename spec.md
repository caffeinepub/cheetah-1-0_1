# Specification

## Summary
**Goal:** Add a placeholder education site card to the Games/Education page in Cheetah 1.0.

**Planned changes:**
- Add a new card to the grid in `frontend/src/pages/Games.tsx` labeled "New Education Site" with a generic education icon and description "User-requested educational site"
- Use a placeholder URL that is clearly marked for update
- Apply the same neon glow hover, glassmorphism styling, and `openUrl` proxy mechanism as existing cards

**User-visible outcome:** A new education site card appears in the Games page grid, styled consistently with existing cards, ready to open a user-specified URL in a proxy iframe tab once the URL is updated.
