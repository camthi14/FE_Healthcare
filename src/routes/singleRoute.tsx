import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { authorizationLoader } from "~/helpers";
import { SimpleLayout } from "~/layouts";
import { SinglePaths } from "~/types";
import { loaderDashboard } from "./loaderDashboard";

const ErrorBoundary = Loadable(lazy(() => import("~/pages/error/ErrorBoundary")));
const LoginPage = Loadable(lazy(() => import("~/pages/auth/LoginPage")));
const RegisterPage = Loadable(lazy(() => import("~/pages/auth/RegisterPage")));

const singleRoute: Array<RouteObject> = [
  {
    path: SinglePaths.LoginEmployee,
    loader() {
      return authorizationLoader("employee");
    },
    element: <LoginPage type="employee" />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: SinglePaths.LoginDoctor,
    loader() {
      return authorizationLoader("doctor");
    },
    element: <LoginPage type="doctor" />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: SinglePaths.LoginOwner,
    loader() {
      return authorizationLoader("owner");
    },
    element: <LoginPage type="owner" />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: SinglePaths.Register,
    element: <RegisterPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    element: <SimpleLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <Navigate to="/dashboard/app" />,
        index: true,
        loader() {
          const role = loaderDashboard();

          if (!role) {
            return null;
          }

          return authorizationLoader(role as any);
        },
      },
      { path: SinglePaths.ErrorBoundary, element: <ErrorBoundary /> },
      { path: SinglePaths.Any, element: <Navigate to="/404" /> },
    ],
  },
  {
    path: SinglePaths.Any,
    element: <Navigate to="/404" replace />,
  },
];

export default singleRoute;
