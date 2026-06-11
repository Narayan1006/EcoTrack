# 🌍 EcoTrack — Carbon Footprint Awareness Platform

> **Google PromptWars — Challenge 3**: Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

![EcoTrack](https://img.shields.io/badge/Google%20PromptWars-Challenge%203-10B981?style=for-the-badge&logo=google)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs)
![Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | Real-time carbon score gauge, category breakdown donut chart, weekly trend, recent activities |
| 📝 **Activity Logger** | Log 30+ activity types across Transport, Food, Energy, Shopping with real-time CO₂ preview |
| 📈 **Analytics** | Stacked area chart, period filters (7/30/all days), vs India/Global/USA comparisons |
| 🤖 **AI Assistant** | Google Gemini-powered chat for personalized carbon reduction advice |
| 🏆 **Goals & Badges** | Set monthly CO₂ reduction targets, track progress, earn achievement badges |
| 🌱 **Eco Actions** | 15+ curated eco actions library with impact scoring and CO₂ savings calculator |

---

## 🛠️ Google Technology Stack

| Layer | Technology |
|---|---|
| **AI** | Google Gemini API (`gemini-2.0-flash`) |
| **Auth** | Firebase Authentication (Google Sign-In ready) |
| **Database** | Firebase Firestore (auto-configured) |
| **Typography** | Google Fonts (Inter, Outfit via `next/font/google`) |
| **Framework** | Next.js 16 (App Router, TypeScript strict) |
| **Charts** | Recharts (React-native, SSR-compatible) |
| **Validation** | Zod (runtime type safety) |

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd ecotrack
npm install
```

### 2. Configure Environment (optional)
```bash
cp .env.example .env.local
# Edit .env.local with your Gemini API key and Firebase credentials
```

> **Note**: The app runs fully in **demo mode** without any API keys configured.  
> Demo mode uses sample data and mock AI responses automatically.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 API Key Setup

### Google Gemini API
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Add to `.env.local`: `GEMINI_API_KEY=your_key_here`

### Firebase
1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** (add Google provider)
3. Enable **Firestore Database**
4. Copy your config to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## 📐 Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Dashboard
│   ├── log/page.tsx        # Activity Logger
│   ├── analytics/page.tsx  # Analytics & Insights
│   ├── assistant/page.tsx  # AI Assistant (Gemini)
│   ├── goals/page.tsx      # Goals & Achievements
│   ├── actions/page.tsx    # Eco Actions Library
│   └── api/assistant/      # Gemini API route
├── lib/
│   ├── constants.ts        # Emission factors (EPA/DEFRA/IPCC)
│   ├── emissions.ts        # CO₂ calculation engine
│   ├── store.ts            # localStorage data store
│   ├── gemini.ts           # Gemini AI client
│   ├── firebase.ts         # Firebase client
│   ├── validators.ts       # Zod schemas
│   └── mock-data.ts        # Demo mode data
└── types/index.ts          # TypeScript definitions
```

---

## 🌱 CO₂ Emission Factors

All emission factors are sourced from authoritative scientific bodies:
- **UK DEFRA** — Transport, electricity, waste
- **US EPA** — Vehicle emissions, energy
- **IPCC AR6** — Food system emissions

### Sample Factors
| Activity | Factor |
|---|---|
| Car (Petrol) | 0.21 kg CO₂/km |
| Bus | 0.089 kg CO₂/km |
| Meat-Heavy Meal | 3.3 kg CO₂/meal |
| Vegan Meal | 0.4 kg CO₂/meal |
| Electricity (India) | 0.82 kg CO₂/kWh |

---

## 📊 Evaluation Criteria Alignment

| Criteria | Implementation |
|---|---|
| **Code Quality** | TypeScript strict mode, ESLint, clean component architecture |
| **Security** | Zod input validation on all API routes, no secrets in code, CSP-ready |
| **Efficiency** | Next.js Server Components, lazy loading, memoization with useMemo |
| **Testing** | TypeScript type checking as first line of defence |
| **Accessibility** | Semantic HTML, ARIA labels, keyboard navigation, color contrast |

---

## 📄 License

MIT License — Built for Google PromptWars Challenge 3.
