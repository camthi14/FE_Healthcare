import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, delay, getContext, put, takeLatest } from "redux-saga/effects";
import { isErrorCode } from "~/constants";
import {
  AccessPaths,
  GetPathLogout,
  GetPathProfile,
  GetTwoTokenType,
  generateSession,
  getPathAuthLogin,
  getPathLogout,
  getPathProfile,
  getTwoToken,
  isInstanceAxios,
  messageErrorSaga,
  pushSession,
} from "~/helpers";
import { RouterApp } from "~/routes";
import doctorApi from "~/services/api/doctorApi";
import employeeApi from "~/services/api/employeeApi";
import ownerApi from "~/services/api/ownerApi";
import { AuthRoles, DashboardPaths, LoginPayload, SinglePaths } from "~/types";
import { ResponseGetProfile, authActions } from ".";
import { appActions } from "../app";

function* loginOwner({ payload }: PayloadAction<LoginPayload>) {
  try {
    ownerApi.endPoint = "/Owners/login";
    yield delay(1500);
    const response: string = yield call(ownerApi.post, payload);

    const { doctor, employee }: GetTwoTokenType = yield call(getTwoToken, "owner");
    const session: string = yield call(generateSession);

    if (doctor || employee) {
      yield call(pushSession, { path: SinglePaths.LoginOwner, session });
    }

    const router: RouterApp = yield getContext("router");
    yield put(authActions.loginOwnerCompleted({ accessToken: response, session }));
    yield put(
      appActions.setSnackbar({ open: true, severity: "success", text: "Đăng nhập thành công" })
    );
    yield call(router.navigate, "/", { replace: true });
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(authActions.loginOwnerFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchLoginOwner() {
  yield takeLatest(authActions.loginOwnerStart.type, loginOwner);
}

//for Employee
function* loginEmployee({ payload }: PayloadAction<LoginPayload>) {
  try {
    employeeApi.endPoint = "/Employees/login";
    yield delay(1500);

    const response: string = yield call(employeeApi.post, payload);
    const router: RouterApp = yield getContext("router");

    const { doctor, owner }: GetTwoTokenType = yield call(getTwoToken, "employee");
    const session: string = yield call(generateSession);

    if (doctor || owner) {
      yield call(pushSession, { path: SinglePaths.LoginEmployee, session });
    }

    yield put(authActions.loginEmployeeCompleted({ accessToken: response, session }));
    yield put(
      appActions.setSnackbar({ open: true, severity: "success", text: "Đăng nhập thành công" })
    );
    yield call(router.navigate, DashboardPaths.FrontDesk, { replace: true });
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(authActions.loginEmployeeFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchLoginEmployee() {
  yield takeLatest(authActions.loginEmployeeStart.type, loginEmployee);
}

//for Doctor
function* loginDoctor({ payload }: PayloadAction<LoginPayload>) {
  try {
    doctorApi.endPoint = "/Doctors/login";
    yield delay(1500);
    const response: string = yield call(doctorApi.post, payload);
    const router: RouterApp = yield getContext("router");

    const { employee, owner }: GetTwoTokenType = yield call(getTwoToken, "doctor");
    const session: string = yield call(generateSession);

    if (employee || owner) {
      yield call(pushSession, { path: SinglePaths.LoginDoctor, session });
    }

    yield put(authActions.loginDoctorCompleted({ accessToken: response, session }));
    yield put(
      appActions.setSnackbar({ open: true, severity: "success", text: "Đăng nhập thành công" })
    );
    yield call(router.navigate, DashboardPaths.DoctorSchedule, { replace: true });
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(authActions.loginDoctorFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchLoginDoctor() {
  yield takeLatest(authActions.loginDoctorStart.type, loginDoctor);
}

function* getProfile({ payload }: PayloadAction<AuthRoles>) {
  try {
    const url: GetPathProfile = yield call(getPathProfile, payload);

    const response: ResponseGetProfile = yield call(url);

    yield put(
      authActions.getProfileCompleted({
        data: { [payload]: response },
        type: payload,
      })
    );
  } catch (error) {
    const errorAxios = isInstanceAxios(error);

    if (errorAxios) {
      const { response } = errorAxios;

      if (response?.data) {
        const {
          data: { code },
        } = response;

        if (isErrorCode(code)) {
          const router: RouterApp = yield getContext("router");
          const path: string = yield call(getPathAuthLogin, payload);

          // TODO: call backend logout
          yield put(authActions.logoutStart(payload));
          yield call(router.navigate, path, { replace: true });
        }
      }
    }

    const message = messageErrorSaga(error);
    yield put(authActions.getProfileFailed({ type: payload, message }));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetProfile() {
  yield takeLatest(authActions.getProfileStart.type, getProfile);
}
function* logout({ payload }: PayloadAction<AuthRoles>) {
  try {
    yield put(authActions.logoutCompleted());
    yield put(authActions.resetUser(payload));
    yield put(
      appActions.setSnackbar({ open: true, severity: "success", text: "Đăng xuất thành công." })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(authActions.logoutFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchLogout() {
  yield takeLatest(authActions.logoutStart.type, logout);
}

function* resetUserWithNavigation({ payload }: PayloadAction<AuthRoles>) {
  const url: GetPathLogout = yield call(getPathLogout, payload);
  yield call(url);

  const router: RouterApp = yield getContext("router");
  yield call(router.navigate, AccessPaths[payload], { replace: true });
}

function* watchResetUser() {
  yield takeLatest(authActions.resetUser.type, resetUserWithNavigation);
}

function* authSaga() {
  yield all([
    watchLoginOwner(),
    watchLoginEmployee(),
    watchLoginDoctor(),
    watchGetProfile(),
    watchLogout(),
    watchResetUser(),
  ]);
}

export default authSaga;
