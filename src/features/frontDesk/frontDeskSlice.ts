import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import dayjs, { Dayjs } from "dayjs";
import {
  BookingTypePatient,
  GetPatientForDateQuery,
  GetPatientForDateResponse,
  GetPatientInformationPatient,
  IBill,
} from "~/models";
import { ReceivePrescriptionInput } from "~/models/prescriptions.model";
import { Filters, LoadingState, Pagination, SuccessResponseProp } from "~/types";

type ConfirmType = {
  open: boolean;
  bookingId: string;
  order: number;
  displayName: string;
  typePatient: BookingTypePatient;
};

export type DetailPatient = {
  open: boolean;
  examinationCardId: string;
  bookingId: string;
};

type ServiceType = {
  open: boolean;
  examinationCardId: string;
  billId: string;
};

export type PaymentType = {
  open: boolean;
  data: GetPatientInformationPatient | null;
  isLoading: LoadingState;
  error: string;
};

export type BillType = {
  data: IBill[];
  loading: LoadingState;
  filters: Filters;
  pagination: Pagination;
  error: string;

  selected: IBill | null;
};

export type DataSelectReceive = {
  dataSelectReceive: Dayjs;
};

export type DataSelectListPatient = {
  date: Dayjs;
  data: GetPatientForDateResponse[];
  isLoading: LoadingState;
  error: string;
};

export interface InitialStateFrontDesk {
  confirm: ConfirmType;
  service: ServiceType;
  detailPatient: DetailPatient;
  payment: PaymentType;
  bill: BillType;

  dataSelectReceive: Dayjs;
  patients: DataSelectListPatient;

  dialogReceivePrescription: boolean;
  selectedPatientComplete: GetPatientForDateResponse | null;

  isLoading: LoadingState;
  error: string;
}

const initialState: InitialStateFrontDesk = {
  confirm: {
    typePatient: "new",
    open: false,
    bookingId: "",
    order: 0,
    displayName: "",
  },
  service: {
    open: false,
    examinationCardId: "",
    billId: "",
  },
  detailPatient: {
    open: false,
    examinationCardId: "",
    bookingId: "",
  },
  payment: {
    data: null,
    open: false,
    error: "",
    isLoading: "ready",
  },
  bill: {
    data: [],
    loading: "ready",

    selected: null,

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

  isLoading: "ready",
  error: "",

  dialogReceivePrescription: false,
  selectedPatientComplete: null,

  dataSelectReceive: dayjs(),

  patients: {
    date: dayjs(),
    data: [],
    error: "",
    isLoading: "ready",
  },
};

export type GetBillCompleted = SuccessResponseProp<IBill[], Pagination>;

const frontDeskSlice = createSlice({
  name: "frontDesk",
  initialState,
  reducers: {
    setToggleConfirm: (state, { payload }: PayloadAction<Partial<ConfirmType>>) => {
      state.confirm = {
        ...state.confirm,
        ...payload,
      };
    },
    setDataSelectReceive: (state, { payload }: PayloadAction<Dayjs>) => {
      state.dataSelectReceive = payload;
    },

    setToggleDialogReceivePrescription: (
      state,
      { payload }: PayloadAction<{ open: boolean; selected: GetPatientForDateResponse | null }>
    ) => {
      state.dialogReceivePrescription = payload.open;
      state.selectedPatientComplete = payload.selected;
    },

    setDataSelectListPatient: (state, { payload }: PayloadAction<Dayjs>) => {
      state.patients.date = payload;
    },
    setToggleSelectedBill: (state, { payload }: PayloadAction<IBill | null>) => {
      state.bill.selected = payload;
    },
    setToggleDetailPatient: (state, { payload }: PayloadAction<Partial<DetailPatient>>) => {
      state.detailPatient = {
        ...state.detailPatient,
        ...payload,
      };
    },
    setToggleService: (state, { payload }: PayloadAction<Partial<ServiceType>>) => {
      state.service = {
        ...state.service,
        ...payload,
      };
    },
    setTogglePayment: (state, { payload }: PayloadAction<Partial<PaymentType>>) => {
      state.payment = {
        ...state.payment,
        ...payload,
      };
    },
    getBillStart: (state, _: PayloadAction<Partial<Filters>>) => {
      state.bill.loading = "pending";
      state.bill.error = "";
    },
    getBillCompleted: (
      state,
      { payload: { metadata, options } }: PayloadAction<GetBillCompleted>
    ) => {
      state.bill.loading = "completed";
      state.bill.error = "";
      state.bill.data = metadata;
      state.bill.pagination = options ?? initialState.bill.pagination;
    },
    getBillFailed: (state, { payload }: PayloadAction<string>) => {
      state.bill.loading = "failed";
      state.bill.error = payload;
    },
    getPatientInformationPaymentStart: (state, _: PayloadAction<string>) => {
      state.payment.isLoading = "pending";
      state.payment.error = "";
    },
    getPatientInformationPaymentSuccess: (
      state,
      { payload }: PayloadAction<GetPatientInformationPatient>
    ) => {
      state.payment.isLoading = "completed";
      state.payment.error = "";
      state.payment.data = payload;
    },
    getPatientInformationPaymentFailed: (state, { payload }: PayloadAction<string>) => {
      state.payment.isLoading = "failed";
      state.payment.error = payload;
    },

    getPatientForDateStart: (state, _: PayloadAction<GetPatientForDateQuery>) => {
      state.patients.isLoading = "pending";
      state.patients.error = "";
    },
    getPatientForDateSuccess: (state, { payload }: PayloadAction<GetPatientForDateResponse[]>) => {
      state.patients.isLoading = "completed";
      state.patients.error = "";
      state.patients.data = payload;
    },
    getPatientForDateFailed: (state, { payload }: PayloadAction<string>) => {
      state.patients.isLoading = "failed";
      state.patients.error = payload;
    },

    ReceivePrescriptionStart: (state, _: PayloadAction<ReceivePrescriptionInput>) => {
      state.isLoading = "pending";
      state.error = "";
    },
    ReceivePrescriptionSuccess: (state) => {
      state.isLoading = "completed";
      state.error = "";
      state.dialogReceivePrescription = false;
      state.selectedPatientComplete = null;
    },
    ReceivePrescriptionFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "failed";
      state.error = payload;
    },

    paymentBillStart: (state, _: PayloadAction<{ billId: string; lengthIsUnPaid: number }>) => {
      state.bill.loading = "pending";
      state.bill.error = "";
    },
    paymentBillSuccess: (state) => {
      state.bill.loading = "completed";
      state.bill.error = "";
      state.bill.selected = null;
    },
  },
});

export const frontDeskActions = frontDeskSlice.actions;
export default frontDeskSlice.reducer;
