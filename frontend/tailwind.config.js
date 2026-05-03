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
        dark: {
          bg: '#0a0a0f',
          text: '#e2e8f0',
          card: 'rgba(255,255,255,0.05)',
        },
        light: {
          bg: '#fafaf8',
          text: '#0f172a',
          card: 'rgba(0,0,0,0.04)',
        },
        primary: '#00d4ff',
        secondary: '#06ffa5',
        accent: '#a855f7',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
