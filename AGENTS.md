# AGENTS.md

## Project Overview
**Pokémon GO Buddy Exciter** is a mobile-responsive Progressive Web App (PWA) designed to guide trainers through getting their buddy Pokémon into the "Excited" mood without using a Poffin. It tracks Emotion Points (EP), provides cooldown timers with browser & audio notifications, features an interactive checklist, and manages a maintenance countdown once excited.

## Core Mechanics
- Target EP: 32 points.
- Core 30-min Cycle: Feed (+2 EP), Play (+2 EP), Snapshot (+2 EP), Battle Team Leader & surrender immediately (+2 EP).
- Bonus Activities: Rocket battles (+2 EP), Gym/Raid battles (+2 EP), Walk 2km (+3 EP), Routes (+2 EP).
- Decay: 1 EP decay every 25-30 minutes of inactivity.
- Maintenance Mode: Every 20 minutes once excited, remind trainer to perform a quick interaction (Pet or Snapshot) to keep EP >= 32.

## Technology Stack
- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Notifications**: Web Notification API + Service Worker + Web Audio API synthesizer
- **Testing**: Vitest + React Testing Library + JSDOM

## Commands
- `npm run dev` - Start local development server
- `npm run build` - TypeScript check & production build
- `npm run test` - Run automated test suite
- `npm run preview` - Preview production build
