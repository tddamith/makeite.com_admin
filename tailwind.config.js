/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "16px",
      },
      colors: {
        primary: " #BE17FA",
        secondary: " #BEEA94",
        disable: "#89898A",
        hover: " #DAF4C1",
        disable_2: " #EDEDED",
        disable_3: " #CCCCCE",
        bg_1: "#110209",
        bg_2: "#FBFBFB",
        bg_3: " #BEEA94",
        bg_4: " #FFEEE5",
        bg_5: "#F8E6FF",

        font: {
          primary: "#161625",
          secondary: " #89898A",
          default: " #0A071B",
          hover: "#C71111",
        },

        border: {
          primary: "#F8F9FB",
          secondary: " #D8D8DA",
          deafult: " #E8EAF0",
        },
      },
      borderRadius: {
        md: "16px",
        md_sm: "14px",
        sm: "11px",
        x_sm: "6px",
      },
      borderWidth: {
        sm: "2px",
        x_sm: "1px",
      },
      margin: {
        "64px": "64px",
        "42px": "42px",
        "32px": "32px",
        "24px": "24px",
        "16px": "16px",
        "14px": "14px",
        "12px": "12px",
        "8px": "8px",
        "4px": "4px",
        "2px": "2px",
      },
      padding: {
        "64px": "64px",
        "42px": "42px",
        "32px": "32px",
        "24px": "24px",
        "16px": "16px",
        "12px": "12px",
        "8px": "8px",
        "4px": "4px",
        "2px": "2px",
      },
      fontSize: {
        x_lg: "26px",
        lg: "24px",
        md: "20px",
        sm_md: "16px",
        md: "14px",
        sm: "12px",
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
