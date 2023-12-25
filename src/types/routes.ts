export enum DashboardPaths {
  Dashboard = "/dashboard",
  DashboardApp = "/dashboard/app",
  //employee
  Employee = "/dashboard/employee",
  EmployeeAdd = "/dashboard/employee-add",
  EmployeeEdit = "/dashboard/employee-edit",

  //
  FrontDesk = "/dashboard/front-desk",

  //doctor
  Doctor = "/dashboard/doctor",
  DoctorAdd = "/dashboard/doctor-add",
  DoctorEdit = "/dashboard/doctor-edit",
  DoctorScheduleAdd = "/dashboard/doctor-schedule-add",
  DoctorScheduleEdit = "/dashboard/doctor-schedule-edit",
  DoctorScheduleList = "/dashboard/doctor-schedule-list",
  DoctorSchedule = "/dashboard/doctor-schedule",
  DoctorPointSubclinicalList = "/dashboard/doctor-pointSubclinical-list",
  PatientList = "/dashboard/doctor/patient-list",

  CheckHealthy = "/dashboard/check-healthy",
  Profile = "/dashboard/profile",
  Department = "/dashboard/department",
  Position = "/dashboard/position",
  Qualification = "/dashboard/qualification",
  Specialty = "/dashboard/specialty",
  Equipment = "/dashboard/equipment",
  EquipmentType = "/dashboard/equipment-type",
  Service = "/dashboard/service",
  ServiceType = "/dashboard/service-type",
  Subclinical = "/dashboard/subclinical",
  SubclinicalType = "/dashboard/subclinical-type",

  //Medicine
  Unit = "/dashboard/unit",
  Medicine = "/dashboard/medicine",
  MedicineType = "/dashboard/medicine-type",
}

export enum SinglePaths {
  LoginEmployee = "/login",
  LoginDoctor = "/doctor/login",
  LoginOwner = "/owner/login",
  Register = "/register",
  ErrorBoundary = "/404",
  Any = "*",
}
