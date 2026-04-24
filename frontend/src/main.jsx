import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.css";
import AppLayout from "./components/layout/AppLayout.jsx";

const Login = lazy(() => import("./pages/Login.jsx"));
const SignUp = lazy(() => import("./pages/SignUp.jsx"));
const Inventory = lazy(() => import("./pages/Inventory.jsx"));
const Reports = lazy(() => import("./pages/Reports.jsx"));
const CheckInOut = lazy(() => import("./pages/CheckInOut.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Users = lazy(() => import("./pages/Users.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));

import { Toaster } from "sonner";
import Loader from "./components/layout/Loader.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </AppLayout>
    ),
    children: [
      {
        path: "inicio",
        element: <Dashboard />,
      },
      {
        path: "inventario",
        element: <Inventory />,
      },
      {
        path: "relatorios",
        element: <Reports />,
      },
      {
        path: "movimentacoes",
        element: <CheckInOut />,
      },
      {
        path: "usuarios",
        element: <Users />,
      },
      {
        path: "configuracoes",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster closeButton />
  </StrictMode>,
);
