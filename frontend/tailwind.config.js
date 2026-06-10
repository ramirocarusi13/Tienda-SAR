/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'testpatron': "url('@assets/patron_test.png')",
      },
      colors: {
        main: '#df3c2d',
        success: '#10b981',
        error: '#ef4444'
      }
    },
  },
  plugins: [],
}

