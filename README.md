<p align="center">
  <img src="docs/hero.svg" width="100%" alt="MoodMate Animated Hero" />
</p>

<h1 align="center">MoodMate</h1>

<p align="center">
  <strong>AI-Powered Mood Journal & Emotional Wellness Companion</strong><br/>
  Write how you feel, get AI insights, track mood patterns, and build emotional awareness over time.
</p>

<p align="center">
  <a href="https://capsule-render.vercel.app/api?type=waving&color=0:1a0a2e,100:ff6b9d&text=MoodMate&fontSize=40&fontColor=ffffff&height=120&animation=fadeIn">
    <img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a0a2e,100:ff6b9d&text=MoodMate&fontSize=40&fontColor=ffffff&height=120&animation=fadeIn" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vitest-6E9F17?style=flat-square&logo=vitest&logoColor=white" />
  <img src="https://img.shields.io/badge/React+Native-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Tests-Compiled-brightgreen?style=flat-square" />
</p>

---

### The Problem

Mental health apps are either too clinical (therapy apps) or too trivial (emoji trackers). MoodMate sits in the middle — **structured journaling with AI-powered emotional pattern recognition**, without the stigma of a "mental health app".

### What It Does

```
  ┌──────────┐     ┌──────────────┐     ┌──────────────┐
  │  Write   │────▶│  AI Sentiment│────▶│  Mood Graph  │
  │  Entry   │     │  Analysis    │     │  & Trends    │
  └──────────┘     └──────────────┘     └──────┬───────┘
                                                │
                    ┌──────────────┐     ┌──────▼───────┐
                    │  Insights &  │◀────│  Pattern     │
                    │  Suggestions │     │  Detection   │
                    └──────────────┘     └──────────────┘
```

### Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Free-Write Journal** | Unstructured text with mood tagging |
| 2 | **5-Point Mood Scale** | 😞 😟 😐 🙂 😊 with emoji |
| 3 | **AI Sentiment** | Keyword + pattern mood detection |
| 4 | **Mood Timeline** | Line chart of mood over days/weeks |
| 5 | **Pattern Alerts** | Detects mood drops, triggers, cycles |
| 6 | **Journal Prompts** | Guided questions for deeper reflection |
| 7 | **Gratitude Mode** | Quick 3 things I'm grateful for |
| 8 | **Streak Tracking** | Consecutive journaling days |
| 9 | **Search Entries** | Full-text search across all entries |
| 10 | **Dark Mode** | Calming dark theme by default |
| 11 | **PWA + Mobile** | Installable, works offline |
| 12 | **Export Data** | JSON/Markdown backup of all entries |

### Quick Start

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # production build
# Mobile:
npx react-native init MoodMateMobile
```

### Architecture

```
moodmate/
├── src/
│   ├── components/    # JournalEntry, MoodChart, Insights
│   ├── hooks/         # useJournal, useMood, useInsights
│   ├── lib/           # Types, moodEngine, sentiment
│   ├── store/         # localStorage persistence
│   └── App.tsx
├── docs/hero.svg
├── android/           # React Native (excluded from git)
└── package.json
```

### Data Honesty

| What we store | Where | Retention |
|---------------|-------|-----------|
| Journal entries | localStorage | Forever |
| Mood data | localStorage | Forever |
| AI analysis | Client-side only | Never leaves device |
| No cloud | — | — |
| No accounts | — | — |
| No PII sent anywhere | — | — |

### Built by

**[@joshiyaa-dev](https://github.com/joshiyaa-dev)** — Your emotions deserve a safe space.

---

<p align="center">
  <img src="docs/hero.svg" width="60%" />
</p>
<p align="center">
  <sub>Private. Intelligent. Yours.</sub>
</p>
