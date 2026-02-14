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
import MernSkillsPage from "@/pages/skills/skills-page";
import FrontendSkills from "@/pages/frontend/frontend-skills-page";
import BackendSkills from "@/pages/backend/backend-skill-page";
import ContactPage from "@/pages/contact/page";
import PagesLayouts from "@/layouts/PagesLayouts";

const rootRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,

    children: [
      {
        path: "/",
        // index: true,
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
        element: (
          <PagesLayouts>
            <AboutMe_V02 />
          </PagesLayouts>
        ),
      },
      {
        path: "skills",
        element: <MernSkillsPage />,
      },
      {
        path: "contact",
        element: (
          <PagesLayouts>
            <ContactPage />
          </PagesLayouts>
        ),
      },
      {
        path: "skills/frontend",
        element: <FrontendSkills />,
      },
      {
        path: "skills/backend",
        element: <BackendSkills />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  
]);

export default rootRouter;
