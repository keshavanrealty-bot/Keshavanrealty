/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF6A00',
          'orange-hover': '#E55F00',
          'orange-light': '#FFF5EE',
          'orange-subtle': '#FFE8D9',
          secondary: '#F28C00',
          charcoal: '#15191E',
          'charcoal-light': '#242A32',
          'charcoal-surface': '#1C2128',
          grey: '#F5F6F7',
          'grey-border': '#E4E7EB',
          'grey-text': '#5A6573',
          green: '#10B981',
          'green-light': '#ECFDF5',
          'green-dark': '#047857',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(21, 25, 30, 0.06), 0 2px 6px -1px rgba(21, 25, 30, 0.04)',
        'card-hover': '0 20px 30px -10px rgba(21, 25, 30, 0.12), 0 10px 15px -5px rgba(255, 106, 0, 0.08)',
        'elevated': '0 25px 50px -12px rgba(21, 25, 30, 0.18)',
        'glow': '0 0 25px rgba(255, 106, 0, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
