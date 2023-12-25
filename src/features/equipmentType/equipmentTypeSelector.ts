import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

export const useEquipmentTypes = () => useAppSelector((state) => state.equipmentType);
export const useOptionEquipmentType = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.equipmentType.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.name, value: row.id! }));
      }
    )
  );
