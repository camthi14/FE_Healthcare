import { IEmployee } from ".";

export type BillStatus = "paid" | "unpaid" | "partially_paid" | "others";
export type PaymentForBill = "medicine" | "cost_exam" | "cost_cls";

export interface IBill {
  id?: string;
  employee_id: string;
  booking_id: string;
  examination_card_id: string;
  total_price: number;
  payment_for: PaymentForBill;
  deposit?: number;
  change?: number;
  price_received?: number;
  note?: string;
  status: BillStatus;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
  dataEmployee?: IEmployee | null;
}

export type BillPayload = {
  change?: number;
  price_received?: number;
};
