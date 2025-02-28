import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,html}"],

  theme: {
    fountFamily: {
      display: ["Poppins", "sans-serif"],
    },

    extend: {
      //colors
      colors: {
        primary: "@05B6D3",
        secondary: "#EF863E",
      },

      backgroundImage: {
        'login-bg-img': "url('./src/assets/images/login-bg.png')",
        // "signup-bg-img": "url('./src/assets/images/signup-bg.png')",
      },
    },
  },

  plugins: [react(), tailwindcss(),],
};
