/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // MoodMate — Mood Tracking Wellness Companion
        // Caring palette that reflects emotional states
        bg: '#F8FAFC',
        surface: '#FFFFFF',
        border: '#E5E7EB',
        'border-strong': '#D1D5DB',
        ink: '#111827',
        ink_secondary: '#4B5563',
        ink_muted: '#9CA3AF',
        accent: '#A855F7', // Violet — intuition, reflection, calm
        success: '#059669',
        danger: '#DC2626',
        warning: '#D97706',
        card: '#FFFFFF',
        muted: '#6B7280',
        violet: '#A855F7',
        amber: '#D97706',
        fog: '#6B7280',
      },
      borderRadius: {
        md: '6px',
        lg: '10px',
        full: '9999px',
      },
      boxShadow: {
        md: '0 1px 2px rgba(0,0,0,.05)',
        lg: '0 4px 12px rgba(0,0,0,.08)',
        inner: 'inset 0 2px 4px rgba(0,0,0,.05)',
      },
    },
  },
  plugins: [],
}