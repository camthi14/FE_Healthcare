import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import roomApi from "~/services/api/roomApi";
import { Filters } from "~/types";
import { AddEditPayloadRoom, GetRoomCompleted, roomActions } from ".";
import { appActions } from "../app";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetRoomCompleted = yield call(roomApi.get, payload);
    yield put(roomActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(roomActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(roomActions.getStart.type, get);
}

function* addEdit({ payload: { type, data, resetData } }: PayloadAction<AddEditPayloadRoom>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(roomApi.post, data);
      messageSuccess = "Thêm phòng thành công.";
    } else {
      yield call(roomApi.patch, data, data?.id!);
      messageSuccess = `Cập nhật phòng thành công.`;
    }

    yield put(roomActions.addEditCompleted());
    yield call(resetData);
    yield put(roomActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(roomActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(roomActions.addEditStart.type, addEdit);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(roomApi.delete, payload);
    yield put(roomActions.deleteCompleted());
    yield put(roomActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        text: `Xoá phòng thành công`,
        severity: "success",
      })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(roomActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(roomActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(roomActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, roomActions.setDebounceSearch.type, searchDebounce);
}

function* roomSaga() {
  yield all([watchGet(), watchAddEdit(), watchDelete(), watchSearchDebounce()]);
}

export default roomSaga;
