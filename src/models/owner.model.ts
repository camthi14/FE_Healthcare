export interface IOwner {
  id?: number;
  display_name: string;
  username: string;
  password: string;
  email?: string;
  email_verified_at?: string;
  phone_number?: string;
  phone_verified_at?: string;
  remember_token?: string | null;
  token_owner?: string;
  photo?: string;
  status?: "active" | "inactive" | "banned" | "retired";
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export interface IOwnerInfo {
  id?: number;
  owner_id: number;
  first_name: string;
  last_name: string;
  birth_date?: string;
  address?: string;
  desc?: string;
  gender?: "MALE" | "FEMALE";
  created_at?: string;
  updated_at?: string;
}

export interface IOwnerAuth extends IOwner {
  infoData: IOwnerInfo;
}
