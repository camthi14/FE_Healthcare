import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, delay, getContext, put, takeLatest } from "redux-saga/effects";
import { RouterApp } from "~/routes";
import { appActions } from ".";
import { ReportDashboardState } from "~/models/report.model";
import reportApi from "~/services/api/reportApi";
import { messageErrorSaga } from "~/helpers";

function* navigationSaga({ payload }: PayloadAction<string>) {
  const router: RouterApp = yield getContext("router");
  yield call(router.navigate, payload, { replace: true });
}

function* watchNavigation() {
  yield takeLatest(appActions.setNavigation.type, navigationSaga);
}

function* getReportDashboard() {
  try {
    yield delay(500);
    const response: ReportDashboardState = yield call(reportApi.dashboard);
    yield put(appActions.getReportDashboardSuccess(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(appActions.getReportDashboardFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetReportDashboard() {
  yield takeLatest(appActions.getReportDashboardStart.type, getReportDashboard);
}

function* appSaga() {
  yield all([watchNavigation(), watchGetReportDashboard()]);
}

export default appSaga;
