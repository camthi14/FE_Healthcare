import { IDepartment, IOperationResponse, IPosition, IQualification, ISpecialty } from ".";
import { IScheduleDoctor } from "./scheduleDoctor";

export interface IDoctorsInfo {
  id?: number;
  doctor_id: string;
  first_name: string;
  last_name: string;
  birth_date?: string;
  address?: string;
  desc?: string;
  gender?: "MALE" | "FEMALE";
  created_at?: string;
  updated_at?: string;
}

export interface IDoctor {
  id?: string;
  qualified_doctor_id: number;
  speciality_id: number;
  display_name: string;
  username: string;
  password: string;
  email?: string;
  email_verified_at?: string;
  phone_number?: string;
  phone_verified_at?: string;
  remember_token?: string | null;
  photo?: string;
  status?: "active" | "inactive" | "banned" | "retired";
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export interface IDoctorAuth extends IDoctor {
  infoData: IDoctorsInfo;
  operation: null | IOperationResponse;
  qualificationData: IQualification | null;
  specialty?: ISpecialty | null;
  schedules?: Omit<IScheduleDoctor, "dataDoctor"> | null;
}

export type DoctorPayloadAdd = {
  id?: string;
  qualified_doctor_id: string;
  speciality_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  username: string;
  password?: string;
  phone_number: string;
  email: string;
  photo: string;
  department_id: string;
  position_id: string;
  // TODO: missing roles
};

export interface IDoctorResponse extends IDoctor {
  positionData: IPosition | null;
  departmentData: IDepartment | null;
  qualificationData: IQualification | null;
  specialtyData: ISpecialty | null;
  schedules: IScheduleDoctor[];
  scheduleToday: IScheduleDoctor;
}
