import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import unitApi from "~/services/api/unitApi";
import { Filters } from "~/types";
import { AddEditPayloadUnit, GetUnitCompleted, unitActions } from ".";
import { appActions } from "../app";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetUnitCompleted = yield call(unitApi.get, payload);
    yield put(unitActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(unitActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(unitActions.getStart.type, get);
}

function* addEdit({ payload: { type, data, resetData } }: PayloadAction<AddEditPayloadUnit>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(unitApi.post, data);
      messageSuccess = "Thêm đơn vị thành công.";
    } else {
      yield call(unitApi.patch, data, data?.id);
      messageSuccess = `Cập nhật đơn vị thành công.`;
    }

    yield put(unitActions.addEditCompleted());
    yield call(resetData);
    yield put(unitActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(unitActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(unitActions.addEditStart.type, addEdit);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(unitApi.delete, payload);
    yield put(unitActions.deleteCompleted());
    yield put(unitActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({ open: true, text: `Xoá đơn vị thành công`, severity: "success" })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(unitActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(unitActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(unitActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, unitActions.setDebounceSearch.type, searchDebounce);
}

function* unitSaga() {
  yield all([watchGet(), watchAddEdit(), watchDelete(), watchSearchDebounce()]);
}

export default unitSaga;
