/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pryFont: ["Mona-Sans", "sans-serif"]
      },
      colors: {
        bgClr: ["#222629"],
        pryClr: ["#D5D0D6"],
        secClr: ["#FFBDBD"],
        tetClr: ["#ffffff"],
        borderClr: ["#87C232"],
        otherClr: ["#F8F9FB"]
      }
    },
  },
  plugins: [],
}

