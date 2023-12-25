import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

export const usePositions = () => useAppSelector((state) => state.position);
export const useOptionPosition = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.position.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.name, value: row.id! }));
      }
    )
  );
