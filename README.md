# CROFAI

A modern, brutalist-themed landing page for CROF.AI - an AI inference platform offering powerful models at crazy cheap pricing.

## Features

### Design System
- **Brutalist Typography**: Uses DM Mono and Bebas Neue fonts for a bold, monospace aesthetic
- **Purple Color Palette**: 
  - Primary: #7C3AED
  - Light: #A855F7
  - Dark: #6D28D9
- **Dark Theme**: #0A0A0A background with #111111 surface colors

### Components

#### Hero Section
- Animated text reveal with GSAP
- Large typography with uppercase styling
- 3D perspective code preview card
- Call-to-action buttons

#### Code Preview Component
- Typewriter animation effect
- Tab switching (Python/JavaScript)
- Floating animation with purple glow
- 3D perspective tilt on hover
- Sharp corners (border-radius: 0)

#### Feature Grid (ChromaGrid)
- 6 premium SVG icons with sharp corners
- Purple glow effect on hover
- Icon color transition from white to purple
- Intersection Observer stagger animation
- 3×2 grid layout

#### Pricing Section
- Multiple pricing tiers
- Popular badge highlighting
- Feature lists with checkmarks

#### Models Table
- LLM pricing information
- Quantization details
- Speed metrics

## Tech Stack

- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Animation**: GSAP + Framer Motion
- **Styling**: CSS Modules
- **Font**: DM Mono, Bebas Neue, Geist

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/sarankumar1325/CROFAI.git
cd CROFAI

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
crofai/
├── src/
│   ├── components/
│   │   ├── CodePreview/     # Animated code preview component
│   │   ├── ChromaGrid/      # Feature grid with SVG icons
│   │   └── ...
│   ├── pages/
│   │   ├── LandingPage/     # Main landing page
│   │   └── DocsPage/        # Documentation page
│   ├── assets/
│   └── App.tsx
├── public/
└── package.json
```

## Features Implemented

- ✅ Brutalist/monospace typography with DM Mono
- ✅ Purple color system replacing neon green
- ✅ Animated code preview with typewriter effect
- ✅ 3D perspective tilt on code preview card
- ✅ Feature grid with premium SVG icons
- ✅ Sharp corners (border-radius: 0)
- ✅ Purple glow effects on hover
- ✅ Stagger fade-in animations
- ✅ Responsive design

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT License

## Contact

Project Link: https://github.com/sarankumar1325/CROFAI
