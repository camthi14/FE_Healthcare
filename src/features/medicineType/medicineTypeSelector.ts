import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

export const useMedicineTypes = () => useAppSelector((state) => state.medicineType);
export const useOptionMedicineType = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.medicineType.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.name, value: row.id! }));
      }
    )
  );
