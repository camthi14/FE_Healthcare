import { ExaminationCardType, IBill, IDoctorAuth, IPatientData } from ".";
import { IHourObject } from "./scheduleDoctor";

export type BookingStatus =
  | "in_progress"
  | "waiting"
  | "completed"
  | "paid"
  | "canceled"
  | "doctor_canceled";

export type BookingTypePatient = "new" | "re_examination";

export interface IBooking {
  id?: string;
  patient_id: string;
  doctor_id: string;
  hour_id: string;
  date: string;
  note?: string;
  reason: string;
  price?: number;
  order: number;
  actor_booking_type?: string;
  actor_booking_value?: string;
  type_patient: BookingTypePatient;
  status?: BookingStatus;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
  dataPatient?: IPatientData | null;
  dataDoctor?: IDoctorAuth | null;
  dataHour?: IHourObject | null;

  bill?: IBill | null;
  billMedicine?: IBill | null;
  billSubclinical?: IBill[];
  examCard?: ExaminationCardType | null;
}

export type PatientSelect = { displayName: string; id: string };
export type SpecialtySelect = { name: string; id: number };

export type StepOnBasicState = {
  reason: string;
  patient: PatientSelect | null;
  specialty: SpecialtySelect | null;
  isReExamination: boolean;
};

export type BookingDesktopPayload = {
  patientId: string;
  employeeId: string;
  specialtyId: string;
  doctorId: string;
  hourId: string;
  isReExamination: boolean;
  date: string;
  reason: string;
  order: number;
};
