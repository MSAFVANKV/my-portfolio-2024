
import { createRoot } from 'react-dom/client'
import './index.css'
import rootRouter from "./routers/RootRouter.tsx";
import { RouterProvider } from "react-router-dom";



createRoot(document.getElementById('root')!).render(
  <RouterProvider router={rootRouter} />
)
