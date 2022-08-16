/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.tsx",
    "./assets/**/*.jsx",
  ],
  theme: {
    extend: {
      colors:{
        primary: '#5689E3',
        'primary-darker': '#417BDF',
        'mellow': '#F8F7F8',
        'mellow-darker': '#F2F1F2',
        'smooth': '#E5E4E7'
      }
    },
  },
  plugins: [],
}
