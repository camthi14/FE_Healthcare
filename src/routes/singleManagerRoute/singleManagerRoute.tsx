import { lazy } from "react";
import { RouteObject, redirect } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardPaths } from "~/types";

const CheckHealthyPage = Loadable(lazy(() => import("~/pages/checkHealthy/CheckHealthyPage")));
const UnitPage = Loadable(lazy(() => import("~/pages/unit")));
const DepartmentPage = Loadable(lazy(() => import("~/pages/department")));
const PositionPage = Loadable(lazy(() => import("~/pages/position")));
const QualificationPage = Loadable(lazy(() => import("~/pages/qualification")));
const SpecialtyPage = Loadable(lazy(() => import("~/pages/specialty")));
const EquipmentPage = Loadable(lazy(() => import("~/pages/equipment")));
const EquipmentTypePage = Loadable(lazy(() => import("~/pages/equipment/EquipmentTypePage")));
const ServicePackPage = Loadable(lazy(() => import("~/pages/servicePack")));
const ServiceTypePage = Loadable(lazy(() => import("~/pages/servicePack/ServiceTypePage")));
const SubclinicalPackPage = Loadable(lazy(() => import("~/pages/subclinical")));
const SubclinicalTypePage = Loadable(lazy(() => import("~/pages/subclinical/SubclinicalTypePage")));
const MedicinePage = Loadable(lazy(() => import("~/pages/medicine")));
const MedicineTypePage = Loadable(lazy(() => import("~/pages/medicine/MedicineTypePage")));
const FrontDeskPage = Loadable(lazy(() => import("~/pages/frontDesk/FrontDeskPage")));

const TabAboutFrontDesk = [
  { title: "Đăng ký khám", mode: "" },
  { title: "Danh sách tiếp nhận", mode: "receive" },
  { title: "Danh sách nhận thuốc", mode: "list-patient" },
  { title: "Danh sách hóa đơn chỉ định", mode: "bill-subclinical" },
];

const TabAboutCheckHealthy = [
  { title: "Thông tin BN", mode: "" },
  { title: "Lịch sử khám", mode: "history-checkup" },
  { title: "Thông tin Khám", mode: "detail-checkup" },
  { title: "Chỉ định CLS", mode: "point-subclinical" },
  { title: "Kê Thuốc", mode: "prescribe-medicine" },
];

const singleManagerRoute: RouteObject[] = [
  {
    path: DashboardPaths.CheckHealthy,
    element: <CheckHealthyPage />,
    loader({ request }) {
      const tab = new URL(request.url).searchParams.get("tab");

      if (!tab) return 0;

      const index = TabAboutCheckHealthy.findIndex((t) => t.mode === tab);

      if (index === -1) return redirect(DashboardPaths.CheckHealthy);

      return index;
    },
  },
  { path: DashboardPaths.Unit, element: <UnitPage /> },
  { path: DashboardPaths.Department, element: <DepartmentPage /> },
  { path: DashboardPaths.Position, element: <PositionPage /> },
  { path: DashboardPaths.Qualification, element: <QualificationPage /> },
  { path: DashboardPaths.Specialty, element: <SpecialtyPage /> },
  { path: DashboardPaths.Equipment, element: <EquipmentPage /> },
  { path: DashboardPaths.EquipmentType, element: <EquipmentTypePage /> },
  { path: DashboardPaths.Service, element: <ServicePackPage /> },
  { path: DashboardPaths.ServiceType, element: <ServiceTypePage /> },
  { path: DashboardPaths.Subclinical, element: <SubclinicalPackPage /> },
  { path: DashboardPaths.SubclinicalType, element: <SubclinicalTypePage /> },
  { path: DashboardPaths.Medicine, element: <MedicinePage /> },
  { path: DashboardPaths.MedicineType, element: <MedicineTypePage /> },
  {
    path: DashboardPaths.FrontDesk,
    element: <FrontDeskPage />,
    loader({ request }) {
      const tab = new URL(request.url).searchParams.get("tab");

      if (!tab) return 0;

      const index = TabAboutFrontDesk.findIndex((t) => t.mode === tab);

      if (index === -1) return redirect(DashboardPaths.FrontDesk);

      return index;
    },
  },
];

export default singleManagerRoute;
