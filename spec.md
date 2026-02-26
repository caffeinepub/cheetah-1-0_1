# Specification

## Summary
**Goal:** Build "Cheetah 1.0," a single-page proxy browser app with an amethyst/purple high-tech theme, multi-tab iframe browsing, and five functional pages.

**Planned changes:**
- Create the app shell with an animated amethyst gradient background, glassmorphism panels, neon glow effects, monospace font, and a header displaying "Cheetah 1.0" with a cheetah logo icon
- Implement a sidebar navigation with five destinations: Home/Search, Games, AI Assistant, Code Editor, and Quick Open; smooth transitions between pages
- Build a persistent tab bar above the main content area supporting multiple simultaneous iframe tabs, with title, favicon placeholder, close button, and a "+" new-tab button; keyboard shortcuts Ctrl+T, Ctrl+W, Ctrl+L
- Build the Home/Search page with an address bar, Google CSE (ID: 464f1cf85006c4770) search widget, back/forward/refresh controls, iframe loading via allorigins.win proxy, loading spinner, and error fallback with direct link
- Build the Games page as a responsive grid of 10 clickable cards (Math Playground, Cool Math Games, Hooda Math, ABCya, Funbrain, PBS Kids Games, Typing Club, Scratch, Khan Academy, Prodigy Game), each opening in a new proxy iframe tab
- Build the AI Assistant (Homework Helper) page using Puter.js CDN (`window.puter.ai.chat`) with subject selector, question textarea, Get Answer button, markdown-rendered response area, Copy Answer button, loading spinner, and scrollable Q&A history
- Build the Code Editor page with three sub-tabs: (1) CodeMirror (CDN) editor with language selector, Run button, live preview, and localStorage persistence; (2) Presentation Builder with add/delete slides, title/body/bg color, prev/next navigation, and fullscreen Present mode; (3) Website Builder with component blocks (text, image placeholder, button, header), live preview, and a "Public sharing" note
- Build the Quick Open page as a grid of 6 large cards (TikTok, YouTube, Wikipedia, Disney Plus, ChatGPT, Google Gemini) with brand accent colors, each opening in a new proxy iframe tab
- Persist open tabs state and settings to localStorage; responsive layout for 768px and wider

**User-visible outcome:** Users can browse proxied external websites in multiple iframe tabs, search via Google CSE, access game and quick-open site shortcuts, get AI homework help, write and run code, build presentations, and compose simple web pages — all within a sleek amethyst-themed SPA.
