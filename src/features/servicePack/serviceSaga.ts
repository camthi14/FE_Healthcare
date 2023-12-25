import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import serviceApi from "~/services/api/serviceApi";
import { Filters } from "~/types";
import { AddEditPayloadService, GetServiceCompleted, serviceActions } from ".";
import { appActions } from "../app";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetServiceCompleted = yield call(serviceApi.get, payload);
    yield put(serviceActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(serviceActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(serviceActions.getStart.type, get);
}

function* addEdit({ payload: { type, data, resetData } }: PayloadAction<AddEditPayloadService>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(serviceApi.postFormData, data);
      messageSuccess = "Thêm gói khám thành công.";
    } else {
      yield call(serviceApi.patchFormData, data, data?.id!);
      messageSuccess = `Cập nhật gói khám thành công.`;
    }

    yield put(serviceActions.addEditCompleted());
    yield call(resetData);
    yield put(serviceActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(serviceActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(serviceActions.addEditStart.type, addEdit);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(serviceApi.delete, payload);
    yield put(serviceActions.deleteCompleted());
    yield put(serviceActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        text: `Xoá gói khám thành công`,
        severity: "success",
      })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(serviceActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(serviceActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(serviceActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, serviceActions.setDebounceSearch.type, searchDebounce);
}

function* serviceSaga() {
  yield all([watchGet(), watchAddEdit(), watchDelete(), watchSearchDebounce()]);
}

export default serviceSaga;
