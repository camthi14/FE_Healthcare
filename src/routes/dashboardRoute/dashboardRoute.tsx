import { lazy } from "react";
import { Navigate, RouteObject, redirect } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardPaths } from "~/types";

const ProfilePage = Loadable(lazy(() => import("~/pages/home/ProfilePage")));
const DashboardAppPage = Loadable(lazy(() => import("~/pages/DashboardAppPage")));

const TabAboutProfile = [
  { title: "Thông tin Người dùng", mode: "" },
  { title: "Thay đổi mật khẩu", mode: "chang-password" },
];

const dashboardRoute: RouteObject[] = [
  { element: <Navigate to={DashboardPaths.DashboardApp} />, index: true },
  { path: DashboardPaths.DashboardApp, element: <DashboardAppPage /> },
  {
    path: DashboardPaths.Profile,
    element: <ProfilePage />,
    loader({ request }) {
      const tab = new URL(request.url).searchParams.get("tab");

      if (!tab) return 0;

      const index = TabAboutProfile.findIndex((t) => t.mode === tab);

      if (index === -1) return redirect(DashboardPaths.Profile);

      return index;
    },
  },
];

export default dashboardRoute;
