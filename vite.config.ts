// import path from "path"
// import react from "@vitejs/plugin-react"
// import { defineConfig } from "vite"

// export default defineConfig({
//   // base:"/portfolio-safvan/",
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     port: 3001, // Replace with your desired port number
//     strictPort: true, // Optional: Ensures the server fails if the port is already in use
//   },
// })
// // /.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          mui: ["@mui/material", "@mui/icons-material"],
          radix: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          vendor: ["react", "react-dom"],
        },
      },
    },
  },

  // server: {
  //   port: 3001,
  //   strictPort: true,
  // },
});
