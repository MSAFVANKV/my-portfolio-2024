import App from "@/App";
import Home from "@/pages/Home/Home";
import { createBrowserRouter } from "react-router-dom";



const rootRouter = createBrowserRouter([
    {
        path: "/",
        element:<App/>,
        children: [
            {
                path: "/",
                element: <Home />
            }
        ]
    }
]);




export default rootRouter;
