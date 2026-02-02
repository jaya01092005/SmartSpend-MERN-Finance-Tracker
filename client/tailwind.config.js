/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        card: 'var(--color-card)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        accent: {
          lavender: 'var(--color-accent-purple)',
          blue: 'var(--color-accent-blue)',
          green: 'var(--color-accent-green)',
          pink: 'var(--color-accent-pink)',
          cyan: 'var(--color-accent-cyan)',
          orange: 'var(--color-accent-orange)',
        }
      },
      fontFamily: {
        sans: ['Onest', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
