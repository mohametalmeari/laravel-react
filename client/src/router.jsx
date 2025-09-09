import { createBrowserRouter, Navigate } from "react-router";
import {
  Category,
  CategoryForm,
  Home,
  NotFound,
  Product,
  ProductForm,
  Products,
  Signin,
  Signup,
} from "./views";
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
    children: [
      { index: true, element: <Navigate to={"/categories"} /> },
      { path: "/categories", element: <Home /> },
      { path: "/products", element: <Products /> },
      { path: "/categories/:id", element: <Category /> },
      { path: "/categories/new", element: <CategoryForm /> },
      { path: "/categories/:id/edit", element: <CategoryForm /> },
      { path: "/products/:id", element: <Product /> },
      { path: "/products/new", element: <ProductForm /> },
      { path: "/products/:id/edit", element: <ProductForm /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);
