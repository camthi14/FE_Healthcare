import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { IEmployeeAuth } from "~/models";
import employeeApi from "~/services/api/employeeApi";
import { DashboardPaths } from "~/types";

const EmployeePage = Loadable(lazy(() => import("~/pages/employee/EmployeePage")));
const EmployeeAddEditPage = Loadable(lazy(() => import("~/pages/employee/AddEditEmployeePage")));

const employeeRoute: RouteObject[] = [
  { path: DashboardPaths.Employee, element: <EmployeePage /> },
  { path: DashboardPaths.EmployeeAdd, element: <EmployeeAddEditPage /> },
  {
    path: DashboardPaths.EmployeeEdit + "/:id",
    element: <EmployeeAddEditPage />,
    loader: async ({ params: { id } }) => {
      try {
        const response: IEmployeeAuth | null = await employeeApi.getById(id as string);

        if (!response) return null;
        return response;
      } catch (error) {
        return null;
      }
    },
  },
];

export default employeeRoute;
