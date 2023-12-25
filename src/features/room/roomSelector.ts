import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

export const useRooms = () => useAppSelector((state) => state.room);
export const useOptionRoom = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.room.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.name, value: row.id! }));
      }
    )
  );
