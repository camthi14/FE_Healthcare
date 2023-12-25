import { useLoaderData } from "react-router-dom";
import { IEmployeeAuth } from "~/models";

export const useLoadDataEdit = () => {
  const data = useLoaderData() as IEmployeeAuth | null;
  return data;
};
