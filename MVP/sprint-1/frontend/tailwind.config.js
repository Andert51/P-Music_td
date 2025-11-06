/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gruvbox Dark Theme
        bg: {
          dark: '#1d2021',
          DEFAULT: '#282828',
          light: '#3c3836',
        },
        fg: {
          DEFAULT: '#ebdbb2',
          light: '#fbf1c7',
          dark: '#d5c4a1',
        },
        primary: {
          DEFAULT: '#fabd2f',
          dark: '#d79921',
        },
        accent: {
          red: '#fb4934',
          green: '#b8bb26',
          blue: '#83a598',
          purple: '#d3869b',
          aqua: '#8ec07c',
          orange: '#fe8019',
        }
      },
    },
  },
  plugins: [],
}
