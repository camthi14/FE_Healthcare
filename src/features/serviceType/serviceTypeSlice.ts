import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IServiceType } from "~/models";
import { Filters, LoadingState, Pagination, SuccessResponseProp } from "~/types";

interface InitialState {
  data: IServiceType[];
  loading: LoadingState;
  filters: Filters;
  pagination: Pagination;
  errors: {
    addEdit?: string;
    get?: string;
    delete?: string;
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
};

export type GetServiceTypeCompleted = SuccessResponseProp<IServiceType[], Pagination>;
export type AddEditPayloadServiceType = {
  type: "add" | "edit";
  data: IServiceType;
  resetData: () => void;
};

const serviceTypeSlice = createSlice({
  name: "serviceType",
  initialState,
  reducers: {
    getStart: (state, _: PayloadAction<Partial<Filters>>) => {
      state.loading = "pending";
      state.errors.get = "";
    },
    getCompleted: (
      state,
      { payload: { metadata, options } }: PayloadAction<GetServiceTypeCompleted>
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

    addEditStart: (state, _: PayloadAction<AddEditPayloadServiceType>) => {
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
  },
});

export const serviceTypeActions = serviceTypeSlice.actions;
export default serviceTypeSlice.reducer;
