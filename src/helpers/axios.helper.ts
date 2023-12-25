import axios from "axios";
import { HeaderAxios, env } from "~/constants";
import { authActions } from "~/features/auth";
import { store } from "~/stores";
import { ErrorCommon, FcRefreshPromise } from "~/types";
import {
  AccessKeys,
  AccessRefresh,
  AccessTokens,
  RefreshTokens,
  dayNow,
  isUnauthorizedError,
} from ".";

const rootEndPoint = "/api/v1";

export const ROUTE_REFRESH_TOKEN = {
  employee: "/Employees/RefreshToken",
  owner: "/Owners/RefreshToken",
  doctor: "/Doctors/RefreshToken",
};

const instance = axios.create({
  baseURL: env.SERVER_URL + rootEndPoint,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const {
      doctor: { accessToken: accessTokenDoctor },
      employee: { accessToken: accessTokenEmployee },
      owner: { accessToken: accessTokenOwner },
      role,
    } = store.getState().auth;

    if (role === "doctor" && accessTokenDoctor) {
      config.headers[HeaderAxios.accessTokenDoctor] = accessTokenDoctor;
    }

    if (role === "employee" && accessTokenEmployee) {
      config.headers[HeaderAxios.accessTokenEmployee] = accessTokenEmployee;
    }
    if (role === "owner" && accessTokenOwner) {
      config.headers[HeaderAxios.accessTokenOwner] = accessTokenOwner;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let refreshingFunc: FcRefreshPromise | null;

let countError = 1;

instance.interceptors.response.use(
  (response) => response.data,
  async (error: ErrorCommon) => {
    const originalConfig = error.config;
    const { role } = store.getState().auth;

    countError++;

    if (!role || !isUnauthorizedError(error) || countError >= 3) {
      countError = 0;
      return Promise.reject(error);
    }

    try {
      console.log("====================================");
      console.log(`expired path =>  ${dayNow()}`, originalConfig?.url);
      console.log("====================================");

      console.log({ countError });

      if (!refreshingFunc) {
        refreshingFunc = AccessRefresh[role];
      }

      const { accessToken, refreshToken } = await refreshingFunc();

      localStorage.setItem(AccessKeys[role], accessToken);
      store.dispatch(authActions.setAccessToken({ type: role, token: accessToken }));
      originalConfig?.headers.set(AccessTokens[role], accessToken);
      originalConfig?.headers.set(RefreshTokens[role], refreshToken);

      try {
        return await instance.request(originalConfig!);
      } catch (innerError) {
        console.log("====================================");
        console.log(`error innerError path ${originalConfig?.url} => ${dayNow()}`, innerError);
        console.log("====================================");

        if (isUnauthorizedError(innerError)) throw innerError;
      }
    } catch (errorRef) {
      countError++;
      console.log("====================================");
      console.log(`error instance path ${originalConfig?.url} => ${dayNow()}`, errorRef);
      console.log("====================================");
      store.dispatch(authActions.resetUser(role));
    } finally {
      countError = 0;
      refreshingFunc = null!;
    }
  }
);

export default instance;
