# FoamBoss MVP — Technical Stack & Installation Guide

## 🧱 Framework & Core Tools
- **Framework:** React 19 (Vite + TypeScript)
- **Styling:** TailwindCSS v4 (with HeroUI integration)
- **UI Framework:** HeroUI 2.x Component Suite
- **Database & Auth:** Supabase
- **Animations & Forms:** Framer Motion, React Hook Form, Zod
- **Icons:** Lucide React
- **Routing:** React Router DOM 7.x
- **Utility Libraries:** clsx, date-fns, tailwind-variants, recharts

---

## ⚙️ Dependencies

### Production Dependencies
| Package | Version | Description |
|----------|----------|-------------|
| @heroui/avatar | 2.2.22 | Avatar component |
| @heroui/badge | 2.2.17 | Badge component |
| @heroui/button | 2.2.27 | Button component |
| @heroui/card | 2.2.25 | Card component |
| @heroui/dropdown | 2.3.27 | Dropdown menus |
| @heroui/input | 2.4.28 | Input fields |
| @heroui/link | 2.2.23 | Link component |
| @heroui/modal | 2.2.24 | Modal dialogs |
| @heroui/navbar | 2.2.25 | Navigation bar |
| @heroui/react | 2.8.5 | Core HeroUI package |
| @heroui/select | 2.4.28 | Select dropdowns |
| @heroui/spacer | 2.2.21 | Spacing component |
| @heroui/switch | 2.2.24 | Switch toggles |
| @heroui/table | 2.2.27 | Table layout component |
| @heroui/tooltip | 2.2.24 | Tooltip component |
| @supabase/supabase-js | 2.74.0 | Supabase client for auth & DB |
| clsx | 2.1.1 | Conditional class utility |
| date-fns | 4.1.0 | Date utilities |
| framer-motion | 12.23.22 | Animation framework |
| lucide-react | 0.545.0 | Icon library |
| react | 19.2.0 | React core |
| react-dom | 19.2.0 | React DOM renderer |
| react-hook-form | 7.64.0 | Form management |
| react-router-dom | 7.9.4 | Routing |
| tailwind-variants | 3.1.1 | Tailwind variant generator |
| recharts | 2.15.0 | Charting library for KPIs |
| zod | 4.1.12 | Schema validation |

---

### Development Dependencies
| Package | Version | Description |
|----------|----------|-------------|
| @types/react | 19.2.2 | TypeScript types for React |
| @types/react-dom | 19.2.1 | TypeScript types for React DOM |
| @vitejs/plugin-react | 5.0.4 | React fast-refresh support |
| autoprefixer | 10.4.21 | CSS autoprefixing |
| postcss | 8.5.6 | CSS processor |
| tailwindcss | 4.1.14 | Utility-first CSS framework |
| vite | 7.1.9 | Frontend build tool |

---

## 📦 Installation Commands

Run these commands **one at a time** from your project root:

### 1️⃣ Initialize Project
```bash
pnpm init
```

### 2️⃣ Install Core Dependencies
```bash
pnpm add react react-dom react-router-dom @supabase/supabase-js @heroui/react clsx date-fns framer-motion react-hook-form zod tailwind-variants lucide-react recharts
```

### 3️⃣ Install HeroUI Components
```bash
pnpm add @heroui/avatar @heroui/badge @heroui/button @heroui/card @heroui/dropdown @heroui/input @heroui/link @heroui/modal @heroui/navbar @heroui/select @heroui/spacer @heroui/switch @heroui/table @heroui/tooltip
```

### 4️⃣ Install Dev Dependencies
```bash
pnpm add -D @types/react @types/react-dom @vitejs/plugin-react autoprefixer postcss tailwindcss vite
```

---

## ⚡ Tailwind + HeroUI Setup

### hero.ts
```ts
import { heroui } from "@heroui/react";

export default heroui({
  prefix: "heroui",
  addCommonColors: true,
  defaultTheme: "dark",
  themes: {
    dark: {
      colors: {
        background: "#121212",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#D7263D",
          foreground: "#ffffff"
        },
        secondary: {
          DEFAULT: "#A78BFA",
          foreground: "#ffffff"
        },
        content1: "#1E1E1E"
      }
    },
    light: {
      colors: {
        background: "#ffffff",
        foreground: "#121212",
        primary: {
          DEFAULT: "#D7263D",
          foreground: "#ffffff"
        },
        secondary: {
          DEFAULT: "#A78BFA",
          foreground: "#121212"
        },
        content1: "#f4f4f4"
      }
    }
  }
});
```

---

### src/styles/globals.css
```css
@import "tailwindcss";
@plugin '../../hero.ts';
@source '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}';
@custom-variant dark (&:is(.dark *));

html, body {
  @apply bg-background text-foreground overflow-x-hidden;
}
```

---

### src/app/main.tsx
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import App from "./App";
import "../styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <main className="dark text-foreground bg-background min-h-screen">
        <App />
      </main>
    </HeroUIProvider>
  </React.StrictMode>
);
```

---

## 🧠 Notes
- Tailwind v4 automatically detects config from `globals.css` — no `tailwind.config.js` required.
- HeroUI theming is handled via the `hero.ts` plugin.
- `.npmrc` must include:
  ```
  public-hoist-pattern[]=*@heroui/*
  ```
- Recharts now powers KPI visualizations with tooltips, gradients, and motion transitions.

---

## 🚀 Run the Dev Server
```bash
pnpm dev
```

App runs at **http://localhost:5173** by default.

---

## Supabase Configuration

Set your project credentials before enabling Supabase features:

1. Copy `.env.example` to `.env`.
2. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase project settings.
3. Restart `pnpm dev` so Vite picks up the new environment variables.

The app now exposes a `SupabaseProvider` and `useSupabase` hook for future data/auth integration. Without credentials the provider stays inert and logs a warning in development.
