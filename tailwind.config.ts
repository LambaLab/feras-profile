import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'li-blue':       '#0A66C2',
        'li-blue-dark':  '#004182',
        'li-blue-light': '#EBF3FB',
        'li-bg':         '#F3F2EE',
        'li-border':     '#E0DFDC',
        'li-text':       'rgba(0,0,0,0.9)',
        'li-text-secondary': 'rgba(0,0,0,0.6)',
        'li-text-tertiary':  'rgba(0,0,0,0.4)',
      },
      fontFamily: {
        sans: ['-apple-system', 'system-ui', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'li-card': '0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
} satisfies Config
