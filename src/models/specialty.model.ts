import { IDoctorAuth } from ".";

export interface ISpecialty {
  id?: number;
  name: string;
  desc: string;
  photo?: string;
  price: string;
  time_chekup_avg: string | number;
  status?: "active" | "inactive" | "banned" | "waitting" | "reject";
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

type Doctors = Pick<
  IDoctorAuth,
  | "id"
  | "display_name"
  | "email"
  | "phone_number"
  | "photo"
  | "status"
  | "deleted_at"
  | "infoData"
  | "operation"
  | "qualificationData"
  | "schedules"
>;

export type GetDoctorSpecialist = ISpecialty & {
  doctors: Doctors[];
};
