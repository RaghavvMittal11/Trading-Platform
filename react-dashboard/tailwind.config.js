/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a16',
          card: 'rgba(19, 19, 43, 0.6)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        primary: {
          DEFAULT: '#6366f1', // Indigo
          glow: '#818cf8',
        },
        accent: {
          cyan: '#06b6d4',
          purple: '#d946ef',
          green: '#22c55e',
          red: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // We'll need to import Inter
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
