import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  // base:"/portfolio-safvan/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3001, // Replace with your desired port number
    strictPort: true, // Optional: Ensures the server fails if the port is already in use
  },
})
// /.