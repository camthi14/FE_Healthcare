import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

export const useServices = () => useAppSelector((state) => state.service);
export const useOptionService = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.service.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.name, value: row.id! }));
      }
    )
  );
