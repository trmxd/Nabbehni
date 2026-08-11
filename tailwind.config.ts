import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: 'var(--color-black)',
          red: 'var(--color-red)',
          'red-hover': 'var(--color-red-hover)',
          'red-soft': 'var(--color-red-soft)',
          white: 'var(--color-white)',
          'gray-light': 'var(--color-gray-light)',
          'gray-border': 'var(--color-gray-border)',
          'gray-text': 'var(--color-gray-text)',
          'gray-dark': 'var(--color-gray-dark)',
        },
      },
      fontFamily: {
        sans: ['Tajawal', 'Noto Sans Arabic', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 14px 34px rgba(13, 13, 13, 0.06)',
      },
    },
  },
  plugins: [],
} satisfies Config;
