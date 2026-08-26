# MoodMate — Daily Mood & Self-Care Companion

A mobile-first mood journal that can **see how you look** (optional, on-device
expression estimation via MediaPipe FaceLandmarker blendshapes), pre-fills your
check-in, and responds with emotion-aware supportive messages — while keeping
**every byte of data on your device**.

## Features

| Area | What it does |
|---|---|
| Mood check-in | 1–5 emoji scale + optional comment + trigger tags (Work/Family/Health/Sleep/Money…) |
| Mood Scan | Optional camera scan: 52 blendshapes → weighted expression classifier → temporal stabilizer → Happy/Sad/Angry/Surprised/Fearful/Disgusted/Neutral with confidence % |
| Check-in pre-fill | Accepted scan suggests a mood value — always overridable by you |
| Emotion-aware replies | Deterministic supportive templates matched to expression + suggested self-care tool; TTS voice rate/pitch adapts to tone |
| Crisis guardrail | Journal keyword escalation always surfaces real helplines (Tele-MANAS 14416, AASRA, Vandrevala) |
| Voice journaling | Continuous on-device dictation (Web Speech API) into entries |
| Weekly summary | Genuinely computed from your last 7 entries (days, word count, top emotion, tool suggestion) — no fake "AI thinking" |
| Mood calendar | 8-week heatmap of daily average moods |
| Self-care suite | Breathing bubble, stress ball, grounding, gratitude spinner, meditation timer, mindful reading, music player and more |
| Habits & goals | Trackers with completion history feeding analytics |
| Analytics | Trends, habit-mood correlation, time-of-day patterns |
| Privacy center | JSON export/import backup, delete-all-data (double-confirm), sleep log with averages |
| PIN lock | Optional 4-digit keypad lock at boot |
| PWA | Installable; static export works offline-friendly |

## Data honesty

- Expression estimation reads facial muscle signals. It is an **observation,
  not a diagnosis** — the UI states this explicitly.
- Supportive replies are template-based and labeled as such.
- All data lives in `localStorage`; nothing is uploaded anywhere.

## Run

```bash
npm install
npm run setup-face-assets   # copies wasm + downloads face_landmarker.task (~3.8MB)
npm run dev
npm run build               # static export to out/
```

## Deploy (Vercel)

Framework Next.js with `output: 'export'` → deploy `out/`. Model files in
`public/models/` ship as static assets.

## Limitations

- Face scan needs Chrome/Edge + camera permission; it is optional.
- Blendshape→expression mapping is heuristic (weighted ACT-style signals).
- Not a medical or diagnostic tool.
