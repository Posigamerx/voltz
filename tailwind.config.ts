import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // VOLTZ brand palette — dark tech aesthetic
        zinc: {
          950: '#0a0a0b',
        },
        volt: {
          DEFAULT: '#e8ff00',  // electric yellow accent
          50:  '#fefff0',
          100: '#fdffd1',
          200: '#fbff99',
          300: '#f5ff55',
          400: '#e8ff00',
          500: '#c9e000',
          600: '#a3b500',
          700: '#7a8800',
          800: '#5c6600',
          900: '#3d4500',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-up':    'slideInUp 0.4s ease-out',
        'fade-in':        'fadeIn 0.25s ease-out',
        'shimmer':        'shimmer 1.5s infinite',
      },
      keyframes: {
        slideInRight: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to:   { transform: 'translateX(0)',    opacity: '1' },
        },
        slideInUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'grid-dark': 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}

export default config
