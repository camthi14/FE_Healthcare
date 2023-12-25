import {
  BookingStatus,
  BookingTypePatient,
  IBill,
  IBooking,
  IDoctorAuth,
  IPatientData,
  IPatientInfo,
  IService,
  ISubclinical,
  ResultsOptionsGroup,
} from ".";
import { BookingsImageState } from "./imagesBooking.model";
import { PrescriptionType } from "./prescriptions.model";
import { ResultsDiagnosisSubclinical, ResultsImage } from "./resultsDiagnosisSubclinical.model";
import { IHourObject } from "./scheduleDoctor";

export type ExaminationCardStatus =
  | "in_progress"
  | "complete"
  | "pending"
  | "reject"
  | "delay_results"
  | "examination";

export type ExaminationCardOptions =
  | "service"
  | "subclinical"
  | "doctor.service"
  | "doctor.subclinical"
  | "re_examination"
  | "doctor.re_examination";

export type ExaminationCardType = {
  id?: string;
  order: number;
  booking_id: string;
  note: string;
  status?: ExaminationCardStatus;
  artery?: number | null;
  temperature?: number | null;
  spO2?: number | null;
  breathing_rate?: number | null;
  blood_pressure?: number | null;
  under_blood_pressure?: number | null;

  options?: ExaminationCardOptions;
  is_use_service?: boolean;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
  dataBooking?: IBooking;
};

export type ExaminationCardDetailsPayload = {
  examination_card_id: string;
  employee_id: string;
  bill_id: string;
  booking_id: string;
  options: string;
  service_id: number;
  data: { id: number; price: number }[];
};

export type ExaminationCardsDetailStatus = "required" | "finished" | "unfinished";

export type ExaminationCardsDetailType = {
  id?: string;
  examination_card_id: string;
  service_entity: string;
  service_value: string;
  doctor_id?: string | null;

  serviceData?: null | IService;
  subclinicalData?: null | ISubclinical[] | ISubclinical;
  results?: null | ResultsDiagnosisSubclinical;

  images?: ResultsImage[];

  status?: ExaminationCardsDetailStatus;
  doctorName?: string;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
};

export type ExaminationCardsDetailTypePatient = Omit<
  ExaminationCardsDetailType,
  "subclinicalData"
> & {
  subclinicalData?: null | ISubclinical;
};

export type GetPatientInformationPatient = {
  patient: {
    id: string;
    display_name: string;
    phone_number: string;
    birth_date: string;
    gender: "MALE" | "FEMALE";
  };
  examinationCard: ExaminationCardType;
  examinationCardDetails: ExaminationCardsDetailTypePatient[];
  booking: IBooking;
  bill: IBill;
};

export type PaymentServicePayload = {
  bill_id: string;
  booking_id: string;
  deposit: number;
  change: number;
  price_received: number;
  total: number;
};

export type DetailPatientPayload = {
  bill_id: string;
  booking_id: string;
};

export type GetPatientForDateResponse = {
  id: string;
  order: number;
  reason: string;
  doctor: Pick<IDoctorAuth, "display_name" | "id" | "qualificationData">;
  patient: Pick<
    IPatientData,
    "display_name" | "id" | "phone_number" | "infoData" | "email" | "patient_type_id"
  >;
  dataHour: IHourObject;
  bill: IBill | null;
  billMedicine: IBill | null;
  billSubclinical: IBill[];
  examinationData: ExaminationCardType;
  created_at: string;
  type_patient: BookingTypePatient;

  imageData: BookingsImageState[];
};

export type GetPatientForDateQuery = {
  date: string;
  bookingStatus: BookingStatus;
  examinationStatus?: ExaminationCardStatus;
  doctorId?: string;
};

export type PatientInfoNotModify = Pick<
  IPatientData,
  "display_name" | "id" | "phone_number" | "email" | "patient_type_id"
> &
  Pick<IPatientInfo, "birth_date" | "address"> &
  Pick<IBooking, "reason">;

export type CheckHealthyPatientPayload = {} & Pick<
  ExaminationCardType,
  "artery" | "blood_pressure" | "breathing_rate" | "spO2" | "temperature" | "under_blood_pressure"
> &
  Pick<IBooking, "reason"> &
  Pick<PrescriptionType, "exam_card_id" | "doctor_id" | "diagnosis" | "note">;

export type ConfirmExaminationType = {
  examinationId: string;
  doctorId: string;
};

export type RequiredExaminationSubclinical = {
  examinationCardId: string;
  doctorId: string;
  data: { id: number; price: number }[];
};

export type RequiredExaminationSubclinicalInitialValues = {
  examinationCardId: string;
  doctorId: string;
  data: ResultsOptionsGroup[];
};

export type GetRequiredByDoctor = {
  examinationCardId: string;
  doctorId: string;
  status: ExaminationCardsDetailStatus;
};

export type DiagnosisExaminationCardDetails = {
  detailsId: string;
  subclinicalName: string;
  subclinicalId: number;
  serviceName?: string;

  results: string;
  rate: string;

  images?: any[];
  removeImages?: { id: string }[];
};
