import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.css";
import AppLayout from "./components/layout/AppLayout.jsx";

/* const Login = lazy(() => import("./pages/Login.jsx"));
const SignUp = lazy(() => import("./pages/SignUp.jsx"));
const Inventory = lazy(() => import("./pages/Inventory.jsx"));
const Reports = lazy(() => import("./pages/Reports.jsx"));
const CheckInOut = lazy(() => import("./pages/CheckInOut.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Users = lazy(() => import("./pages/Users.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx")); */

import { Toaster } from "sonner";
import Loader from "./components/layout/Loader.jsx";
import { AuthProvider } from "./core/contexts/AuthContext";
import PublicRoutes from "./components/auth/PublicRoutes.jsx";
import ProtectedRoutes from "./components/auth/ProtectedRoutes.jsx";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import CheckInOut from "./pages/CheckInOut";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const router = createBrowserRouter([
  {
    element: <ProtectedRoutes />, // 🔐 ALL PRIVATE ROUTES
    children: [
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
          { path: "inicio", element: <Dashboard /> },
          { path: "inventario", element: <Inventory /> },
          { path: "relatorios", element: <Reports /> },
          { path: "movimentacoes", element: <CheckInOut /> },
          { path: "usuarios", element: <Users /> },
          { path: "configuracoes", element: <Settings /> },
        ],
      },
    ],
  },

  {
    element: <PublicRoutes />, // 🌐 ONLY LOGIN/SIGNUP
    path: "/",
    children: [
      {
        path: "/login",
        element: (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/signup",
        element: (
          <Suspense fallback={<Loader />}>
            <SignUp />
          </Suspense>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    <Toaster closeButton />
  </StrictMode>,
);
