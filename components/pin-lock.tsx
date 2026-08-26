'use client';

import React, { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';

const PIN_KEY = 'moodmate-pin';

/** 4-digit PIN gate shown at boot when the user enabled privacy lock. */
export default function PinLock({ onUnlocked }: { onUnlocked: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === localStorage.getItem(PIN_KEY)) {
        onUnlocked();
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
          setPin('');
        }, 600);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-pink-50 to-purple-100 p-6 dark:from-gray-900 dark:to-gray-800">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-500 shadow-lg">
        <Lock className="h-8 w-8 text-white" />
      </div>
      <div>
        <h1 className="text-center text-xl font-black text-gray-800 dark:text-white">MoodMate is locked</h1>
        <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">Enter your 4-digit PIN</p>
      </div>
      <div className={`flex gap-3 ${error ? 'animate-pulse' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-4 w-4 rounded-full ${error ? 'bg-red-500' : pin.length > i ? 'bg-pink-500' : 'bg-gray-300 dark:bg-gray-600'}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((key, idx) => (
          <button
            key={idx}
            disabled={!key}
            onClick={() => {
              if (key === '⌫') setPin((p) => p.slice(0, -1));
              else setPin((p) => (p + key).slice(0, 4));
            }}
            className={`h-14 w-14 rounded-2xl text-lg font-bold ${
              key
                ? 'bg-white text-gray-700 shadow dark:bg-slate-800 dark:text-gray-100 active:scale-95'
                : 'pointer-events-none opacity-0'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
      {error && <p className="text-xs font-semibold text-red-500">Wrong PIN — try again</p>}
    </div>
  );
}
