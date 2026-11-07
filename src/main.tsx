import { createRoot } from "react-dom/client";
import "./index.css";
import rootRouter from "./routers/RootRouter.tsx";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./provider/theme-provider.tsx";
import ReduxProviders from "./provider/redux/ReduxProviders.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <ReduxProviders>
      <RouterProvider router={rootRouter} />
    </ReduxProviders>
  </ThemeProvider>,
);
