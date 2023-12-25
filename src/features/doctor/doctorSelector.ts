import { useAppSelector } from "~/stores";

export const useDoctors = () => useAppSelector((state) => state.doctor);
