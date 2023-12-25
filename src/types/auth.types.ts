export type LoginPayload = {
  username: string;
  password: string;
};

export type AuthRoles = "owner" | "employee" | "doctor";

export type AccessSession = {
  session: string;
  path: string;
};

export interface ForgotPasswordPayload {
  username: string;
  email: string;
}

export interface UserState {
  address?: null | string;
  birth_date?: null | string;
  desc?: null | string;
  display_name: string;
  email: string;
  first_name: string;
  gender: "MALE" | "FEMALE";
  id: number | string;
  last_name: string;
  phone_number: string;
  photo?: string | null;
  username: string;
}
