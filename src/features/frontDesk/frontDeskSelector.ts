import { useAppSelector } from "~/stores";

export const useFrontDesk = () => useAppSelector((state) => state.frontDesk);
