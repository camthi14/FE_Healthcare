import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import equipmentTypeApi from "~/services/api/equipmentTypeApi";
import { Filters } from "~/types";
import { AddEditPayloadEquipmentType, GetEquipmentTypeCompleted, equipmentTypeActions } from ".";
import { appActions } from "../app";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetEquipmentTypeCompleted = yield call(equipmentTypeApi.get, payload);
    yield put(equipmentTypeActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(equipmentTypeActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(equipmentTypeActions.getStart.type, get);
}

function* addEdit({
  payload: { type, data, resetData },
}: PayloadAction<AddEditPayloadEquipmentType>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(equipmentTypeApi.post, data);
      messageSuccess = "Thêm loại thiết bị y tế thành công.";
    } else {
      yield call(equipmentTypeApi.patch, data, data?.id!);
      messageSuccess = `Cập nhật loại thiết bị y tế thành công.`;
    }

    yield put(equipmentTypeActions.addEditCompleted());
    yield call(resetData);
    yield put(equipmentTypeActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(equipmentTypeActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(equipmentTypeActions.addEditStart.type, addEdit);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(equipmentTypeApi.delete, payload);
    yield put(equipmentTypeActions.deleteCompleted());
    yield put(equipmentTypeActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        text: `Xoá loại thiết bị y tế thành công`,
        severity: "success",
      })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(equipmentTypeActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(equipmentTypeActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(equipmentTypeActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, equipmentTypeActions.setDebounceSearch.type, searchDebounce);
}

function* equipmentTypeSaga() {
  yield all([watchGet(), watchAddEdit(), watchDelete(), watchSearchDebounce()]);
}

export default equipmentTypeSaga;
