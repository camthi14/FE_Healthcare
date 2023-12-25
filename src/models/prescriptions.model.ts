import { IMedicine, IMedicineData } from ".";

export type PrescriptionsDetailType = {
  id?: string;
  prescriptions_id?: string;
  medicine_id?: string;
  quantity_ordered?: number;
  note?: string;
  medicineData?: IMedicineData;

  amount_use_in_day?: "1" | "2" | "3";
  amount_of_medication_per_session?: number;
  session?: string;

  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
};

export type PrescriptionType = {
  id?: string;
  exam_card_id: string;
  employee_id?: string;
  doctor_id: string;
  diagnosis?: string;
  note?: string;

  quantity_re_exam?: number;
  date_re_exam?: string;

  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
};

export type PrescriptionGetByExamCardIdQuery = {
  doctorId: string;
  examCardId: string;
};

export type MedicineOptionsInPrescription = Pick<
  PrescriptionsDetailType,
  "amount_of_medication_per_session" | "amount_use_in_day" | "session" | "note" | "quantity_ordered"
> & { prescription_details_id?: string } & IMedicine;

export type MedicineOptionsInPrescriptionPayload = {
  medicines: MedicineOptionsInPrescription[];
  doctorId: string;
  examCardId: string;
  quantityReExam: number;
};

export type AddPrescriptionDetailsPayload = {
  id?: string;
  exam_card_id: string;
  prescriptions_id: string;
  totalCost: number;
  quantityReExam: number;
  medicines: PrescriptionsDetailType[];
};

export type ResponseGetExamCardAndDetails = PrescriptionType & {
  details: MedicineOptionsInPrescription[];
};

export type ReceivePrescriptionInput = {
  examCardId: string;
  employeeId: string;
};
