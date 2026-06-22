/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#02080c",
          shell: "#061016",
          panel: "#08141a",
          panel2: "#0d1d25",
          line: "#17323c",
          green: "#28f5b5",
          cyan: "#20d9ff",
          orange: "#ff9f1a",
          purple: "#8a5cff",
          blue: "#4f8cff",
          dim: "#8aa2ad",
          white: "#f3fbff",
          danger: "#ff4f61",
          amber: "#f7c948"
        }
      },
      boxShadow: {
        glow: "0 0 28px rgba(40, 245, 181, 0.18)",
        cyan: "0 0 30px rgba(32, 217, 255, 0.18)",
        orange: "0 0 30px rgba(255, 159, 26, 0.18)",
        purple: "0 0 30px rgba(138, 92, 255, 0.18)"
      }
    }
  },
  plugins: [],
}
