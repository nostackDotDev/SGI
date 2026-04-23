import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "./pages/Login.jsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import CheckInOut from "./pages/CheckInOut";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout>
        <Outlet />
      </AppLayout>
    ),
    children: [
      {
        path: "inicio",
        element: <Dashboard />,
      },
      {
        path: "/inventario",
        element: <Inventory />,
      },
      {
        path: "/relatorios",
        element: <Reports />,
      },
      {
        path: "/movimentacoes",
        element: <CheckInOut />,
      },
      {
        path: "usuarios",
        element: <Users />,
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
