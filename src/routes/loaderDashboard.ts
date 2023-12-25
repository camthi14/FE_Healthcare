import { redirect } from "react-router-dom";
import { appActions } from "~/features/app";
import { authActions } from "~/features/auth";
import {
  generateSession,
  getAccessSessions,
  getLastSessions,
  getRoleFromPath,
  getTabsOpen,
  handleMultipleToken,
  isNotAuthentication,
  setTabsOpen,
} from "~/helpers";
import { store } from "~/stores";
import { AuthRoles, SinglePaths } from "~/types";

export const loaderDashboard = () => {
  const {
    doctor: { accessToken: accessTokenDoctor },
    employee: { accessToken: accessTokenEmployee },
    owner: { accessToken: accessTokenOwner },
    session: sessionStore,
    role,
  } = store.getState().auth;

  const isNotAuth = isNotAuthentication(accessTokenDoctor, accessTokenEmployee, accessTokenOwner);

  if (isNotAuth) return redirect(SinglePaths.LoginEmployee);

  // set tabsOpen
  let tabsOpen = getTabsOpen();

  if (tabsOpen === 0) {
    tabsOpen = 1;
    setTabsOpen(1);
  } else {
    tabsOpen += 1;
    setTabsOpen(tabsOpen);
  }

  store.dispatch(appActions.setCurrentTab(tabsOpen));

  /** use case: login */
  if ((accessTokenDoctor || accessTokenEmployee || accessTokenOwner) && sessionStore && role) {
    console.log(`/** use case: login */`);
    store.dispatch(authActions.getProfileStart(role));
    return role;
  }

  const newSession = generateSession();
  let accessSessions = getAccessSessions();
  const lastSession = getLastSessions();

  /** use case: refresh page or close tab or close browser. But one token */
  if (!lastSession && !accessSessions) {
    console.log(`/** use case: refresh page or close tab or close browser. But one token */`);
    store.dispatch(authActions.setSession(newSession));

    let _roles: AuthRoles = "doctor";

    if (accessTokenEmployee) {
      _roles = "employee";
    }

    if (accessTokenOwner) {
      _roles = "owner";
    }

    store.dispatch(authActions.setRole(_roles));
    store.dispatch(authActions.getProfileStart(_roles));
    return _roles;
  }

  /** use case: refresh page or close tab or close browser. But multiple token */
  console.log(`/** use case: refresh page or close tab or close browser. But multiple token */`);

  const sessionOld = accessSessions?.find((t) => t.session === lastSession);

  if (!sessionOld) {
    accessSessions = accessSessions?.sort((a, b) => +b.session - +a.session) ?? [];
    const maxSession = accessSessions[0];
    const getRole = getRoleFromPath(maxSession.path);

    const sessionHandle = handleMultipleToken(maxSession.path);
    store.dispatch(authActions.setRole(getRole as any));
    store.dispatch(authActions.getProfileStart(getRole as any));
    store.dispatch(authActions.setSession(sessionHandle));
    console.log(`can not found sessionOld => maxSession `, maxSession);
    return getRole as AuthRoles;
  }

  console.log(`sessionOld`, { lastSession, sessionOld, accessSessions });

  const getRole = getRoleFromPath(sessionOld.path);

  console.log(`getRole`, getRole);
  const sessionHandle = handleMultipleToken(sessionOld.path);
  store.dispatch(authActions.setRole(getRole as any));
  store.dispatch(authActions.getProfileStart(getRole as any));
  store.dispatch(authActions.setSession(sessionHandle));
  return getRole as AuthRoles;
};
