/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-500":
          "linear-gradient(to right, rgba(255,78,96,0.2), rgba(68,69,118,0.2))",
      },
      colors: {
        primary: {
          50: "#E0E0F6",
          100: "#D4D4F0",
          200: "#A8A8EA",
          300: "#8C8CE4",
          400: "#7070DE",
          500: "#030081",
          600: "#02006F",
          700: "#02005D",
          800: "#01004B",
          900: "#010039",
        },
      },
    },
  },
  plugins: [],
};

