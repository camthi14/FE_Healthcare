import { ExaminationCardType } from ".";
import { IHourObject } from "./scheduleDoctor";

export interface IPatient {
  id?: string;
  patient_type_id: string;
  display_name: string;
  password: string;
  email: string;
  email_verified_at?: string;
  phone_number: string;
  phone_verified_at?: string;
  remember_token?: string;
  photo?: string;
  status?: "active" | "inactive" | "waitting";
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
  email_verify_token?: string | null;
  otp_token?: string | null;
}

export interface PatientType {
  id?: number;
  name: string;
  desc: string;
  created_at?: string;
  updated_at?: string;
}

export interface IPatientInfo {
  id?: number;
  patient_id: string;
  first_name: string;
  last_name: string;
  birth_date?: string;
  address?: string;
  desc?: string;
  gender?: "MALE" | "FEMALE";
  created_at?: string;
  updated_at?: string;
}

export interface IPatientData extends IPatient {
  infoData: IPatientInfo;
  patientType?: PatientType;
  lastCurrent?: string;
}

export type GetHistoryExamination = ExaminationCardType & {
  reason: string;
  date: string;
  hour: IHourObject;
};

export type GetHistoryExaminationQuery = {
  patientId: string;
};

export type PatientTypeModel = {
  id?: number;
  name: string;
  desc: string;
  created_at?: string;
  updated_at?: string;
};

export type PatientPayloadAdd = Pick<
  IPatientInfo,
  "first_name" | "last_name" | "address" | "birth_date" | "gender"
> &
  Pick<IPatient, "phone_number" | "patient_type_id">;
