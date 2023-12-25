import { ISubclinical } from ".";

export interface IService {
  id?: number;
  service_type_id: number;
  photo?: string | null;
  price: number;
  content: string;
  name: string;
  desc: string;
  subclinicalData?: ISubclinical[];
  status?: "active" | "inactive" | "banned";
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export interface IServiceType {
  id?: number;
  name: string;
  desc: string;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export type ServicePayloadAdd = {
  id?: number;
  service_type_id: string;
  photo?: string | null;
  price: string;
  content: string;
  name: string;
  desc: string;
  status?: "active" | "inactive" | "banned";
  subclinical: ISubclinical[] | null;
};

export type ServicePatientPayload = {
  options: "service" | "subclinical";
  service_id: number;
  quantity_perform?: number;
  note?: string;
  data?: ISubclinical[];
};
