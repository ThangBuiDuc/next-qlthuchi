const { nextui } = require("@nextui-org/theme");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
    "./node_modules/@nextui-org/theme/dist/components/(tooltip|popover|spinner|pagination|table|checkbox|spacer).js",
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
  darkMode: "class",
  // daisyui: {
  //   themes: [
  //     {
  //       mytheme: {
  //         primary: "#134a9abf",
  //         secondary: "#134A9A",
  //       },
  //     },
  //   ],
  // },
  plugins: [require("daisyui"), nextui()],
};
