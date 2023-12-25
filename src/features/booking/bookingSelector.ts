import { useAppSelector } from "~/stores";

export const useBooking = () => useAppSelector((state) => state.booking);
