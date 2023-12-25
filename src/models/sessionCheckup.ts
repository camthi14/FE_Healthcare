export interface ISessionCheckup {
  id?: number;
  name: string;
  time_start: string;
  time_end: string;
  desc?: string | null;
  status: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
