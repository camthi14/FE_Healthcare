import { useLoaderData } from "react-router-dom";
import { IDoctorAuth } from "~/models";

export const useLoadDataEdit = () => {
  const data = useLoaderData() as IDoctorAuth | null;
  return data;
};
