# Pokémon GO Buddy Exciter

A mobile-first Progressive Web App (PWA) to guide Pokémon GO trainers through getting their buddy Pokémon into the **"Excited" mood without using a Poffin**.

Live Repository: [https://github.com/damodharanj/pokemon-go-buddy-exciter](https://github.com/damodharanj/pokemon-go-buddy-exciter)

---

## ✨ Features

- **Emotion Point (EP) Engine:** Tracks progress towards 32 EP required to reach Excited mood (halved candy distance + double hearts).
- **Interactive Checklist:**
  - 🍓 **Feed Buddy:** 3 berries on Round 1, 1 berry for subsequent rounds (+2 EP).
  - 🖐️ **Play / Pet:** Rub head in AR until hearts burst (+2 EP).
  - 📸 **Take Snapshot:** Photo in play screen (+2 EP).
  - ⚔️ **Battle Team Leader:** Master League training surrender trick (+2 EP).
  - 🚀 **Bonus Tasks:** Rocket battles, Gym/Raid, Walk 2 km, Routes.
- **Precision Cooldown Timers:** Wall-clock synchronized (`Date.now()`) 30-minute interval timers that never lag or sleep.
- **Web Notifications & Audio Chimes:** Sends browser notifications and 8-bit Pokémon audio chimes when cooldowns expire.
- **Maintenance Mode:** Automatically prompts every 20 minutes once excited to prevent the 1 EP / 25 min mood decay.
- **PWA & Offline Ready:** Includes service worker and manifest for "Add to Home Screen" on iOS & Android.

---

## 🚀 Deploying to Vercel

### Option 1: Import via Vercel Dashboard (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new).
2. Import the repository: `damodharanj/pokemon-go-buddy-exciter`.
3. Vercel automatically detects **Vite**:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**.

### Option 2: Using Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/damodharanj/pokemon-go-buddy-exciter.git
cd pokemon-go-buddy-exciter

# Install dependencies
npm install

# Start development server
npm run dev

# Run automated tests
npm test

# Build for production
npm run build
```

---

## 🧪 Tech Stack
- **Framework:** React 19 + TypeScript + Vite 6
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Notifications:** Web Notification API + Service Worker + Web Audio API
- **Testing:** Vitest + React Testing Library + JSDOM
