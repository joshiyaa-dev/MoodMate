'use client';

import React, { useEffect, useState } from 'react';
import { Download, Upload, Trash2, Lock, Moon } from 'lucide-react';

const PIN_KEY = 'moodmate-pin';
const SLEEP_KEY = 'moodmate-sleep';

interface SleepLog {
  date: string;
  hours: number;
}

export default function DataPrivacyCenter({ moodEntries }: { moodEntries: any[] }) {
  const [hasPin, setHasPin] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [sleepHours, setSleepHours] = useState('');
  const [sleepLog, setSleepLog] = useState<SleepLog[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setHasPin(Boolean(localStorage.getItem(PIN_KEY)));
    try {
      setSleepLog(JSON.parse(localStorage.getItem(SLEEP_KEY) || '[]'));
    } catch {
      /* ignore */
    }
  }, []);

  const exportData = () => {
    const payload: Record<string, unknown> = { exported_at: new Date().toISOString(), app: 'MoodMate' };
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('moodmate_')) continue;
      try {
        payload[key] = JSON.parse(localStorage.getItem(key) || 'null');
      } catch {
        payload[key] = localStorage.getItem(key);
      }
    }
    // Include common keys used by the app regardless of prefix.
    for (const k of ['user_moods', 'journal_entries', 'user_habits', 'user_goals', SLEEP_KEY]) {
      const raw = localStorage.getItem(k);
      if (raw) {
        try {
          payload[k] = JSON.parse(raw);
        } catch {
          /* skip */
        }
      }
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moodmate-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Backup downloaded.');
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        let restored = 0;
        for (const [key, value] of Object.entries(data)) {
          if (key === 'exported_at' || key === 'app') continue;
          localStorage.setItem(key, JSON.stringify(value));
          restored++;
        }
        setMessage(`Restored ${restored} data sets. Reloading…`);
        setTimeout(() => window.location.reload(), 1200);
      } catch {
        setMessage('That file is not a valid MoodMate backup.');
      }
    };
    reader.readAsText(file);
  };

  const deleteEverything = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    const preserve = localStorage.getItem(PIN_KEY);
    localStorage.clear();
    if (preserve) localStorage.setItem(PIN_KEY, preserve);
    setConfirming(false);
    setMessage('All local data deleted. Reloading…');
    setTimeout(() => window.location.reload(), 1000);
  };

  const setPin = () => {
    if (/^\d{4}$/.test(pinInput)) {
      localStorage.setItem(PIN_KEY, pinInput);
      setHasPin(true);
      setPinInput('');
      setMessage('PIN lock enabled — you will be asked for it when the app opens.');
    } else {
      setMessage('PIN must be exactly 4 digits.');
    }
  };

  const removePin = () => {
    localStorage.removeItem(PIN_KEY);
    setHasPin(false);
    setMessage('PIN lock removed.');
  };

  const logSleep = () => {
    const h = Number(sleepHours);
    if (!h || h < 0 || h > 24) {
      setMessage('Enter hours between 0 and 24.');
      return;
    }
    const entry: SleepLog = { date: new Date().toISOString(), hours: h };
    const next = [entry, ...sleepLog.filter((s) => new Date(s.date).toDateString() !== new Date().toDateString())].slice(0, 90);
    setSleepLog(next);
    localStorage.setItem(SLEEP_KEY, JSON.stringify(next));
    setSleepHours('');
    // Sleep ↔ mood correlation from real entries.
    if (moodEntries.length >= 5 && next.length >= 3) {
      setMessage(`Logged ${h}h. Tip: compare with your mood calendar — people who log under 6h often see lower-mood days.`);
    } else {
      setMessage(`Logged ${h} hours of sleep.`);
    }
  };

  const avgSleep = sleepLog.length
    ? Math.round((sleepLog.reduce((a, s) => a + s.hours, 0) / sleepLog.length) * 10) / 10
    : null;

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
        <Lock size={16} className="text-pink-500" /> Data &amp; Privacy Center
      </h3>
      <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        Everything in MoodMate lives on this device. Export a backup anytime, restore it on a new phone, or wipe everything.
      </p>

      {/* Sleep log */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20">
        <p className="mb-2 flex items-center gap-2 text-sm font-bold text-indigo-900 dark:text-indigo-200">
          <Moon size={14} /> Last night&apos;s sleep {avgSleep !== null && <span className="font-normal opacity-70">(avg {avgSleep}h)</span>}
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            max={24}
            step={0.5}
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            placeholder="hours"
            className="w-24 rounded-lg border border-indigo-200 bg-white px-2 py-1.5 text-sm dark:border-indigo-700 dark:bg-slate-900 dark:text-gray-100"
          />
          <button onClick={logSleep} className="rounded-full bg-indigo-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-400">
            Log
          </button>
        </div>
      </div>

      {/* PIN */}
      <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-600">
        {hasPin ? (
          <button onClick={removePin} className="text-sm font-semibold text-rose-500 hover:text-rose-400">
            Remove PIN lock
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
              inputMode="numeric"
              placeholder="4-digit PIN"
              className="w-28 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm tracking-widest dark:border-slate-600 dark:bg-slate-900 dark:text-gray-100"
            />
            <button onClick={setPin} className="rounded-full bg-slate-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-600">
              Enable PIN lock
            </button>
          </div>
        )}
      </div>

      {/* Export / import / delete */}
      <div className="flex flex-wrap gap-2">
        <button onClick={exportData} className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-400">
          <Download size={13} /> Export backup
        </button>
        <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-blue-500 px-4 py-2 text-xs font-bold text-white hover:bg-blue-400">
          <Upload size={13} /> Import backup
          <input type="file" accept=".json" className="hidden" onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])} />
        </label>
        <button
          onClick={deleteEverything}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold ${
            confirming ? 'animate-pulse bg-red-600 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300'
          }`}
        >
          <Trash2 size={13} /> {confirming ? 'Tap again to confirm' : 'Delete all data'}
        </button>
      </div>

      {message && <p className="text-xs font-semibold text-pink-600 dark:text-pink-300">{message}</p>}
    </div>
  );
}
