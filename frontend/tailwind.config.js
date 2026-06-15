/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050816',
        primary: '#00f5ff',
        secondary: '#a78bfa',
        accent: '#ec4899',
        card: 'rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('/src/assets/herobg.png')",
      }
    },
  },
  plugins: [],
}
