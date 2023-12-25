import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

export const useSubclinicals = () => useAppSelector((state) => state.subclinical);
export const useOptionSubclinical = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.subclinical.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.name, value: row.id! }));
      }
    )
  );
