import { IRoom } from ".";
import { ResultsDiagnosisSubclinical, ResultsImage } from "./resultsDiagnosisSubclinical.model";

export interface ISubclinical {
  id?: number;
  subclinical_type_id: number;
  price: number;
  content: string;
  name: string;
  room_id: number;
  desc: string;
  status?: "active" | "inactive" | "banned";
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
  dataRoom?: IRoom | null;

  dataSubclinicalType?: ISubclinicalType | null;
  results?: ResultsDiagnosisSubclinical | null;
  images?: ResultsImage[];
}

export interface ISubclinicalType {
  id?: number;
  name: string;
  subclinical?: ISubclinical[];
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export type SubclinicalPayloadAdd = {
  id?: number;
  subclinical_type_id: string;
  price: string;
  content: string;
  name: string;
  room_id: string;
  desc: string;
  status?: "active" | "inactive" | "banned";
};

export type ResultsOptionsGroup = ISubclinical & { group: string };
