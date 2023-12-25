import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { IDoctorAuth } from "~/models";
import { ISessionCheckup } from "~/models/sessionCheckup";
import doctorApi from "~/services/api/doctorApi";
import sessionCheckupApi from "~/services/api/sessionCheckupApi";
import { DashboardPaths, Pagination } from "~/types";

const DoctorPage = Loadable(lazy(() => import("~/pages/doctor/DoctorPage")));
const DoctorScheduleListPage = Loadable(
  lazy(() => import("~/pages/doctor/DoctorScheduleListPage"))
);
const DoctorSchedulePage = Loadable(lazy(() => import("~/pages/doctor/DoctorSchedulePage")));
const DoctorPointSubclinicalListPage = Loadable(lazy(() => import("~/pages/PointSubclinicalList")));
const DoctorAddEditPage = Loadable(lazy(() => import("~/pages/doctor/AddEditDoctorPage")));
const DoctorScheduleAddEditPage = Loadable(
  lazy(() => import("~/pages/doctor/AddEditSchedulePage"))
);
const PatientListPage = Loadable(lazy(() => import("~/pages/patients")));

const doctorRoute: RouteObject[] = [
  { path: DashboardPaths.Doctor, element: <DoctorPage /> },
  { path: DashboardPaths.PatientList, element: <PatientListPage /> },
  { path: DashboardPaths.DoctorAdd, element: <DoctorAddEditPage /> },
  { path: DashboardPaths.DoctorScheduleList, element: <DoctorScheduleListPage /> },
  { path: DashboardPaths.DoctorSchedule, element: <DoctorSchedulePage /> },
  { path: DashboardPaths.DoctorPointSubclinicalList, element: <DoctorPointSubclinicalListPage /> },
  {
    path: DashboardPaths.DoctorScheduleAdd,
    element: <DoctorScheduleAddEditPage />,
    async loader({ request: { url } }) {
      const _url = new URL(url).searchParams;
      const _mode = _url.get("mode");
      const _doctorIds = _url.get("doctorIds");

      try {
        const { metadata } = await sessionCheckupApi.get<ISessionCheckup[], Pagination>();

        if (!_mode || _mode !== "multiple" || !_doctorIds)
          return { doctor: null, sessionCheckup: metadata };

        const doctor = await doctorApi.getMultipleIDs(_doctorIds);

        return { doctor, sessionCheckup: metadata };
      } catch (error) {
        return { doctor: null, sessionCheckup: null };
      }
    },
  },
  {
    path: DashboardPaths.DoctorEdit + "/:id",
    element: <DoctorAddEditPage />,
    loader: async ({ params: { id } }) => {
      try {
        const response: IDoctorAuth | null = await doctorApi.getById(id as string);

        if (!response) return null;
        return response;
      } catch (error) {
        return null;
      }
    },
  },
];

export default doctorRoute;
