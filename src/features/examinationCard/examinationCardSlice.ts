import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import dayjs, { Dayjs } from "dayjs";
import {
  ConfirmExaminationType,
  DetailPatientPayload,
  DiagnosisExaminationCardDetails,
  ExaminationCardDetailsPayload,
  ExaminationCardType,
  ExaminationCardsDetailStatus,
  ExaminationCardsDetailType,
  GetPatientForDateQuery,
  GetPatientForDateResponse,
  GetRequiredByDoctor,
  PaymentServicePayload,
  RequiredExaminationSubclinical,
} from "~/models/examinationCards.mode";
import {
  AddPrescriptionDetailsPayload,
  PrescriptionGetByExamCardIdQuery,
  PrescriptionType,
  PrescriptionsDetailType,
} from "~/models/prescriptions.model";
import { ResultsDiagnosisSubclinical } from "~/models/resultsDiagnosisSubclinical.model";
import { Filters, LoadingState, Pagination, SuccessResponseProp } from "~/types";

export type DataExaminationForDate = {
  date: Dayjs;
  data: GetPatientForDateResponse[];
  isLoading: LoadingState;
  error: string;
};

interface InitialState {
  isLoading: LoadingState;
  error: string;
  filters: Filters;
  pagination: Pagination;
  data: ExaminationCardType[];

  screensOfDoctor: {
    status: ExaminationCardsDetailStatus;

    dataRequired: ExaminationCardsDetailType[];
    dataFinished: ExaminationCardsDetailType[];
  };

  screenOfDoctorExam: {
    detailsExam: ExaminationCardsDetailType[];
    open: boolean;
    examinationCardId: string;

    selected: GetPatientForDateResponse | null;

    openPerFormSubclinical: boolean;
    selectedItem: DiagnosisExaminationCardDetails | null;

    prescriptionId: string;

    prescriptionsDetails: PrescriptionsDetailType[];
  };

  examinationForDate: DataExaminationForDate;

  prescriptions: {
    data: PrescriptionType[];
    isLoading: LoadingState;
    error: string;
    filters: Filters;
    pagination: Pagination;

    selected: PrescriptionType | null;
  };

  screenPatientList: {
    data: ExaminationCardsDetailType[];
    isLoading?: LoadingState;
    error: string;
  };
}

const initialState: InitialState = {
  isLoading: "ready",
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
  data: [],

  screensOfDoctor: {
    status: "required",
    dataFinished: [],
    dataRequired: [],
  },
  examinationForDate: {
    date: dayjs(),
    data: [],
    error: "",
    isLoading: "ready",
  },

  screenOfDoctorExam: {
    detailsExam: [],
    open: false,
    examinationCardId: "",
    selected: null,

    openPerFormSubclinical: false,
    selectedItem: null,

    prescriptionId: "",

    prescriptionsDetails: [],
  },

  prescriptions: {
    data: [],
    isLoading: "ready",
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
    selected: null,
  },

  screenPatientList: {
    data: [],
    error: "",
    isLoading: "ready",
  },
};

export type GetExaminationCardCompleted = SuccessResponseProp<ExaminationCardType[], Pagination>;

const examinationCardSlice = createSlice({
  name: "examinationCard",
  initialState,
  reducers: {
    setReset: () => {
      return initialState;
    },
    getStart: (state, _: PayloadAction<Partial<Filters>>) => {
      state.isLoading = "pending";
      state.error = "";
    },
    getCompleted: (
      state,
      { payload: { metadata, options } }: PayloadAction<GetExaminationCardCompleted>
    ) => {
      state.isLoading = "completed";
      state.error = "";
      state.data = metadata;
      state.pagination = options ?? initialState.pagination;
    },
    getFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "failed";
      state.error = payload;
    },

    setToggleExamDialog: (state, { payload }: PayloadAction<boolean>) => {
      state.screenOfDoctorExam.open = payload;
    },

    setToggleOpenPerFormSubclinical: (state, { payload }: PayloadAction<boolean>) => {
      state.screenOfDoctorExam.openPerFormSubclinical = payload;
    },

    setToggleSelectedItem: (
      state,
      { payload }: PayloadAction<DiagnosisExaminationCardDetails | null>
    ) => {
      state.screenOfDoctorExam.selectedItem = payload;
    },

    setToggleExamDialogSelected: (
      state,
      { payload }: PayloadAction<GetPatientForDateResponse | null>
    ) => {
      state.screenOfDoctorExam.selected = payload;
    },

    setToggleExamCardId: (state, { payload }: PayloadAction<string>) => {
      state.screenOfDoctorExam.examinationCardId = payload;
    },

    getDataRequiredStart: (state, _: PayloadAction<GetRequiredByDoctor>) => {
      state.isLoading = "pending";
      state.error = "";
    },
    getDataRequiredCompleted: (state, { payload }: PayloadAction<ExaminationCardsDetailType[]>) => {
      state.isLoading = "completed";
      state.error = "";
      state.screensOfDoctor.dataRequired = payload;
    },

    getDataFinishedStart: (state, _: PayloadAction<GetRequiredByDoctor>) => {
      state.isLoading = "pending";
      state.error = "";
    },
    getDataFinishedCompleted: (state, { payload }: PayloadAction<ExaminationCardsDetailType[]>) => {
      state.isLoading = "completed";
      state.error = "";
      state.screensOfDoctor.dataFinished = payload;
    },

    getDataDetailsExamStart: (state, _: PayloadAction<string>) => {
      state.isLoading = "pending";
      state.error = "";
    },
    getDataDetailsExamCompleted: (
      state,
      { payload }: PayloadAction<ExaminationCardsDetailType[]>
    ) => {
      state.isLoading = "completed";
      state.error = "";
      state.screenOfDoctorExam.detailsExam = payload;
    },

    addExaminationStart: (
      state,
      _: PayloadAction<{
        data: ExaminationCardType & { employee_id: string };
        resetForm: () => void;
      }>
    ) => {
      state.isLoading = "pending";
      state.error = "";
    },
    addExaminationCompleted: (state) => {
      state.isLoading = "completed";
      state.error = "";
    },
    confirmExaminationStart: (state, _: PayloadAction<ConfirmExaminationType>) => {
      state.isLoading = "pending";
      state.error = "";
    },
    confirmExaminationCompleted: (state) => {
      state.isLoading = "completed";
      state.error = "";
    },
    addResultsExamDetailsStart: (
      state,
      _: PayloadAction<{
        data: ResultsDiagnosisSubclinical;
        resetForm: () => void;
        examCardId: string;
      }>
    ) => {
      state.isLoading = "pending";
      state.error = "";
    },
    addResultsExamDetailsCompleted: (state) => {
      state.isLoading = "completed";
      state.error = "";
    },
    requiredExaminationSubclinicalStart: (
      state,
      _: PayloadAction<{ data: RequiredExaminationSubclinical; resetForm: () => void }>
    ) => {
      state.isLoading = "pending";
      state.error = "";
    },
    requiredExaminationSubclinicalCompleted: (
      state,
      { payload }: PayloadAction<ExaminationCardsDetailType[]>
    ) => {
      state.isLoading = "completed";
      state.error = "";
      state.screensOfDoctor.dataRequired = payload;
    },
    addExaminationFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "failed";
      state.error = payload;
    },
    addExaminationDetailStart: (
      state,
      _: PayloadAction<{ data: ExaminationCardDetailsPayload; resetForm: () => void }>
    ) => {
      state.isLoading = "pending";
      state.error = "";
    },
    getExaminationForDateStart: (state, _: PayloadAction<GetPatientForDateQuery>) => {
      state.examinationForDate.isLoading = "pending";
      state.examinationForDate.error = "";
    },
    getExaminationForDateSuccess: (
      state,
      { payload }: PayloadAction<GetPatientForDateResponse[]>
    ) => {
      state.examinationForDate.isLoading = "completed";
      state.examinationForDate.error = "";
      state.examinationForDate.data = payload;
    },
    getExaminationForDateFailed: (state, { payload }: PayloadAction<string>) => {
      state.examinationForDate.isLoading = "failed";
      state.examinationForDate.error = payload;
    },

    paymentServiceStart: (
      state,
      _: PayloadAction<{ data: PaymentServicePayload; resetForm: () => void }>
    ) => {
      state.isLoading = "pending";
      state.error = "";
    },
    infoPatient: (
      state,
      _: PayloadAction<{ data: DetailPatientPayload; resetForm: () => void }>
    ) => {
      state.isLoading = "pending";
      state.error = "";
    },

    setFilter: (state, { payload }: PayloadAction<Filters>) => {
      state.filters = {
        ...payload,
      };
    },

    setDebounceSearch: (_state, _actions: PayloadAction<Filters>) => {},

    addPrescriptionStart: (
      state,
      _: PayloadAction<{
        data: PrescriptionType;
      }>
    ) => {
      state.isLoading = "pending";
      state.error = "";
    },
    addPrescriptionCompleted: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "completed";
      state.error = "";
      state.screenOfDoctorExam.prescriptionId = payload;
    },

    addPrescriptionDetailsStart: (
      state,
      _: PayloadAction<{
        data: PrescriptionsDetailType;
        resetForm: () => void;
      }>
    ) => {
      state.isLoading = "pending";
      state.error = "";
    },
    addPrescriptionDetailsCompleted: (
      state,
      { payload }: PayloadAction<PrescriptionsDetailType[]>
    ) => {
      state.isLoading = "completed";
      state.error = "";
      state.screenOfDoctorExam.prescriptionsDetails = payload;
    },

    prescriptionGetByExamCardIdStart: (
      state,
      _: PayloadAction<PrescriptionGetByExamCardIdQuery>
    ) => {
      state.prescriptions.isLoading = "pending";
      state.prescriptions.error = "";
    },
    prescriptionGetByExamCardIdSuccess: (
      state,
      { payload }: PayloadAction<PrescriptionType | null>
    ) => {
      state.prescriptions.isLoading = "completed";
      state.prescriptions.error = "";
      state.prescriptions.selected = payload;
    },
    prescriptionGetByExamCardIdFailed: (state, { payload }: PayloadAction<string>) => {
      state.prescriptions.isLoading = "failed";
      state.prescriptions.error = payload;
    },

    prescriptionAddDetailsStart: (
      state,
      _: PayloadAction<{ data: AddPrescriptionDetailsPayload; resetForm: () => void }>
    ) => {
      state.prescriptions.isLoading = "pending";
      state.prescriptions.error = "";
    },
    prescriptionAddDetailsSuccess: (state) => {
      state.prescriptions.isLoading = "completed";
      state.prescriptions.error = "";
    },

    getExaminationCardDetailsStart: (state, _: PayloadAction<string>) => {
      state.screenPatientList.isLoading = "pending";
      state.screenPatientList.error = "";
    },
    getExaminationCardDetailsSuccess: (
      state,
      { payload }: PayloadAction<ExaminationCardsDetailType[]>
    ) => {
      state.screenPatientList.isLoading = "completed";
      state.screenPatientList.error = "";
      state.screenPatientList.data = payload;
    },
    getExaminationCardDetailsFailed: (state, { payload }: PayloadAction<string>) => {
      state.screenPatientList.isLoading = "failed";
      state.screenPatientList.error = payload;
    },
  },
});

export const examinationCardActions = examinationCardSlice.actions;
export default examinationCardSlice.reducer;
