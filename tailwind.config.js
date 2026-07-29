/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A0A0A', // text, actions
        secondary: '#FAFAFA', // backgrounds
        tertiary: '#D4D4D8', // dividers
        surfaceBase: '#FAFAFA',
        surfaceInverse: '#0A0A0A',
        success: '#16A34A',
        warning: '#CA8A04',
        error: '#DC2626',
        info: '#71717A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
