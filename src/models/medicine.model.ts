import { IUnit } from ".";

export interface IMedicine {
  id?: string;
  medictine_type_id: number;
  unit_id: number;
  name: string;
  status?: "active" | "inactive" | "banned" | "waiting";

  infoData?: IMedicineDetail;
  typeName?: string;
  unit?: IUnit;

  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export interface IMedicineType {
  id?: number;
  name: string;
  desc: string;
  status?: "active" | "inactive" | "banned";

  medicines?: IMedicine[];

  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export interface IMedicineDetail {
  medicine_id: string;
  quantity: number;
  price: number;
  production_date: string;
  drug_concentration: number;
  price_sell: number;
  ingredients: string;
  expired_at: string;
  status?: "active" | "inactive" | "banned" | "waiting" | "reject";
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export interface IMedicineData extends IMedicine {
  infoData: IMedicineDetail;
  medicineType?: IMedicineType | null;
}

export type MedicinePayloadAdd = {
  id?: string;
  quantity: string;
  price: string;
  production_date: string;
  drug_concentration: string;
  price_sell: string;
  ingredients: string;
  expired_at: string;
  medictine_type_id: string;
  unit_id: string;
  name: string;
  status?: "active" | "inactive" | "banned" | "waiting";
};

export type MedicineOptionsGroup = IMedicine;
