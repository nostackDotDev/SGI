import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.css";
import AppLayout from "./components/layout/AppLayout.jsx";

const Login = lazy(() => import("./pages/Login.jsx"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Inventory = lazy(() => import("./pages/Inventory"));
const Reports = lazy(() => import("./pages/Reports"));
const CheckInOut = lazy(() => import("./pages/CheckInOut"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const Settings = lazy(() => import("./pages/Settings"));

import { Toaster } from "sonner";
import Loader from "./components/layout/Loader";

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
