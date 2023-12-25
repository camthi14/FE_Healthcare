import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import departmentApi from "~/services/api/departmentApi";
import { Filters } from "~/types";
import { AddEditPayloadDepartment, GetDepartmentCompleted, departmentActions } from ".";
import { appActions } from "../app";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetDepartmentCompleted = yield call(departmentApi.get, payload);
    yield put(departmentActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(departmentActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(departmentActions.getStart.type, get);
}

function* addEdit({ payload: { type, data, resetData } }: PayloadAction<AddEditPayloadDepartment>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(departmentApi.post, data);
      messageSuccess = "Thêm bộ phận thành công.";
    } else {
      yield call(departmentApi.patch, data, data?.id);
      messageSuccess = `Cập nhật bộ phận thành công.`;
    }

    yield put(departmentActions.addEditCompleted());
    yield call(resetData);
    yield put(departmentActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(departmentActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(departmentActions.addEditStart.type, addEdit);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(departmentApi.delete, payload);
    yield put(departmentActions.deleteCompleted());
    yield put(departmentActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({ open: true, text: `Xoá bộ phận thành công`, severity: "success" })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(departmentActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(departmentActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(departmentActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, departmentActions.setDebounceSearch.type, searchDebounce);
}

function* departmentSaga() {
  yield all([watchGet(), watchAddEdit(), watchDelete(), watchSearchDebounce()]);
}

export default departmentSaga;
