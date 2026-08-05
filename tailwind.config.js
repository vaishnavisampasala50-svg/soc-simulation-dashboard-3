/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        soc: {
          bg: '#070b12',
          panel: '#0e1420',
          panel2: '#131b2b',
          border: '#1e293b',
          border2: '#2a3a52',
          muted: '#64748b',
          text: '#e2e8f0',
          dim: '#94a3b8',
        },
        low: '#22c55e',
        medium: '#eab308',
        high: '#f97316',
        critical: '#ef4444',
        info: '#38bdf8',
        accent: '#2dd4bf',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px -2px rgba(45, 212, 191, 0.35)',
        'glow-red': '0 0 24px -2px rgba(239, 68, 68, 0.45)',
        'glow-orange': '0 0 22px -2px rgba(249, 115, 22, 0.4)',
        'glow-yellow': '0 0 20px -2px rgba(234, 179, 8, 0.4)',
        'glow-green': '0 0 20px -2px rgba(34, 197, 94, 0.4)',
        'glow-blue': '0 0 20px -2px rgba(56, 189, 248, 0.4)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        'flash-bg': {
          '0%': { backgroundColor: 'rgba(239, 68, 68, 0.22)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'grow-h': {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
        'sweep': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'slide-in': 'slide-in 0.35s ease-out both',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.2, 0.6, 0.3, 1) infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'flash-bg': 'flash-bg 1.2s ease-out',
        'spin-slow': 'spin-slow 8s linear infinite',
        'grow-h': 'grow-h 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'sweep': 'sweep 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
