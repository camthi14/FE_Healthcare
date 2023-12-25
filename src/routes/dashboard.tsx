import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardLayout } from "~/layouts";
import { DashboardPaths } from "~/types";
import dashboardRoute from "./dashboardRoute";
import doctorRoute from "./doctorRoute";
import employeeRoute from "./employeeRoute";
import { loaderDashboard } from "./loaderDashboard";
import singleManagerRoute from "./singleManagerRoute";

const ErrorBoundary = Loadable(lazy(() => import("~/pages/error/ErrorBoundary")));

const dashboardRoutes: RouteObject[] = [
  {
    path: DashboardPaths.Dashboard,
    element: <DashboardLayout />,
    errorElement: <ErrorBoundary />,
    loader: loaderDashboard,
    children: [...dashboardRoute, ...employeeRoute, ...doctorRoute, ...singleManagerRoute],
  },
];

export default dashboardRoutes;
