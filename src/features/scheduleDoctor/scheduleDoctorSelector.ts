import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

export const useScheduleDoctor = () => useAppSelector((state) => state.scheduleDoctor);
export const useOptionScheduleDoctor = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.scheduleDoctor.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.name, value: row.id! }));
      }
    )
  );
