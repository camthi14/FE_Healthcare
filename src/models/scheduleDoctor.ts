import { IDoctorAuth } from ".";
import { ISessionCheckup } from "./sessionCheckup";

export interface IScheduleDoctor {
  id?: string;
  session_checkup_id: number;
  date: string;
  doctor_id: string;
  sessionData: ISessionCheckup;
  status: "active" | "inactive" | "complete";
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;

  dataDoctor?: IDoctorAuth | null;
  hours?: IHourObject[];
  sessions?: ISessionCheckup | null;
}

export interface IHourObject {
  id: string;
  schedule_doctor_id?: number;
  time_start: string;
  time_end: string;
  is_booked: boolean | 1 | 0;
  is_remove: boolean | 1 | 0;
  is_cancel: boolean | 1 | 0;

  is_over_time?: boolean;
}

export type ScheduleDoctorPayload = {
  doctorId: string;
  date: string;
  hours: IHourObject[];
  sessionCheckUpId: number;
};

export type GetScheduleDoctorForDates = Omit<IScheduleDoctor, "dataDoctor" | "doctor_id">;

export type DoctorCancelScheduleInput = {
  date: string;
  doctorId: string;
  hourId: string;
};
