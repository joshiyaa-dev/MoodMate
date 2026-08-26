'use client';

import React, { useMemo } from 'react';

interface MoodEntry {
  date: string;
  mood: number;
}

const MOOD_COLORS: Record<number, string> = {
  1: 'bg-red-500',
  2: 'bg-orange-400',
  3: 'bg-yellow-300',
  4: 'bg-green-400',
  5: 'bg-emerald-500',
};

/** Last-8-week calendar heatmap of recorded moods (1–5). */
export default function MoodHeatmap({ entries }: { entries: MoodEntry[] }) {
  const weeks = useMemo(() => {
    const byDay = new Map<string, number[]>();
    for (const e of entries) {
      const key = new Date(e.date).toDateString();
      byDay.set(key, [...(byDay.get(key) ?? []), e.mood]);
    }
    const days: Array<{ key: string; avg: number | null }> = [];
    const start = new Date();
    start.setDate(start.getDate() - 55 - ((start.getDay() + 6) % 7)); // align Monday
    for (let i = 0; i < 56; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toDateString();
      const moods = byDay.get(key);
      days.push({
        key,
        avg: moods && moods.length ? Math.round(moods.reduce((a, b) => a + b, 0) / moods.length) : null,
      });
    }
    const out: Array<typeof days> = [];
    for (let w = 0; w < 8; w++) out.push(days.slice(w * 7, w * 7 + 7));
    return out;
  }, [entries]);

  const logged = weeks.flat().filter((d) => d.avg !== null).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Mood calendar</h3>
        <span className="text-[10px] font-semibold text-slate-400">{logged} days logged · last 8 weeks</span>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1.5">
            {week.map((day) => (
              <div
                key={day.key}
                title={`${day.key}${day.avg ? ` — mood ${day.avg}/5` : ''}`}
                className={`h-4 w-4 rounded ${day.avg ? MOOD_COLORS[day.avg] ?? 'bg-slate-300' : 'bg-slate-100 dark:bg-slate-700'}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
        Low
        {[1, 2, 3, 4, 5].map((m) => (
          <span key={m} className={`inline-block h-3 w-3 rounded ${MOOD_COLORS[m]}`} />
        ))}
        High
      </div>
    </div>
  );
}
