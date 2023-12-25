import { useAppSelector } from "~/stores";

export const useEmployees = () => useAppSelector((state) => state.employee);
