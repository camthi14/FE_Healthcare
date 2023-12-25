import { useAppSelector } from "~/stores";

export const useExaminationCard = () => useAppSelector((state) => state.examinationCard);
export const usePrescription = () => useAppSelector((state) => state.examinationCard.prescriptions);
