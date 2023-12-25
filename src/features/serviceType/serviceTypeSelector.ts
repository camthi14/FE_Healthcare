import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

export const useServiceTypes = () => useAppSelector((state) => state.serviceType);
export const useOptionServiceType = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.serviceType.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.name, value: row.id! }));
      }
    )
  );
