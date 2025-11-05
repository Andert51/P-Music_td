/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gruvbox Dark Theme - Warm & Dark palette
        'gruvbox-bg': '#1d2021',
        'gruvbox-bg0': '#282828',
        'gruvbox-bg1': '#3c3836',
        'gruvbox-bg2': '#504945',
        'gruvbox-bg3': '#665c54',
        'gruvbox-fg': '#ebdbb2',
        'gruvbox-fg4': '#a89984',
        'gruvbox-gray': '#928374',
        'gruvbox-red': '#fb4934',
        'gruvbox-green': '#b8bb26',
        'gruvbox-yellow': '#fabd2f',
        'gruvbox-blue': '#83a598',
        'gruvbox-purple': '#d3869b',
        'gruvbox-aqua': '#8ec07c',
        'gruvbox-orange': '#fe8019',
        // Semantic aliases
        'deep-dark': '#1d2021',
        'deep-navy': '#282828',
        'dark-card': '#3c3836',
        'dark-hover': '#504945',
        'cyan': {
          DEFAULT: '#8ec07c',
          dark: '#689d6a',
          darker: '#427b58',
        },
        'violet': {
          DEFAULT: '#d3869b',
          dark: '#b16286',
          darker: '#8f3f71',
        },
        // Legacy colors (mantener compatibilidad)
        primary: {
          DEFAULT: '#8ec07c',
          dark: '#689d6a',
          light: '#a9dc76',
        },
        dark: {
          100: '#1d2021',
          200: '#282828',
          300: '#3c3836',
          400: '#504945',
          500: '#665c54',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
