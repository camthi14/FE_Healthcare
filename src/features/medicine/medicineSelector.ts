import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

export const useMedicines = () => useAppSelector((state) => state.medicine);
export const useOptionMedicine = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.medicine.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.name, value: row.id! }));
      }
    )
  );
