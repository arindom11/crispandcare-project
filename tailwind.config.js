/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // "Silk & Steam" — a warm, textile-inspired palette
        primary: '#C08A34', // warm brass / gold
        'primary-dark': '#9A6C25',
        'primary-light': '#E4C58A',
        accent: '#5B3A5B', // deep plum (fabric dye)
        'accent-dark': '#3E2740',
        'accent-light': '#8A5E86',
        blush: '#D98B8B', // saree rose
        steam: '#7FA6A3', // soft steam teal
        background: '#FAF6EF', // warm cream
        surface: '#FFFFFF',
        ink: '#241F2E', // deep aubergine-charcoal
        muted: '#6B6152',
        divider: '#EAE1D2',
        deep: '#1C1726', // near-black plum
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(36, 31, 46, 0.18)',
        lift: '0 24px 60px -20px rgba(36, 31, 46, 0.28)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
