
import { createRoot } from 'react-dom/client'
import './index.css'
import rootRouter from "./routers/RootRouter.tsx";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from './provider/theme-provider.tsx';



createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
  <RouterProvider router={rootRouter} />
  </ThemeProvider>

)
