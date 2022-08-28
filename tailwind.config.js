/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        pulsate: {
          "0%": { opacity: 1 },
          "50%": { opacity: 0.5 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        pulsate: "pulsate 300ms ease-out 1",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
