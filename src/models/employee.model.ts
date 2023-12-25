import { IOperationResponse } from "./operation.model";

export interface IEmployee {
  id?: string;
  display_name: string;
  username: string;
  password: string;
  email?: string;
  email_verified_at?: string;
  phone_number?: string;
  phone_verified_at?: string;
  remember_token?: string | null;
  photo?: string;
  status?: "active" | "inactive" | "banned" | "retired";
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export interface IEmployeeInfo {
  id?: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  birth_date?: string;
  address?: string;
  desc?: string;
  gender?: "MALE" | "FEMALE";
  created_at?: string;
  updated_at?: string;
}

export interface IEmployeeAuth extends IEmployee {
  infoData: IEmployeeInfo;
  operation: null | IOperationResponse;
}

export type DepartmentSelect = { name: string; id: string };

export type EmployeePayloadAdd = {
  id?: string;
  first_name: string;
  last_name: string;
  gender: string;
  username: string;
  password?: string;
  phone_number: string;
  email: string;
  photo: string;
  department_id: string;
  position_id: string;
  // TODO: missing roles
};
