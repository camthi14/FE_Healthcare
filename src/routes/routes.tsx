import { createBrowserRouter } from "react-router-dom";
import dashboardRoutes from "./dashboard";
import singleRoute from "./singleRoute";

const router = createBrowserRouter([...dashboardRoutes, ...singleRoute], {
  future: { v7_normalizeFormMethod: true },
});

export type RouterApp = ReturnType<typeof createBrowserRouter>;

export default router;
