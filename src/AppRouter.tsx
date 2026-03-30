import { createHashRouter, Navigate } from "react-router";
import App from "./App";

import { Properties, PropertyList } from "./module/Properties";
import { Dashboard } from "./module/Dashboard/Dashboard";
import { PropertyDetails } from "./module/Properties/PropertyDetails";
import { Bookings, Calendars } from "./module/Bookings";
import { Home } from "./module/Home/Home";
import { PaymentList } from "./module/Payments/PaymentList";
import { Payments } from "./module/Payments";
import { ProtectedRoute } from "./Auth/ProtectedRoute";
import LoginForm from "./module/Layout/Login";
import { useAuth } from "./Auth/AuthContext";

/**
 * Role-aware landing component for the index route.
 * - admin  -> shows <Home />
 * - others -> redirects to /#/payments
 *
 * Assumes `localStorage.user` contains { role: string } set by your login flow.
 */
function RoleLanding() {
  const { role } = useAuth();

  if (role === "admin") {
    return <Home />;
  } else {
    return <Navigate to="/queque" replace />;
  }
}

export const AppRouter = createHashRouter([
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/",
    element: <ProtectedRoute />, // <-- wrap all protected routes
    children: [
      {
        element: <App />, // Layout wrapper
        children: [
          {
            // Index route now decides where to land based on role
            index: true,
            element: <RoleLanding />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "queque",
            element: <Payments />,
            children: [
              {
                index: true,
                element: <PaymentList />,
              },
            ],
          },
          {
            path: "accounts",
            element: <Properties />,
            children: [
              {
                index: true,
                element: <PropertyList />,
              },
              {
                path: ":id",
                element: <PropertyDetails />,
              },
            ],
          },
          {
            path: "reports",
            element: <Bookings />,
            children: [
              {
                index: true,
                element: <Calendars />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
