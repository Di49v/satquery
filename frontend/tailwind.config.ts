import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: '#0f2046',
          light: '#f8fafc',
          border: '#94a3b8',
          panel: '#e2e8f0',
          accent: '#2563eb',
          header: '#1e293b',
          saffron: '#FF9933', // India flag saffron
          green: '#138808',   // India flag green
        }
      },
      fontSize: {
        'xxs': '0.65rem',
      },
      boxShadow: {
        'inner-panel': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
export default config