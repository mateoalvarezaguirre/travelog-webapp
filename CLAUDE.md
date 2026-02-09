# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Travelog is a Spanish-language travel journal web application built with Next.js 16 (App Router). Currently a frontend-only prototype with mock/hardcoded data — no backend or database integration yet.

## Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — ESLint check (next/core-web-vitals + next/typescript)
- No test framework is configured yet

## Architecture

**Framework:** Next.js 16 with App Router, React 18, TypeScript (strict mode)

**Routing:** All pages live in `/app` using file-based routing. Almost every page is a Client Component (`"use client"`) since the app is interaction-heavy. The root layout (`app/layout.tsx`) is the only Server Component and sets up fonts (Inter + Merriweather via next/font) and the navbar.

**Routes:**
- `/` — Landing page with carousel and features
- `/login`, `/register`, `/forgot-password` — Auth pages (UI only, no real auth)
- `/journals` — Journal list with tabs and Pixabay API image fetching
- `/journals/[id]` — Journal detail (dynamic route)
- `/create` — Journal creation form
- `/explore` — Public journals feed
- `/map` — Interactive travel map
- `/profile` — User profile with stats

**UI Stack:**
- Tailwind CSS v3 with CSS custom properties for theming (HSL-based, amber/orange palette)
- shadcn/ui (New York style) with Radix UI primitives — components live in `/components/ui/`
- class-variance-authority (CVA) for component variants
- Lucide React for icons
- `cn()` utility in `lib/utils.ts` merges Tailwind classes via clsx + tailwind-merge

**Forms:** react-hook-form + Zod for validation (login, register, create journal pages)

**Path alias:** `@/*` maps to project root (`./`)

**Dark mode:** Class-based via Tailwind (`darkMode: ["class"]`), with CSS variables defined in `app/globals.css`

## Key Patterns

- State is managed locally with React hooks (`useState`, `useEffect`). No global state manager.
- Data is currently mock/hardcoded arrays inside page components. The `/journals` page fetches images from the Pixabay API with a hardcoded key.
- Loading states use Next.js `loading.tsx` convention with skeleton UI (present in `/journals` and `/map`).
- The app uses a vintage/nostalgic travel journal aesthetic with paper textures, serif headings, and warm gradient backgrounds.
- Responsive design follows mobile-first approach with Tailwind breakpoints (`md:`, `lg:`).
- Custom component: `components/navbar.tsx` (responsive nav with mobile menu).

## shadcn/ui

Add new components with: `npx shadcn@latest add <component-name>`

Configuration is in `components.json`. Components install to `components/ui/`, utilities to `lib/`, hooks to `hooks/`.
