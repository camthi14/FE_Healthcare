import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  BookingStatus,
  DoctorPayloadAdd,
  ExaminationCardStatus,
  GetPatientForDateResponse,
  IDoctorAuth,
  IPatientData,
  ResultsOptionsGroup,
} from "~/models";
import { IHourObject } from "~/models/scheduleDoctor";
import { Filters, LoadingState, Pagination, SuccessResponseProp } from "~/types";

export interface InitialStateDoctorSlice {
  data: IDoctorAuth[];
  loading: LoadingState;
  filters: Filters;
  pagination: Pagination;
  schedulesData: IHourObject[];
  errors: {
    addEdit?: string;
    get?: string;
    delete?: string;
  };

  screenExamination: {
    selectedExaminationId: string;
    patientActive: GetPatientForDateResponse | null;

    status: ExaminationCardStatus;
    statusBooking: BookingStatus;

    openDialogConfirmExamination: boolean;

    openDialogSwitchPatient: boolean;
  };

  screenSubclinical: {
    selected: ResultsOptionsGroup[];
  };

  screenListPatients: {
    isLoading: LoadingState;
    data: IPatientData[];
    error: string;

    filters: Filters;
    pagination: Pagination;
  };
}

const initialState: InitialStateDoctorSlice = {
  data: [],
  schedulesData: [],
  loading: "ready",
  errors: {
    addEdit: "",
    delete: "",
    get: "",
  },
  filters: {
    page: 1,
    limit: 5,
  },
  pagination: {
    totalRows: 10,
    totalPage: 2,
    page: 1,
    limit: 5,
  },

  screenExamination: {
    selectedExaminationId: "",
    patientActive: null,
    status: "pending",

    openDialogSwitchPatient: false,
    openDialogConfirmExamination: false,
    statusBooking: "in_progress",
  },

  screenSubclinical: {
    selected: [],
  },

  screenListPatients: {
    isLoading: "ready",
    data: [],
    error: "",

    filters: {
      page: 1,
      limit: 5,
    },

    pagination: {
      totalRows: 10,
      totalPage: 2,
      page: 1,
      limit: 5,
    },
  },
};

export type GetDoctorCompleted = SuccessResponseProp<IDoctorAuth[], Pagination>;

export type GetPatientsCompleted = SuccessResponseProp<IPatientData[], Pagination>;

export type AddEditPayloadDoctor = {
  type: "add" | "edit";
  data: DoctorPayloadAdd;
  resetData: () => void;
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    getStart: (state, _: PayloadAction<Partial<Filters>>) => {
      state.loading = "pending";
      state.errors.get = "";
    },
    getCompleted: (
      state,
      { payload: { metadata, options } }: PayloadAction<GetDoctorCompleted>
    ) => {
      state.loading = "completed";
      state.errors.get = "";
      state.data = metadata;
      state.pagination = options ?? initialState.pagination;
    },
    getScheduleStart: (state, _: PayloadAction<{ doctorId: string; date: string }>) => {
      state.loading = "pending";
      state.errors.get = "";
    },
    getScheduleSuccess: (state, { payload }: PayloadAction<IHourObject[]>) => {
      state.loading = "completed";
      state.schedulesData = payload;
    },
    getFailed: (state, { payload }: PayloadAction<string>) => {
      state.loading = "failed";
      state.errors.get = payload;
    },

    addEditStart: (state, _: PayloadAction<AddEditPayloadDoctor>) => {
      state.loading = "pending";
      state.errors.addEdit = "";
    },
    addEditCompleted: (state) => {
      state.loading = "completed";
      state.errors.addEdit = "";
    },
    addEditFailed: (state, { payload }: PayloadAction<string>) => {
      state.loading = "failed";
      state.errors.addEdit = payload;
    },

    deleteStart: (state, _: PayloadAction<string>) => {
      state.loading = "pending";
      state.errors.delete = "";
    },
    deleteCompleted: (state) => {
      state.loading = "completed";
      state.errors.delete = "";
    },
    deleteFailed: (state, { payload }: PayloadAction<string>) => {
      state.loading = "failed";
      state.errors.delete = payload;
    },

    setFilter: (state, { payload }: PayloadAction<Filters>) => {
      state.filters = {
        ...payload,
      };
    },

    setDebounceSearch: (_state, _actions: PayloadAction<Filters>) => {},

    setSelectedExaminationId: (state, { payload }: PayloadAction<string>) => {
      state.screenExamination.selectedExaminationId = payload;
    },

    setSelectedPatientActive: (
      state,
      { payload }: PayloadAction<GetPatientForDateResponse | null>
    ) => {
      state.screenExamination.patientActive = payload;
    },

    setStatus: (state, { payload }: PayloadAction<ExaminationCardStatus>) => {
      state.screenExamination.status = payload;
    },

    setStatusBooking: (state, { payload }: PayloadAction<BookingStatus>) => {
      state.screenExamination.statusBooking = payload;
    },

    setToggleConfirmExamination: (state, { payload }: PayloadAction<boolean>) => {
      state.screenExamination.openDialogConfirmExamination = payload;
    },

    setToggleSwitchPatient: (state, { payload }: PayloadAction<boolean>) => {
      state.screenExamination.openDialogSwitchPatient = payload;
    },

    setSelectedSubClinical: (state, { payload }: PayloadAction<ResultsOptionsGroup[]>) => {
      state.screenSubclinical.selected = payload;
    },

    getPatientsStart: (state, _: PayloadAction<Partial<Filters>>) => {
      state.screenListPatients.isLoading = "pending";
      state.screenListPatients.error = "";
    },
    getPatientsSuccess: (
      state,
      { payload: { metadata, options } }: PayloadAction<GetPatientsCompleted>
    ) => {
      state.screenListPatients.isLoading = "completed";
      state.screenListPatients.error = "";
      state.screenListPatients.data = metadata;
      state.screenListPatients.pagination = options ?? initialState.screenListPatients.pagination;
    },
    getPatientsFailed: (state, _: PayloadAction<string>) => {
      state.screenListPatients.isLoading = "pending";
      state.screenListPatients.error = "";
    },
  },
});

export const doctorActions = doctorSlice.actions;
export default doctorSlice.reducer;
