import { createBrowserRouter } from "react-router";
import { Home, NotFound, Signin, Signup } from "./views";
import { GuestLayout, ProtectedLayout } from "./layouts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "/signup", element: <Signup /> },
      { path: "/signin", element: <Signin /> },
    ],
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [{ index: true, element: <Home /> }],
  },

  { path: "*", element: <NotFound /> },
]);
