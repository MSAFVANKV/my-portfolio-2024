import App from "@/App";
import AboutMe_V02 from "@/pages/about/page";
// import MainHomeContainer from "@/pages/Home/main-home";
import { lazy } from "react";

const MainHomeContainer = lazy(() => import("@/pages/Home/main-home"));

import PreviewPage from "@/pages/preview/page";
import ErrorPage from "@/pages/system/ErrorPage";
import NotFoundPage from "@/pages/system/NotFoundPage";
import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const rootRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: (
          <Suspense>
            <MainHomeContainer />
          </Suspense>
        ),
      },
      {
        path: "/preview",
        element: <PreviewPage />,
      },
      {
        path: "/about",
        element: <AboutMe_V02 />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default rootRouter;
