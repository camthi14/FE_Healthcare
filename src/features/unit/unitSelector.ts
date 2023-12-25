import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

export const useUnits = () => useAppSelector((state) => state.unit);
export const useOptionUnit = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.unit.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.name, value: row.id! }));
      }
    )
  );
