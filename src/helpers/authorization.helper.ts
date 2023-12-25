import dayjs from "dayjs";
import { redirect } from "react-router-dom";
import { HeaderAxios, LocalStorage } from "~/constants/header";
import { authActions } from "~/features/auth";
import doctorApi from "~/services/api/doctorApi";
import employeeApi from "~/services/api/employeeApi";
import ownerApi from "~/services/api/ownerApi";
import { store } from "~/stores";
import { AccessSession, AuthRoles, DashboardPaths, FcRefreshPromise, SinglePaths } from "~/types";

/** Record<key, value> <=> object : {key: value} */
export const AccessKeys: Record<AuthRoles, string> = {
  doctor: LocalStorage.accessTokenDoctor,
  employee: LocalStorage.accessTokenEmployee,
  owner: LocalStorage.accessTokenOwner,
};

/** Record<key, value> <=> object : {key: value} */
export const AccessPaths: Record<AuthRoles, string> = {
  doctor: SinglePaths.LoginDoctor,
  employee: SinglePaths.LoginEmployee,
  owner: SinglePaths.LoginOwner,
};

export const AccessTokens: Record<AuthRoles, string> = {
  doctor: HeaderAxios.accessTokenDoctor,
  employee: HeaderAxios.accessTokenEmployee,
  owner: HeaderAxios.accessTokenOwner,
};

export const AccessRefresh: Record<AuthRoles, FcRefreshPromise> = {
  doctor: doctorApi.refreshToken,
  employee: employeeApi.refreshToken,
  owner: ownerApi.refreshToken,
};

export const RefreshTokens: Record<AuthRoles, string> = {
  doctor: "_rfd",
  employee: "_rfe",
  owner: "_rfo",
};

export const generateSession = () => dayjs().format("DDMMYYYYHHmmss");

export const getAccessSessions = () => {
  const accessSessions = localStorage.getItem(LocalStorage.accessSessions);

  if (accessSessions) {
    return JSON.parse(accessSessions) as AccessSession[];
  }

  return null;
};

export const getLastSessions = () => {
  const lastSession = localStorage.getItem(LocalStorage.lastSession);

  if (lastSession) {
    return lastSession as string;
  }

  return null;
};

export const getPathAuthLogin = (type: AuthRoles) => ({ [type]: AccessPaths[type] }[type]);

export const getPathProfile = (type: AuthRoles) => {
  return {
    doctor: doctorApi.useLastEndPoint().getProfile,
    employee: employeeApi.useLastEndPoint().getProfile,
    owner: ownerApi.useLastEndPoint().getProfile,
  }[type];
};
export const getPathLogout = (type: AuthRoles) => {
  return {
    doctor: doctorApi.useLastEndPoint().logout,
    employee: employeeApi.useLastEndPoint().logout,
    owner: ownerApi.useLastEndPoint().logout,
  }[type];
};

export type GetPathProfile = ReturnType<typeof getPathProfile>;
export type GetPathLogout = ReturnType<typeof getPathLogout>;

export const setAccessSessions = (accessSessions: AccessSession[]) =>
  localStorage.setItem(LocalStorage.accessSessions, JSON.stringify(accessSessions));

export const setLastSession = (lastSession: string) =>
  localStorage.setItem(LocalStorage.lastSession, lastSession);

export const getToken = (type: AuthRoles) =>
  ({ [type]: localStorage.getItem(AccessKeys[type]) }[type]);

export const getTwoToken = (type: AuthRoles) => {
  return {
    doctor: { employee: getToken("employee"), owner: getToken("owner") },
    employee: { doctor: getToken("doctor"), owner: getToken("owner") },
    owner: { employee: getToken("employee"), doctor: getToken("doctor") },
  }[type];
};

export type GetTwoTokenType = ReturnType<typeof getTwoToken>;

const redirectTo = {
  doctor: DashboardPaths.DoctorSchedule,
  employee: DashboardPaths.FrontDesk,
  owner: DashboardPaths.DashboardApp,
};

export const authorizationLoader = (type: AuthRoles) => {
  const token = getToken(type);
  const lastSession = getLastSessions();

  if (!token) return null;

  if (lastSession) {
    const session = handleMultipleToken(AccessPaths[type]);
    store.dispatch(authActions.setRole(type));
    store.dispatch(authActions.setSession(session));
  }

  return redirect(redirectTo[type]);
};

export const pushSession = (access: AccessSession) => {
  let accessSessions = getAccessSessions();

  if (!accessSessions) {
    accessSessions = [access];
  } else {
    accessSessions.push(access);
  }

  setAccessSessions(accessSessions);
};

/**
 * @description all args is exists
 * @param args
 * @returns
 */
export const isNotAuthentication = (...args: any[]) => args.every((e) => !e);

export const removeToken = (type: AuthRoles) => localStorage.removeItem(AccessKeys[type]);

export const getRoleFromPath = (
  path: string
): "doctor" | "employee" | "owner" | undefined | string =>
  ({
    [SinglePaths.LoginDoctor]: "doctor",
    [SinglePaths.LoginEmployee]: "employee",
    [SinglePaths.LoginOwner]: "owner",
  }[path]);

export const handleMultipleToken = (path: string) => {
  const session = generateSession();
  console.log(`handleMultipleToken session = `, session);

  let accessSessions = getAccessSessions();

  if (!accessSessions) {
    accessSessions = [{ path, session }];
    setAccessSessions(accessSessions);
    return session;
  }

  const index = accessSessions.findIndex((t) => t.path === path);

  if (index === -1) {
    accessSessions.push({ path, session });
  } else {
    accessSessions[index] = {
      ...accessSessions[index],
      session: session,
    };
  }

  setAccessSessions(accessSessions);

  return session;
};

export const getTabsOpen = () => {
  const tabsOpen = localStorage.getItem(LocalStorage.tabsOpen);

  if (!tabsOpen) return 0;

  return +tabsOpen;
};

export const setTabsOpen = (count: number) => {
  localStorage.setItem(LocalStorage.tabsOpen, `${count}`);
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("storage"));
};

export const isUnauthorizedError = (error: any) => error?.response?.status === 401;

export const dayNow = () => {
  const date = new Date();
  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
