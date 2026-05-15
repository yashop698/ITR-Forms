/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F3A93',
        'primary-dark': '#162c70',
        'primary-light': '#2a4db8',
        accent: '#D4AF37',
        'accent-dark': '#b8961f',
        success: '#27AE60',
        warning: '#E67E22',
        error: '#E74C3C',
        background: '#F8F9FA',
        'text-main': '#2C3E50',
        'text-muted': '#6c757d',
        'border-light': '#dee2e6',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
