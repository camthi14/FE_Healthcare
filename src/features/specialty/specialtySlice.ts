import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import dayjs, { Dayjs } from "dayjs";
import { GetDoctorSpecialist, ISpecialty } from "~/models";
import { Filters, LoadingState, Pagination, SuccessResponseProp } from "~/types";

export type Queries = {
  date: Dayjs;
  specialtyId?: string;
  doctorId?: string;
  doctorName?: string;
};

export type OptionsSearchDoctor = "id" | "name";

export interface InitialStateSpecialty {
  data: ISpecialty[];
  loading: LoadingState;
  filters: Filters;
  pagination: Pagination;
  errors: {
    addEdit?: string;
    get?: string;
    delete?: string;
  };

  screenSchedules: {
    isLoading: LoadingState;
    error: string;
    data: GetDoctorSpecialist[];
    queries: Queries;

    selectedSpecialty: ISpecialty | null;
    option: OptionsSearchDoctor;
  };
}

const initialState: InitialStateSpecialty = {
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

  screenSchedules: {
    isLoading: "ready",
    error: "",
    data: [],
    queries: {
      date: dayjs(),
      specialtyId: "",
      doctorId: "",
      doctorName: "",
    },
    selectedSpecialty: { name: "Tất cả", id: -1, desc: "", time_chekup_avg: "" },
    option: "name",
  },
};

export type GetSpecialtyCompleted = SuccessResponseProp<ISpecialty[], Pagination>;
export type AddEditPayloadSpecialty = {
  type: "add" | "edit";
  data: ISpecialty;
  resetData: () => void;
};

const specialtySlice = createSlice({
  name: "specialty",
  initialState,
  reducers: {
    getStart: (state, _: PayloadAction<Partial<Filters>>) => {
      state.loading = "pending";
      state.errors.get = "";
    },
    getCompleted: (
      state,
      { payload: { metadata, options } }: PayloadAction<GetSpecialtyCompleted>
    ) => {
      state.loading = "completed";
      state.errors.get = "";
      state.data = metadata;
      state.pagination = options ?? initialState.pagination;
    },
    getFailed: (state, { payload }: PayloadAction<string>) => {
      state.loading = "failed";
      state.errors.get = payload;
    },

    addEditStart: (state, _: PayloadAction<AddEditPayloadSpecialty>) => {
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

    getDoctorStart: (state, _: PayloadAction<Queries>) => {
      state.screenSchedules.isLoading = "pending";
      state.screenSchedules.error = "";
    },
    getDoctorSuccess: (state, { payload }: PayloadAction<GetDoctorSpecialist[]>) => {
      state.screenSchedules.isLoading = "completed";
      state.screenSchedules.error = "";
      state.screenSchedules.data = payload;
    },
    getDoctorFailed: (state, { payload }: PayloadAction<string>) => {
      state.screenSchedules.isLoading = "failed";
      state.screenSchedules.error = payload;
    },

    setNextDate: (state) => {
      state.screenSchedules.queries.date = state.screenSchedules.queries.date.add(1, "days");
    },

    setPrevDate: (state) => {
      state.screenSchedules.queries.date = state.screenSchedules.queries.date.subtract(1, "days");
    },

    setQuery: (state, { payload }: PayloadAction<Queries>) => {
      state.screenSchedules.queries = { ...state.screenSchedules.queries, ...payload };
    },

    setSelectedSpecialty: (state, { payload }: PayloadAction<ISpecialty | null>) => {
      state.screenSchedules.selectedSpecialty = payload;
    },

    setOptionSearchDoctor: (state, { payload }: PayloadAction<OptionsSearchDoctor>) => {
      state.screenSchedules.option = payload;
    },

    setDebounceSearchDoctor: (_state, _actions: PayloadAction<Queries>) => {},
  },
});

export const specialtyActions = specialtySlice.actions;
export default specialtySlice.reducer;
