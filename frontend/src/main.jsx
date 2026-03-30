import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "./pages/Login.jsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout>
      <Outlet />
    </AppLayout>,
    children: [
      {
        path: "/a",
        element: <p>wasd</p>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
