import flowbite from "flowbite/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js", // Add this line for flowbite-react
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite, // Use flowbite as a plugin
    require("tailwind-scrollbar"),
  ],
};
