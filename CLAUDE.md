# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CROFAI is a React + TypeScript + Vite application for **Crof.AI**, an AI inference platform. It features a brutalist-themed marketing landing page, API documentation, and a dashboard for managing API keys, usage monitoring, model playground, and arena (model comparison).

## Build & Development Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # TypeScript check + Vite production build
npm run preview    # Preview production build locally
npm run lint       # Run ESLint across all source files
```

## Tech Stack

- **Framework:** React 19 + TypeScript 6
- **Build:** Vite 8 + @vitejs/plugin-react 6 + React Compiler (Babel preset)
- **Styling:** TailwindCSS v4 + CSS Modules + CSS custom properties
- **Animations:** GSAP 3.15 + Framer Motion 12
- **Icons:** Lucide React
- **Linting:** ESLint 9 flat config with typescript-eslint, react-hooks, react-refresh

## Architecture

### Routing (hash-based, in [App.tsx](src/App.tsx))

All routing uses `window.location.hash`. The `hashchange` event drives page switching:

| Hash | Page |
|------|------|
| `#/` or default | [LandingPage](src/pages/LandingPage/Index.tsx) |
| `#/docs` | [DocsPage](src/pages/DocsPage/Index.tsx) |
| `#/dashboard` | [DashboardPage](src/pages/DashboardPage/index.tsx) |
| `#/playground` | [PlaygroundPage](src/pages/PlaygroundPage/index.tsx) |
| `#/arena` | [ArenaPage](src/pages/ArenaPage/index.tsx) |
| `#/plan` | [PricingPage](src/pages/PricingPage/index.tsx) |
| `#/settings` | [SettingsPage](src/pages/SettingsPage/index.tsx) |

### Page Structure

- **LandingPage** — Marketing sections: nav → hero → features grid (ChromaGrid) → integration curl block → pricing cards → LLM models pricing table → footer CTA
- **DocsPage** — API docs with sidebar navigation + code blocks (Python SDK examples for streaming, tools, vision, structured output, reasoning)
- **DashboardPage** — Usage dashboard with stats cards, bar chart for daily token usage, API key management (create/delete/copy), daily token progress bar, countdown timer
- **PlaygroundPage** — Chat UI with model selector dropdown, config sidebar (temperature/Top-P sliders, presets, toggles), streaming response simulation, empty state with quick-start prompts
- **ArenaPage** — Side-by-side split view comparing two model responses
- **PricingPage** — Plan grid (6 tiers) inside DashboardLayout
- **SettingsPage** — Account settings, password change, theme toggle, credit purchases, payment management, delete account

### Key Components

- **[DashboardLayout](src/components/DashboardLayout/index.tsx)** — Wraps authenticated pages with fixed top nav, mobile drawer menu, and page transition animation
- **[ChromaGrid](src/components/ChromaGrid/ChromaGrid.tsx)** — Feature icon grid with custom SVG icons, mouse-tracking glow effect, IntersectionObserver stagger animation
- **[CodePreview](src/components/CodePreview/CodePreview.tsx)** — Animated code preview with typewriter effect, tab switching (Python/JavaScript), GSAP floating animation, window chrome UI
- **[PremiumIcon](src/components/PremiumIcon/index.tsx)** — Animated SVG icon with rotating rings, pulsing hexagon, neural node dots, used as Playground empty state
- **[Logo](src/components/Logo/index.tsx)** — Reusable logo component with gradient icon + text, configurable size/text visibility

### Theming

- **ThemeContext** (`src/contexts/ThemeContext.tsx`) — Dark/light mode persisted to `localStorage`, sets `data-theme` attribute on `documentElement`
- **CSS custom properties** in [index.css](src/index.css) define all colors (--bg-base, --text-primary, --purple-primary, etc.) with dark and light variants
- Components use `var(--variable)` references — avoid hardcoding color values
- The [Typography System](src/styles/typography.css) uses JetBrains Mono (primary), DM Sans (headings), Bebas Neue (display)

### Styling Conventions

The codebase uses three approaches:
1. **CSS custom properties** via index.css (preferred for theming)
2. **Inline styles** — used heavily in dashboard pages (DashboardPage, PlaygroundPage, ArenaPage, SettingsPage, PricingPage)
3. **CSS Modules** — used in LandingPage (`Index.module.css`) and DocsPage (`Index.module.css`)
4. **Component-level CSS** — ChromaGrid uses `ChromaGrid.css`, CodePreview uses `CodePreview.module.css`

### Important Patterns

- Models list is duplicated across [PlaygroundPage](src/pages/PlaygroundPage/index.tsx), [ArenaPage](src/pages/ArenaPage/index.tsx), and [LandingPage](src/pages/LandingPage/Index.tsx) — update all copies when adding/removing models
- DashboardLayout checks `currentPage` prop to highlight active nav item
- All API interactions are simulated (mock data, fake streaming delays)
- Scroll-to-section navigation on LandingPage uses `#section-id` hash pattern
- Dashboard pages (Dashboard, Playground, Arena, Settings, Pricing) all render inside `<DashboardLayout currentPage="...">`
