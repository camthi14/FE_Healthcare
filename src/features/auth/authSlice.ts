import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LocalStorage } from "~/constants/header";
import { removeToken } from "~/helpers";
import { IDoctorAuth, IEmployeeAuth, IOwnerAuth } from "~/models";
import { AuthRoles, LoadingState, LoginPayload } from "~/types";

interface AuthState<UserData> {
  user: UserData | null;
  accessToken: string | null;
}

interface AuthSliceState {
  isLoading: LoadingState;
  role: AuthRoles | null;
  session: string;
  doctor: AuthState<IDoctorAuth>;
  employee: AuthState<IEmployeeAuth>;
  owner: AuthState<IOwnerAuth>;
  error: string;
}

export type ResponseGetProfile = IEmployeeAuth | IDoctorAuth | IOwnerAuth;

type GetProfileCompletePayload = Partial<Record<AuthRoles, ResponseGetProfile>>;

const initialState: AuthSliceState = {
  doctor: {
    accessToken: localStorage.getItem(LocalStorage.accessTokenDoctor)?.toString() ?? null,
    user: null,
  },
  employee: {
    accessToken: localStorage.getItem(LocalStorage.accessTokenEmployee)?.toString() ?? null,
    user: null,
  },
  owner: {
    accessToken: localStorage.getItem(LocalStorage.accessTokenOwner)?.toString() ?? null,
    user: null,
  },

  isLoading: "ready",
  role: null,
  session: "",
  error: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // --------- LOGIN OWNER BEGIN ---------
    loginOwnerStart: (state, _action: PayloadAction<LoginPayload>) => {
      state.isLoading = "pending";
    },

    loginOwnerCompleted: (
      state,
      { payload: { accessToken, session } }: PayloadAction<{ accessToken: string; session: string }>
    ) => {
      state.isLoading = "completed";
      state.owner.accessToken = accessToken;
      state.role = "owner";
      localStorage.setItem(LocalStorage.accessTokenOwner, accessToken);
      state.session = session;
      state.error = "";
    },

    loginOwnerFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "failed";
      state.error = payload;
    },
    // --------- LOGIN OWNER END ---------

    // --------- LOGIN EMPLOYEE BEGIN ---------
    loginEmployeeStart: (state, _action: PayloadAction<LoginPayload>) => {
      state.isLoading = "pending";
    },

    loginEmployeeCompleted: (
      state,
      { payload: { accessToken, session } }: PayloadAction<{ accessToken: string; session: string }>
    ) => {
      state.isLoading = "completed";
      state.employee!.accessToken = accessToken;
      state.role = "employee";
      localStorage.setItem(LocalStorage.accessTokenEmployee, accessToken);
      state.session = session;
      state.error = "";
    },

    loginEmployeeFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "failed";
      state.error = payload;
    },

    // --------- LOGIN EMPLOYEE END ---------

    // --------- LOGIN DOCTOR BEGIN ---------
    loginDoctorStart: (state, _action: PayloadAction<LoginPayload>) => {
      state.isLoading = "pending";
    },

    loginDoctorCompleted: (
      state,
      { payload: { accessToken, session } }: PayloadAction<{ accessToken: string; session: string }>
    ) => {
      state.isLoading = "completed";
      state.doctor!.accessToken = accessToken;
      state.role = "doctor";
      localStorage.setItem(LocalStorage.accessTokenDoctor, accessToken);
      state.session = session;
      state.error = "";
    },

    loginDoctorFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "failed";
      state.error = payload;
    },
    // --------- LOGIN DOCTOR END ---------

    // --------- GET PROFILE START ---------
    getProfileStart: (state, _: PayloadAction<AuthRoles>) => {
      state.isLoading = "pending";
    },
    getProfileCompleted: (
      state,
      {
        payload: { type, data },
      }: PayloadAction<{ type: AuthRoles; data: GetProfileCompletePayload }>
    ) => {
      state.isLoading = "completed";
      state[type]!.user = data[type]!;
    },
    getProfileFailed: (
      state,
      { payload: { message } }: PayloadAction<{ type: AuthRoles; message: string }>
    ) => {
      state.isLoading = "failed";
      state.error = message;
    },
    // --------- GET PROFILE END ---------

    setRole: (state, { payload }: PayloadAction<AuthRoles>) => {
      state.role = payload;
    },

    resetUser: (state, { payload }: PayloadAction<AuthRoles>) => {
      removeToken(payload);

      state = {
        ...state,
        ...initialState,
      };
    },

    setSession: (state, { payload }: PayloadAction<string>) => {
      state.session = payload;
    },

    setIsEmptyError: (state) => {
      state.error = "";
    },

    setAccessToken: (
      state,
      { payload: { type, token } }: PayloadAction<{ type: AuthRoles; token: string }>
    ) => {
      state[type].accessToken = token;
    },

    logoutStart: (state, _: PayloadAction<AuthRoles>) => {
      state.isLoading = "pending";
    },
    logoutCompleted: (state) => {
      state.isLoading = "completed";
    },
    logoutFailed: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = "failed";
      state.error = payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
