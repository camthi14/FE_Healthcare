import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

export const useSubclinicalTypes = () => useAppSelector((state) => state.subclinicalType);
export const useOptionSubclinicalType = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.subclinicalType.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.name, value: row.id! }));
      }
    )
  );
