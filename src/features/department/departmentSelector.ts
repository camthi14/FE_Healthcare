import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "~/stores";

export const useDepartments = () => useAppSelector((state) => state.department);
export const useOptionDepartment = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.department.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.name, value: row.id! }));
      }
    )
  );
