import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

export const useQualifications = () => useAppSelector((state) => state.qualification);
export const useOptionQualification = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.qualification.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.name, value: row.id! }));
      }
    )
  );
