export interface IQualification {
  id?: number;
  name: string;
  status?: "active" | "inactive" | "banned";
  character: string;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}
