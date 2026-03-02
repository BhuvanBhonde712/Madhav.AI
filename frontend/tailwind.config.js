/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        peacock: { DEFAULT: '#0F5C4D', light: '#1A7A68', dark: '#093D34' },
        saffron: { DEFAULT: '#FF7A00', light: '#FF9A33', dark: '#CC6200' },
        golden: '#FFD700',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        sanskrit: ['"Noto Serif Devanagari"', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-alt': 'floatAlt 7s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatAlt: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(20px)' },
        },
      }
    }
  },
  plugins: []
}