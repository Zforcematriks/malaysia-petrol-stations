/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'audiowide': ['var(--font-audiowide)', 'sans-serif'],
        'exo': ['var(--font-exo)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 