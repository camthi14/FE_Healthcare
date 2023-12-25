import { AlertColor } from "@mui/material";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ReportDashboardState } from "~/models/report.model";
import { LoadingState } from "~/types";

interface AppSliceState {
  snackbar: {
    open: boolean;
    text: string;
    duration: number;
    severity: AlertColor;
  };
  backdrop: {
    open: boolean;
  };
  currentTab: number;

  reports: {
    isLoading: LoadingState;
    error: string;

    dashboard: ReportDashboardState;
  };

  title: string;
}

const initialState: AppSliceState = {
  snackbar: {
    open: false,
    text: "",
    duration: 3000,
    severity: "info",
  },
  backdrop: {
    open: false,
  },
  currentTab: 0,

  reports: {
    isLoading: "ready",
    error: "",

    dashboard: {
      patient: 0,
      doctor: 0,
      employee: 0,
      isBooked: 0,
      isCanceled: 0,
      examinationCard: 0,
    },
  },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTitle: (state, { payload }: PayloadAction<string>) => {
      state.title = payload;
    },
    setSnackbar: (
      state,
      {
        payload,
      }: PayloadAction<{
        open: boolean;
        text: string;
        duration?: number;
        severity: AlertColor;
      }>
    ) => {
      state.snackbar = { ...state.snackbar, ...payload };
    },
    setCloseSnackbar: (state) => {
      state.snackbar = initialState.snackbar;
    },
    setOpenBackdrop: (state) => {
      state.backdrop.open = true;
    },
    setCloseBackdrop: (state) => {
      state.backdrop.open = false;
    },
    setCurrentTab: (state, { payload }: PayloadAction<number>) => {
      state.currentTab = payload;
    },
    setNavigation: (_, {}: PayloadAction<string>) => {},

    getReportDashboardStart: (state) => {
      state.reports.isLoading = "pending";
      state.reports.error = "";
    },
    getReportDashboardSuccess: (state, { payload }: PayloadAction<ReportDashboardState>) => {
      state.reports.isLoading = "pending";
      state.reports.dashboard = {
        ...state.reports.dashboard,
        ...payload,
      };
    },
    getReportDashboardFailed: (state, { payload }: PayloadAction<string>) => {
      state.reports.isLoading = "pending";
      state.reports.error = payload;
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice.reducer;
