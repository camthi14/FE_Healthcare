import { Icon } from "@iconify/react";
import { Box } from "@mui/material";
import { AuthRoles, DashboardPaths, INavConfig } from "~/types";

function icon(name: string) {
  return <Box component={Icon} icon={name} sx={{ width: 1, height: 1 }} />;
}

const navConfig: INavConfig[] = [
  {
    //Dành cho nhân viên y tế
    title: "Quản lý tiếp đón",
    icon: icon("dashicons:welcome-widgets-menus"),
    path: DashboardPaths.FrontDesk,
  },

  {
    path: DashboardPaths.DoctorScheduleList,
    icon: icon("zondicons:calendar"),
    title: "Lịch khám của bác sĩ ",
  },

  {
    //Dành cho nhân viên y tế
    title: "Quản lý thiết bị y tế",
    icon: icon("guidance:medical-laboratory"),
    children: [
      {
        path: DashboardPaths.EquipmentType,
        icon: icon("solar:document-medicine-broken"),
        title: "Loại thiết bị y tế",
      },
      {
        path: DashboardPaths.Equipment,
        icon: icon("solar:document-medicine-broken"),
        title: "Danh sách thiết bị y tế",
      },
    ],
  },
  {
    //Dành cho nhân viên y tế
    title: "Quản lý gói khám",
    icon: icon("carbon:reminder-medical"),
    children: [
      {
        path: DashboardPaths.ServiceType,
        icon: icon("solar:document-medicine-broken"),
        title: "Loại gói khám",
      },
      {
        path: DashboardPaths.Service,
        icon: icon("solar:document-medicine-broken"),
        title: "Danh sách gói khám",
      },
    ],
  },
  {
    //Dành cho nhân viên y tế
    title: "Quản lý cận lâm sàng",
    icon: icon("mdi:health-potion-outline"),
    children: [
      {
        path: DashboardPaths.SubclinicalType,
        icon: icon("solar:document-medicine-broken"),
        title: "Loại CLS",
      },
      {
        path: DashboardPaths.Subclinical,
        icon: icon("solar:document-medicine-broken"),
        title: "Danh sách CLS",
      },
    ],
  },
  {
    //Dành cho nhân viên y tế
    title: "Quản lý thuốc",
    icon: icon("covid:vaccine-protection-medicine-pill"),
    children: [
      // {
      //   path: DashboardPaths.Unit,
      //   icon: icon("healthicons:pharmacy"),
      //   title: "Quản lý đơn vị thuốc",
      // },
      {
        path: DashboardPaths.MedicineType,
        icon: icon("solar:document-medicine-broken"),
        title: "Loại thuốc",
      },
      {
        path: DashboardPaths.Medicine,
        icon: icon("solar:document-medicine-broken"),
        title: "Danh sách thuốc",
      },
    ],
  },
];

const initNavConfig = (role: AuthRoles | null): INavConfig[] => {
  if (!role) return [];

  if (role === "doctor") {
    return [
      {
        title: "Quản lý khám bệnh",
        icon: icon("icon-park-outline:medicine-chest"),
        path: DashboardPaths.CheckHealthy,
      },
      {
        title: "Danh sách chỉ định",
        icon: icon("iwwa:assign"),
        path: DashboardPaths.DoctorPointSubclinicalList,
      },
      {
        title: "Danh sách bệnh nhân",
        icon: icon("material-symbols:patient-list-rounded"),
        path: DashboardPaths.PatientList,
      },
      {
        path: DashboardPaths.DoctorSchedule,
        icon: icon("zondicons:calendar"),
        title: "Lịch khám bệnh",
      },
    ];
  }

  if (role === "employee") {
    return navConfig;
  }

  return [
    {
      title: "Bảng điều khiển",
      path: DashboardPaths.DashboardApp,
      icon: icon("eva:pie-chart-2-fill"),
    },
    {
      //Dành cho chủ phòng khám
      title: "Quản lý nhân viên",
      icon: icon("eva:people-fill"),
      children: [
        {
          path: DashboardPaths.Employee,
          icon: icon("solar:document-medicine-broken"),
          title: "Danh sách nhân viên",
        },
        {
          path: DashboardPaths.EmployeeAdd,
          icon: icon("mdi:user-add"),
          title: "Thêm nhân viên",
        },
      ],
    },
    {
      //Dành cho chủ phòng khám
      title: "Quản lý bác sĩ",
      icon: icon("noto:health-worker"),
      children: [
        {
          path: DashboardPaths.Qualification,
          icon: icon(
            "streamline:money-graph-bar-increase-up-product-performance-increase-arrow-graph-business-chart"
          ),
          title: "Quản lý trình độ bác sĩ",
        },
        {
          path: DashboardPaths.Doctor,
          icon: icon("solar:document-medicine-broken"),
          title: "Danh sách bác sĩ",
        },
        {
          path: DashboardPaths.DoctorAdd,
          icon: icon("mdi:user-add"),
          title: "Thêm bác sĩ",
        },
        {
          path: DashboardPaths.DoctorScheduleList,
          icon: icon("zondicons:calendar"),
          title: "Lịch khám bệnh ",
        },
      ],
    },
    {
      //Dành cho chủ phòng khám
      title: "Bộ phận - Chức vụ",
      icon: icon("mingcute:department-fill"),
      children: [
        {
          path: DashboardPaths.Position,
          icon: icon("solar:document-medicine-broken"),
          title: "Quản lý chức vụ",
        },
        {
          path: DashboardPaths.Department,
          icon: icon("mingcute:department-fill"),
          title: "Quản lý bộ phận",
        },
      ],
    },
    {
      title: "Quản lý chuyên khoa",
      icon: icon("game-icons:health-potion"),
      path: DashboardPaths.Specialty,
    },
  ];
};

export default initNavConfig;
