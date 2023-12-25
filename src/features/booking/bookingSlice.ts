import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import dayjs, { Dayjs } from "dayjs";
import { BookingDesktopPayload, IBooking, PatientSelect, SpecialtySelect } from "~/models";
import { Filters, LoadingState, Pagination, SuccessResponseProp } from "~/types";

export interface InitialStateBooking {
  isLoading: LoadingState;
  error: string;
  reason: string;
  patient: PatientSelect | null;
  specialty: SpecialtySelect | null;
  isReExamination: boolean;
  doctorId: string;
  dateSelected: Dayjs;
  hourId: string;
  filters: Filters;
  pagination: Pagination;
  data: IBooking[];
  order: number;
}

const initialState: InitialStateBooking = {
  isLoading: "ready",
  error: "",
  reason: "",
  isReExamination: false,
  patient: null,
  specialty: null,
  doctorId: "",
  dateSelected: dayjs(),
  hourId: "",
  order: -1,
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
};

type StepOnePayload = {
  reason: string;
  patient: PatientSelect | null;
  specialty: SpecialtySelect | null;
  isReExamination: boolean;
};

export type GetBookingCompleted = SuccessResponseProp<IBooking[], Pagination>;

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setStepOne: (state, { payload }: PayloadAction<StepOnePayload>) => {
      state.patient = payload.patient;
      state.reason = payload.reason;
      state.specialty = payload.specialty;
      state.isReExamination = payload.isReExamination;
    },
    setSelectedDoctor: (state, { payload }: PayloadAction<string>) => {
      state.doctorId = payload;
    },
    setDateSelected: (state, { payload }: PayloadAction<Dayjs>) => {
      state.dateSelected = payload;
    },
    setHourId: (state, { payload }: PayloadAction<{ hourId: string; order: number }>) => {
      state.hourId = payload.hourId;
      state.order = payload.order;
    },
    setReset: () => {
      return initialState;
    },
    getStart: (state, _: PayloadAction<Partial<Filters>>) => {
      state.isLoading = "pending";
      state.error = "";
    },
    getCompleted: (
      state,
      { payload: { metadata, options } }: PayloadAction<GetBookingCompleted>
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
    bookingDesktopStart: (state, _: PayloadAction<BookingDesktopPayload>) => {
      state.isLoading = "pending";
      state.error = "";
    },
    bookingDesktopSuccess: (state) => {
      state.isLoading = "completed";
      state.error = "";
      state.reason = "";
      state.isReExamination = false;
      state.patient = null;
      state.specialty = null;
      state.doctorId = "";
      state.dateSelected = dayjs();
      state.hourId = "";
    },
    bookingDesktopFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "failed";
      state.error = payload;
    },

    setFilter: (state, { payload }: PayloadAction<Filters>) => {
      state.filters = {
        ...payload,
      };
    },

    setDebounceSearch: (_state, _actions: PayloadAction<Filters>) => {},
  },
});

export const bookingActions = bookingSlice.actions;
export default bookingSlice.reducer;
