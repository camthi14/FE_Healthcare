import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import qualificationApi from "~/services/api/qualificationApi";
import { Filters } from "~/types";
import { AddEditPayloadQualification, GetQualificationCompleted, qualificationActions } from ".";
import { appActions } from "../app";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetQualificationCompleted = yield call(qualificationApi.get, payload);
    yield put(qualificationActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(qualificationActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(qualificationActions.getStart.type, get);
}

function* addEdit({
  payload: { type, data, resetData },
}: PayloadAction<AddEditPayloadQualification>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(qualificationApi.post, data);
      messageSuccess = "Thêm trình độ thành công.";
    } else {
      yield call(qualificationApi.patch, data, data?.id);
      messageSuccess = `Cập nhật trình độ thành công.`;
    }

    yield put(qualificationActions.addEditCompleted());
    yield call(resetData);
    yield put(qualificationActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(qualificationActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(qualificationActions.addEditStart.type, addEdit);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(qualificationApi.delete, payload);
    yield put(qualificationActions.deleteCompleted());
    yield put(qualificationActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({ open: true, text: `Xoá trình độ thành công`, severity: "success" })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(qualificationActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(qualificationActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(qualificationActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, qualificationActions.setDebounceSearch.type, searchDebounce);
}

function* positionSaga() {
  yield all([watchGet(), watchAddEdit(), watchDelete(), watchSearchDebounce()]);
}

export default positionSaga;
