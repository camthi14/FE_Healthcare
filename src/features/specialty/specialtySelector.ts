import { createSelector } from "@reduxjs/toolkit";
import { SpecialtySelect } from "~/models";
import { RootState, useAppSelector } from "~/stores";

export const useSpecialties = () => useAppSelector((state) => state.specialty);

export const useOptionSpecialty = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.specialty.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.name, value: row.id! }));
      }
    )
  );

export const useOptionSpecialtyBooking = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.specialty.data,
      (data): SpecialtySelect[] => {
        if (!data.length) return [];
        return data.map((row) => ({ name: row.name, id: row.id! }));
      }
    )
  );
