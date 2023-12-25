import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { DashboardPaths, Filters } from "~/types";
import { AddEditPayloadEmployee, GetEmployeeCompleted, employeeActions } from ".";
import employeeApi from "~/services/api/employeeApi";
import { messageErrorSaga } from "~/helpers";
import { appActions } from "../app";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetEmployeeCompleted = yield call(employeeApi.get, payload);
    yield put(employeeActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(employeeActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(employeeActions.getStart.type, get);
}

function* addEdit({ payload: { type, data, resetData } }: PayloadAction<AddEditPayloadEmployee>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(employeeApi.postFormData, data);
      messageSuccess = "Thêm nhân viên thành công.";
    } else {
      yield call(employeeApi.patchFormData, data, data?.id!);
      messageSuccess = `Cập nhật nhân viên thành công.`;
    }

    yield put(employeeActions.addEditCompleted());
    yield call(resetData);
    yield put(employeeActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
    yield put(appActions.setNavigation(DashboardPaths.Employee));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(employeeActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(employeeActions.addEditStart.type, addEdit);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(employeeApi.delete, payload);
    yield put(employeeActions.deleteCompleted());
    yield put(employeeActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({ open: true, text: `Xoá nhân viên thành công`, severity: "success" })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(employeeActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(employeeActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(employeeActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, employeeActions.setDebounceSearch.type, searchDebounce);
}

function* employeeSaga() {
  yield all([watchGet(), watchAddEdit(), watchDelete(), watchSearchDebounce()]);
}

export default employeeSaga;
