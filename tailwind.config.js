/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fef3f2',
          100: '#fee4e2',
          200: '#fecdca',
          300: '#fda29b',
          400: '#f97066',
          500: '#f04438',
          600: '#d92d20',
          700: '#b42318',
          800: '#912018',
          900: '#7a271a',
          950: '#55160c',
        },
        brand: {
          DEFAULT: '#e8572a',
          light:   '#ff7a50',
          dark:    '#c43d15',
        },
        dark: {
          100: '#1e1e2e',
          200: '#181825',
          300: '#11111b',
          card: '#27273a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':       'fadeIn 0.3s ease-out',
        'slide-up':      'slideUp 0.4s ease-out',
        'slide-down':    'slideDown 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow':   'bounce 2s infinite',
        'spin-slow':     'spin 3s linear infinite',
        'shimmer':       'shimmer 1.5s infinite',
        'float':         'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:      { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:     { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideDown:   { from: { opacity: 0, transform: 'translateY(-20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInLeft: { from: { opacity: 0, transform: 'translateX(-20px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        shimmer:     { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float:       { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
      },
      boxShadow: {
        'card':     '0 4px 24px -1px rgba(0, 0, 0, 0.10)',
        'card-hover': '0 8px 40px -2px rgba(0, 0, 0, 0.18)',
        'brand':    '0 4px 14px 0 rgba(232, 87, 42, 0.39)',
        'glow':     '0 0 20px rgba(232, 87, 42, 0.3)',
      },
    },
  },
  plugins: [],
}
