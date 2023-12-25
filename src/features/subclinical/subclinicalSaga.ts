import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import { Filters } from "~/types";
import { AddEditPayloadSubclinical, GetSubclinicalCompleted, subclinicalActions } from ".";
import { appActions } from "../app";
import subclinicalApi from "~/services/api/subclinicalApi";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetSubclinicalCompleted = yield call(subclinicalApi.get, payload);
    yield put(subclinicalActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(subclinicalActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(subclinicalActions.getStart.type, get);
}

function* addEdit({
  payload: { type, data, resetData },
}: PayloadAction<AddEditPayloadSubclinical>) {
  try {
    let messageSuccess = "";

    const newData = {
      ...data,
      subclinical_type_id: +data.subclinical_type_id,
      price: +data.price,
      room_id: +data.room_id,
    };

    if (type === "add") {
      yield call(subclinicalApi.post, newData);
      messageSuccess = "Thêm CLS thành công.";
    } else {
      yield call(subclinicalApi.patch, newData, newData?.id!);
      messageSuccess = `Cập nhật CLS thành công.`;
    }

    yield put(subclinicalActions.addEditCompleted());
    yield call(resetData);
    yield put(subclinicalActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(subclinicalActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(subclinicalActions.addEditStart.type, addEdit);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(subclinicalApi.delete, payload);
    yield put(subclinicalActions.deleteCompleted());
    yield put(subclinicalActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        text: `Xoá CLS thành công`,
        severity: "success",
      })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(subclinicalActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(subclinicalActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(subclinicalActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, subclinicalActions.setDebounceSearch.type, searchDebounce);
}

function* subclinicalSaga() {
  yield all([watchGet(), watchAddEdit(), watchDelete(), watchSearchDebounce()]);
}

export default subclinicalSaga;
