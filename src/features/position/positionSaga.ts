import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import positionApi from "~/services/api/positionApi";
import { Filters } from "~/types";
import { AddEditPayloadPosition, GetPositionCompleted, positionActions } from ".";
import { appActions } from "../app";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetPositionCompleted = yield call(positionApi.get, payload);
    yield put(positionActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(positionActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(positionActions.getStart.type, get);
}

function* addEdit({ payload: { type, data, resetData } }: PayloadAction<AddEditPayloadPosition>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(positionApi.post, data);
      messageSuccess = "Thêm chức vụ thành công.";
    } else {
      yield call(positionApi.patch, data, data?.id);
      messageSuccess = `Cập nhật chức vụ thành công.`;
    }

    yield put(positionActions.addEditCompleted());
    yield call(resetData);
    yield put(positionActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(positionActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(positionActions.addEditStart.type, addEdit);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(positionApi.delete, payload);
    yield put(positionActions.deleteCompleted());
    yield put(positionActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({ open: true, text: `Xoá chức vụ thành công`, severity: "success" })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(positionActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(positionActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(positionActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, positionActions.setDebounceSearch.type, searchDebounce);
}

function* positionSaga() {
  yield all([watchGet(), watchAddEdit(), watchDelete(), watchSearchDebounce()]);
}

export default positionSaga;
