import { IDepartment, IPosition } from ".";

export interface IOperation {
  id?: number;
  employee_id?: string;
  doctor_id?: string;
  department_id: number;
  position_id: number;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IOperationResponse extends IOperation {
  department: null | IDepartment;
  position: null | IPosition;
}
