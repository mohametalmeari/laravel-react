import { createBrowserRouter } from "react-router";
import { Home } from "./views";

export const router = createBrowserRouter([{ path: "/", element: <Home /> }]);
