import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import equipmentApi from "~/services/api/equipmentApi";
import { Filters } from "~/types";
import { AddEditPayloadEquipment, GetEquipmentCompleted, equipmentActions } from ".";
import { appActions } from "../app";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetEquipmentCompleted = yield call(equipmentApi.get, payload);
    yield put(equipmentActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(equipmentActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(equipmentActions.getStart.type, get);
}

function* addEdit({ payload: { type, data, resetData } }: PayloadAction<AddEditPayloadEquipment>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(equipmentApi.postFormData, data);
      messageSuccess = "Thêm thiết bị y tế thành công.";
    } else {
      yield call(equipmentApi.patchFormData, data, data?.id!);
      messageSuccess = `Cập nhật thiết bị y tế thành công.`;
    }

    yield put(equipmentActions.addEditCompleted());
    yield call(resetData);
    yield put(equipmentActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(equipmentActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(equipmentActions.addEditStart.type, addEdit);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(equipmentApi.delete, payload);
    yield put(equipmentActions.deleteCompleted());
    yield put(equipmentActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        text: `Xoá thiết bị y tế thành công`,
        severity: "success",
      })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(equipmentActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(equipmentActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(equipmentActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, equipmentActions.setDebounceSearch.type, searchDebounce);
}

function* equipmentSaga() {
  yield all([watchGet(), watchAddEdit(), watchDelete(), watchSearchDebounce()]);
}

export default equipmentSaga;
