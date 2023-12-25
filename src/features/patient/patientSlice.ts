import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  GetHistoryExamination,
  GetHistoryExaminationQuery,
  IPatient,
  IPatientData,
  ISpecialty,
  PatientPayloadAdd,
  PatientTypeModel,
} from "~/models";
import { ResponseGetExamCardAndDetails } from "~/models/prescriptions.model";
import { Filters, LoadingState, Pagination, SuccessResponseProp } from "~/types";

type Actions = {
  open: "seeBill" | "seePrescription" | "seeAssign" | null;
  data: GetHistoryExamination | null;
};

interface InitialState {
  data: IPatient[];
  loading: LoadingState;
  filters: Filters;
  pagination: Pagination;
  errors: {
    addEdit?: string;
    get?: string;
    delete?: string;
  };

  patientTypes: {
    data: PatientTypeModel[];
    loading: LoadingState;
    error: string;
    open: boolean;
  };

  historyExamination: {
    isLoading: LoadingState;
    data: GetHistoryExamination[];
    error: string;

    selectedPatient: IPatientData | null;

    actions: Actions;

    prescriptions: ResponseGetExamCardAndDetails | null;
  };
}

const initialState: InitialState = {
  data: [],
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

  patientTypes: {
    data: [],
    loading: "ready",
    error: "",
    open: false,
  },

  historyExamination: {
    isLoading: "ready",
    data: [],
    error: "",
    selectedPatient: null,

    actions: {
      open: null,
      data: null,
    },

    prescriptions: null,
  },
};

export type PatientCompleted = SuccessResponseProp<IPatient[], Pagination>;
export type AddEditPayloadPatient = {
  type: "add" | "edit";
  data: ISpecialty;
  resetData: () => void;
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    getStart: (state, _: PayloadAction<Partial<Filters>>) => {
      state.loading = "pending";
      state.errors.get = "";
    },
    getCompleted: (state, { payload: { metadata, options } }: PayloadAction<PatientCompleted>) => {
      state.loading = "completed";
      state.errors.get = "";
      state.data = metadata;
      state.pagination = options ?? initialState.pagination;
    },
    getFailed: (state, { payload }: PayloadAction<string>) => {
      state.loading = "failed";
      state.errors.get = payload;
    },

    setToggleOpenAddPatient: (state, { payload }: PayloadAction<boolean>) => {
      state.patientTypes.open = payload;
    },

    getPatientTypeStart: (state) => {
      state.patientTypes.loading = "pending";
      state.patientTypes.error = "";
    },
    getPatientTypeCompleted: (state, { payload }: PayloadAction<PatientTypeModel[]>) => {
      state.patientTypes.loading = "completed";
      state.patientTypes.error = "";
      state.patientTypes.data = payload;
    },
    getPatientTypeFailed: (state, { payload }: PayloadAction<string>) => {
      state.patientTypes.loading = "failed";
      state.patientTypes.error = payload;
    },

    addEditStart: (state, _: PayloadAction<AddEditPayloadPatient>) => {
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

    addPatientDesktopStart: (
      state,
      _: PayloadAction<{ data: PatientPayloadAdd; resetForm: () => void }>
    ) => {
      state.patientTypes.loading = "pending";
      state.patientTypes.error = "";
    },
    addPatientDesktopCompleted: (state) => {
      state.patientTypes.loading = "completed";
      state.patientTypes.error = "";
      state.patientTypes.open = false;
    },
    addPatientDesktopFailed: (state, { payload }: PayloadAction<string>) => {
      state.patientTypes.loading = "failed";
      state.patientTypes.error = payload;
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

    getHistoryExaminationStart: (state, _: PayloadAction<GetHistoryExaminationQuery>) => {
      state.historyExamination.isLoading = "pending";
      state.historyExamination.error = "";
    },
    getHistoryExaminationSuccess: (state, { payload }: PayloadAction<GetHistoryExamination[]>) => {
      state.historyExamination.isLoading = "completed";
      state.historyExamination.error = "";
      state.historyExamination.data = payload;
    },
    getHistoryExaminationFailed: (state, _: PayloadAction<string>) => {
      state.historyExamination.isLoading = "pending";
      state.historyExamination.error = "";
    },

    getExaminationCardAndDetailsStart: (state, _: PayloadAction<string>) => {
      state.historyExamination.isLoading = "pending";
      state.historyExamination.error = "";
    },
    getExaminationCardAndDetailsSuccess: (
      state,
      { payload }: PayloadAction<ResponseGetExamCardAndDetails | null>
    ) => {
      state.historyExamination.isLoading = "completed";
      state.historyExamination.error = "";
      state.historyExamination.prescriptions = payload;
    },

    setSelectedPatient: (state, { payload }: PayloadAction<IPatientData | null>) => {
      state.historyExamination.selectedPatient = payload;
    },

    setToggleActions: (state, { payload: { data, open } }: PayloadAction<Actions>) => {
      state.historyExamination.actions = { data, open };
    },

    setFilter: (state, { payload }: PayloadAction<Filters>) => {
      state.filters = {
        ...payload,
      };
    },

    setDebounceSearch: (_state, _actions: PayloadAction<Filters>) => {},
  },
});

export const patientActions = patientSlice.actions;
export default patientSlice.reducer;
