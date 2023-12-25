import { createSelector } from "@reduxjs/toolkit";
import { PatientSelect } from "~/models";
import { RootState, useAppSelector } from "~/stores";

export const usePatients = () => useAppSelector((state) => state.patient);

export const useOptionPatientBooking = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.patient.data,
      (data): PatientSelect[] => {
        if (!data.length) return [];
        return data.map((row) => ({ displayName: `${row.id} - ${row.display_name}`, id: row.id! }));
      }
    )
  );

export const useOptionPatient = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.patient.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.display_name, value: row.id! }));
      }
    )
  );

export const useOptionPatientType = () =>
  useAppSelector(
    createSelector(
      (state: RootState) => state.patient.patientTypes.data,
      (data) => {
        if (!data.length) return [];
        return data.map((row) => ({ label: row.name, value: row.id! }));
      }
    )
  );
