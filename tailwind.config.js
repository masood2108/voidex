/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],

  safelist: [
    "bg-red-500",
    "bg-yellow-400",
    "bg-blue-500",
    "bg-green-500"
  ],

  theme: {
    extend: {
      colors: {
        bg: "#0b0f14",
        card: "#111418",
        border: "#1f2937",

        /* BRAND COLORS (camelCase, consistent) */
        brandGreen: "#22c55e",
        brandBlue: "#60a5fa",
        brandYellow: "#facc15",
        brandPurple: "#a78bfa",

        muted: "#9ca3af"
      }
    }
  },

  plugins: [],
}
