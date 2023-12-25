export interface IEquipment {
  id?: number;
  equipment_type_id: string;
  photo?: string | null;
  name: string;
  desc: string;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export interface IEquipmentType {
  id?: number;
  name: string;
  desc: string;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}
