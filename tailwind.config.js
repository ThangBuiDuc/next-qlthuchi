/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hovercl: "rgba(0, 0, 0, 0.05)",
        bordercl: "rgba(0, 0, 0, 0.1)",
        overlay: "rgba(0,0,0,.5)",
      },
    },
  },

  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#134a9abf",
          // secondary: "#134A9A",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
