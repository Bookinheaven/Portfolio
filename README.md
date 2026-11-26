# Tanvik Sri Ram Reddy - Portfolio

A minimalist, data-driven software engineering portfolio built with **React 19**, **Vite 8**, **Tailwind CSS v4**, **shadcn/ui (`@base-ui/react`)**, and **Framer Motion**. Designed around horizontal section navigation, dual Dark/Light palettes, a cursor-linked `<canvas>` dot-matrix background, and structured project case studies.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Styling & UI Primitives**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) + [shadcn/ui](https://ui.shadcn.com/) (`base-luma` style on `@base-ui/react`)
- **Motion & Icons**: [Framer Motion](https://www.framer.com/motion/), [React Icons](https://react-icons.github.io/react-icons/), [Lucide React](https://lucide.dev/)
- **Data Layer**: Centralized in [`src/data/portfolio.json`](src/data/portfolio.json)

---

## Key Features

- **Horizontal Snap Navigation & Floating Dock**: Smooth wheel, trackpad, drag, and arrow-key navigation across 5 full-viewport views (`Home`, `Projects`, `Skills`, `About`, `Certifications`), paired with a unified bottom dock (`src/components/layout/Navigation.jsx`).
- **Reactive Cursor & `<canvas>` Dot Matrix**: An HTML5 `<canvas>` dot-grid background (`StudioBackground`) that illuminates, scales, and displaces with spring physics around the pointer and emits expanding ripple waves on click—synced with a `1:1` core dot and spring reticle (`CursorSpotlight`).
- **Zero-Flash Dual Themes**: Automatic OS `prefers-color-scheme` detection in `index.html` with a persistent Dark/Light toggle (`#030304` obsidian-black with subtle white dots vs. `#f8f8f6` warm paper with slate/cobalt accents).
- **Command Palette (`⌘K` / `Ctrl+K`)**: Keyboard-first quick switcher (`CommandPalette.jsx`) to jump between sections, open any project case study, open tailored resumes, toggle themes, or copy contact email.
- **URL Deep Linking**: Syncs `?project=<id>` and `#section` hashes with `history.pushState` and browser Back/Forward navigation.
- **Interactive Views**:
  - **Home**: Rotating engineering focus headline, live IST clock, quick recruiter CTAs (Projects, Resume, Email copy), and a staggered 2×2 `<SpotlightCard />` featured showcase.
  - **Projects & Case Study**: Domain-filtered project carousel with smooth shimmer-to-sharp `<SmoothImage />` previews and full technical case study overlays (metrics, architecture layers, capabilities, tradeoffs, and challenges).
  - **Skills & Skill Chart**: Categorized technology directory with brand icons, interactive SVG radar **Skill Chart** (`SkillChart.jsx`), and per-technology **Project Proof** cards.
  - **About**: Concise background and education summary paired with a tabbed **Experience & Hackathons** and **Timeline** panel.
  - **Certifications & Resumes**: Top credentials grid, role-tailored PDF resume selector (`General SWE`, `Full-Stack`, `AI / ML`), and direct email actions.

---

## Local Development

```bash
# 1. Clone the repository
git clone https://github.com/Bookinheaven/Portfolio.git
cd Portfolio

# 2. Install dependencies
npm install

# 3. (Optional) Configure visitor email alerts
cp .env.example .env

# 4. Start the development server
npm run dev
```

Available npm scripts in `package.json`:
- `npm run dev` — Start Vite dev server
- `npm run build` — Build production bundle to `dist/`
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run ESLint

---

## Project Structure

```text
Portfolio/
├── api/
│   └── session.js                      
├── public/
│   ├── images/projects/                
│   ├── Tanvik_Sri_Ram_Reddy_General_Resume.pdf
│   ├── Tanvik_Sri_Ram_Reddy_FullStack_Resume.pdf
│   ├── Tanvik_Sri_Ram_Reddy_AI_Resume.pdf
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/                     # HorizontalContainer, Navigation, CommandPalette
│   │   ├── project/                    # ProjectCaseStudy modal & gallery viewer
│   │   ├── ui/                         # shadcn primitives + CursorSpotlight, StudioBackground, SmoothImage, SpotlightCard
│   │   └── views/                      # HomeView, ProjectsView, SkillsView, SkillChart, AboutView, CertificationsView
│   ├── data/
│   │   └── portfolio.json              # Single source of truth for profile, skills, projects, experience & certs
│   ├── lib/
│   │   ├── session.js                  # Client session sync helper
│   │   └── utils.js                    # Tailwind `cn` helper
│   ├── App.jsx
│   ├── index.css                       # Tailwind v4 setup & Dark/Light CSS theme variables
│   └── main.jsx
├── components.json                     # shadcn/ui configuration (base-luma)
├── vite.config.js                      # Vite + Tailwind v4 + React plugin config
└── .env.example
```

---

## Updating Content

All portfolio data is driven by [`src/data/portfolio.json`](src/data/portfolio.json):
- **Resumes**: Place PDFs inside `public/` and update paths under `personal.resumes` (`general`, `fullstack`, `ai`).
- **Projects & Screenshots**: Store screenshots in `public/images/projects/<project-id>/` and reference them inside each project's `gallery` array (`gallery[0].src` acts as the primary card and spotlight preview).
- **Skills**: Add entries to `skills` and attach their `id`s to project `skills` arrays to populate both the `SkillsView` directory and the `SkillChart` radar.

---

## License

This project is open-source and available under the MIT License.
