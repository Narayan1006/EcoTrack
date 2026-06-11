# 🌍 EcoTrack — Carbon Footprint Awareness Platform

> **Google PromptWars — Challenge 3**: Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-ecotrack--30cac.web.app-10B981?style=for-the-badge)](https://ecotrack-30cac.web.app)
[![GitHub](https://img.shields.io/badge/GitHub-Narayan1006%2FEcoTrack-181717?style=for-the-badge&logo=github)](https://github.com/Narayan1006/EcoTrack)

![Google PromptWars](https://img.shields.io/badge/Google%20PromptWars-Challenge%203-10B981?style=for-the-badge&logo=google)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs)
![Firebase](https://img.shields.io/badge/Firebase%20Hosting-Live-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google)

---

## 🔗 Links

| Resource | URL |
|---|---|
| 🌐 **Live App** | https://ecotrack-30cac.web.app |
| 📦 **GitHub Repository** | https://github.com/Narayan1006/EcoTrack |

---

## 🎯 What is EcoTrack?

EcoTrack is a **personal carbon footprint tracker** that helps individuals:
- Understand the CO₂ impact of their daily activities (transport, food, energy, shopping)
- Visualize their emissions through beautiful, interactive charts
- Compare their footprint against India, Global, and USA averages
- Set monthly reduction goals and earn achievement badges
- Get personalized eco-friendly action recommendations

The app works **fully in demo mode** out of the box — no sign-in required.

---

## 🗺️ Full Application Flow

### 1️⃣ Landing Page (`/`)
- Cinematic fullscreen hero section with looping video background
- Smooth fade-in/fade-out video transition loop
- **"Start Tracking"** button → navigates to `/dashboard`
- **"See How It Works"** button → scrolls to feature section
- Feature cards explaining the app's 6 core modules

### 2️⃣ Dashboard (`/dashboard`)
- **Carbon Score Gauge** — SVG arc gauge showing today's CO₂ (colour-coded: green/yellow/red)
- **4 Stat Cards** — Today's Footprint, Daily Average, Total Tracked, Activities Logged
- **Category Breakdown Donut Chart** — Transport / Food / Energy / Shopping % split
- **Weekly Trend Area Chart** — Last 7 days of emissions plotted over time
- **Recent Activities List** — Last 5 logged activities with category icons and CO₂ values
- **Quick Log Grid** — One-tap shortcuts: Car Trip, Bus Ride, Veg Meal, Coffee, Electricity, etc.
- **"+ Log Activity"** CTA button → navigates to `/log`

### 3️⃣ Log Activity (`/log`)
- **Category Selector** — 4 chips: 🚗 Transport | 🍽️ Food | ⚡ Energy | 🛍️ Shopping
- **Activity Type Dropdown** — 30+ subtypes with emission factor shown per unit
- **Amount Input + Date Picker** — numeric input with unit hint (km, kWh, meal, etc.)
- **Optional Note** — free-text field for context
- **Live CO₂ Preview** — real-time estimate updating as you type
- **Submit** — saves to localStorage, shows success toast
- **Activity History Panel** — filterable list of all past activities with delete option

### 4️⃣ Analytics (`/analytics`)
- **Period Filter Tabs** — 7 Days / 30 Days / All Time
- **4 Summary Stats** — Total CO₂, Daily Average, Activity Count, vs India Avg status
- **Stacked Area Chart** — Daily emissions broken down by category over time
- **Donut Distribution Chart** — category % with percentage labels
- **Comparison Bar Chart** — Your avg vs India avg (5.48 kg/day) vs Global (13.15) vs USA (47)
- **Bar Chart by Day** — last 14 days bar chart with day-of-week labels

### 5️⃣ AI Assistant (`/assistant`)
- **Gemini-powered chat** — Google Gemini 2.0 Flash (falls back to mock responses if no key)
- **Quick Suggestion Chips** — pre-filled prompts to get started instantly
- **Conversation History** — multi-turn chat with last 10 messages as context
- **Graceful Fallback** — smart mock responses when API key is unavailable
- **Real-time typing indicator** — animated loading dots during AI response

### 6️⃣ Goals & Achievements (`/goals`)
- **Create Monthly Goal** — set a title, target CO₂ (kg), and month
- **Progress Bars** — live fill showing current vs target with % label
- **Over-Budget Warning** — bar turns red when target exceeded
- **Achievement Badges Grid** — 8 badges (First Step, Green Week, Carbon Cutter, etc.)
- **Badge Unlock Logic** — badges auto-unlock based on activity milestones

### 7️⃣ Eco Actions Library (`/actions`)
- **15+ Curated Actions** — Switch to LED, Go Vegan for a Week, Use Public Transport, etc.
- **Filter by Category** — Transport / Food / Energy / Shopping
- **Filter by Impact** — High / Medium / Low
- **CO₂ Savings Display** — shows kg saved per year for each action
- **Mark as Done / Undo** — toggle completion state
- **Summary Stats** — Total Completed, Total CO₂ Saved, Trees Equivalent

---

## ✨ Features Summary

| Module | Key Capabilities |
|---|---|
| 📊 **Dashboard** | SVG gauge, donut chart, area chart, quick log, recent activities |
| 📝 **Activity Logger** | 30+ activity types, live CO₂ preview, history with filters |
| 📈 **Analytics** | Period filters, stacked charts, 4-way country comparison |
| 🤖 **AI Assistant** | Gemini 2.0 Flash chat, multi-turn history, mock fallback |
| 🏆 **Goals & Badges** | Monthly targets, progress bars, 8 achievement badges |
| 🌱 **Eco Actions** | 15+ actions, impact/category filters, CO₂ savings tracker |

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | SSR-compatible static export |
| **Language** | TypeScript 5 (strict mode) | Type safety across entire codebase |
| **AI** | Google Gemini 2.0 Flash | Personalized carbon reduction advice |
| **Hosting** | Firebase Hosting | CDN-served static deployment |
| **Analytics** | Firebase Analytics | Usage tracking |
| **Charts** | Recharts | Responsive data visualizations |
| **Validation** | Zod | Runtime schema validation on API inputs |
| **Styling** | Vanilla CSS + CSS Variables | Premium editorial light-mode design |
| **Typography** | Instrument Serif + Inter (Google Fonts) | Cinematic editorial feel |
| **State** | localStorage (client-side) | Zero-backend demo mode |

---

## 📐 Architecture

The codebase is divided into **three strict layers** for separation of concerns and independent testability:

```
src/
│
├── backend/                      # Pure business logic — zero React dependencies
│   ├── constants.ts              # CO₂ emission factors (DEFRA / EPA / IPCC AR6)
│   ├── emissions.ts              # CO₂ calculation engine
│   ├── firebase.ts               # Firebase SDK initialisation
│   ├── gemini.ts                 # Google Gemini AI client (with rate-limit fallback)
│   ├── mock-data.ts              # Demo data generators
│   └── validators.ts             # Zod input validation schemas
│
├── ui/                           # React / client-side code only
│   ├── store.ts                  # localStorage state manager (full CRUD)
│   └── components/
│       ├── StoreInitializer.tsx  # Hydrates demo data on first mount
│       └── layout/
│           └── Sidebar.tsx       # Responsive navigation sidebar
│
├── app/                          # Next.js App Router — thin routing layer
│   ├── globals.css               # Design system (CSS variables, typography)
│   ├── layout.tsx                # Root layout (fonts, metadata, SEO)
│   ├── (landing)/                # Public landing page (no sidebar)
│   │   └── page.tsx              # Cinematic hero section with video bg
│   └── (app)/                    # Inner app (sidebar layout)
│       ├── layout.tsx            # Wraps pages with Sidebar + StoreInitializer
│       ├── dashboard/page.tsx
│       ├── log/page.tsx
│       ├── analytics/page.tsx
│       ├── assistant/page.tsx
│       ├── goals/page.tsx
│       ├── actions/page.tsx
│       └── api/assistant/route.ts  # Server-side Gemini handler
│
└── types/
    └── index.ts                  # Shared TypeScript interfaces & enums
```

### Layer Import Rules

| Layer | Purpose | Can import from |
|---|---|---|
| `backend/` | Pure functions, AI, DB, calculations | `types/` only |
| `ui/` | React components, client state | `backend/`, `types/` |
| `app/` | Next.js pages & routes | `backend/`, `ui/`, `types/` |

---

## 🚀 Quick Start (Local Dev)

```bash
# 1. Clone
git clone https://github.com/Narayan1006/EcoTrack.git
cd EcoTrack

# 2. Install dependencies
npm install

# 3. Set up environment (optional — app runs in demo mode without keys)
cp .env.example .env
# Edit .env with your Gemini API key and Firebase credentials

# 4. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Demo Mode**: The app works fully without any API keys. It auto-generates 90 days of sample activity data and uses smart mock AI responses.

---

## 🌱 CO₂ Emission Factors

All factors sourced from authoritative scientific bodies:

| Source | Data Used |
|---|---|
| **UK DEFRA 2023** | Transport, electricity grid intensity, waste |
| **US EPA** | Vehicle emissions, household energy |
| **IPCC AR6 (2021)** | Food system lifecycle emissions |

### Sample Factors

| Activity | Emission Factor |
|---|---|
| Car — Petrol | 0.21 kg CO₂/km |
| Car — EV (India grid) | 0.09 kg CO₂/km |
| Bus | 0.089 kg CO₂/km |
| Flight (Economy) | 0.255 kg CO₂/km |
| Meat-Heavy Meal | 3.3 kg CO₂/meal |
| Vegan Meal | 0.4 kg CO₂/meal |
| Electricity (India) | 0.82 kg CO₂/kWh |
| LPG Cooking | 2.98 kg CO₂/kg |

---

## 📊 Evaluation Criteria Alignment

| Criteria | Implementation |
|---|---|
| **Code Quality** | TypeScript strict mode, ESLint, 3-layer clean architecture |
| **Separation of Concerns** | `backend/` has zero React imports; fully unit-testable |
| **Security** | Zod validation on all API inputs, `.env` excluded from git |
| **Efficiency** | Static export, `useMemo` memoization, localStorage caching |
| **Accessibility** | Semantic HTML5, ARIA labels, keyboard navigation, contrast ratios |
| **Responsiveness** | Mobile-first CSS grid, collapsible sidebar on small screens |

---

## 🔑 Environment Variables

Copy `.env.example` → `.env` and fill in:

```env
# Google Gemini AI (from https://aistudio.google.com/apikey)
GEMINI_API_KEY=your_key
NEXT_PUBLIC_GEMINI_API_KEY=your_key

# Firebase (from Firebase Console → Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## 📄 License

MIT License — Built for Google PromptWars Challenge 3.
