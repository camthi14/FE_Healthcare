import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

export const useEquipments = () => useAppSelector((state) => state.equipment);
export const useOptionEquipment = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.equipment.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.name, value: row.id! }));
      }
    )
  );
