module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors:{
        "light-blue":"#B7FAF5",
        "light-brown":"#FCF3F1"
      },
      fontSize:{
        appName:['38px','16px'],
        welcomeText:['22px', '25px']
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
