/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/templates/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "clr-grey-3": "rgba(130, 130, 130, 1)",
        "clr-links": "rgba(206, 27, 28, 1)",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
}
