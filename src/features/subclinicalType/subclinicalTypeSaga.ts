import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import { Filters } from "~/types";
import {
  AddEditPayloadSubclinicalType,
  GetSubclinicalTypeCompleted,
  subclinicalTypeActions,
} from ".";
import { appActions } from "../app";
import subclinicalTypeApi from "~/services/api/subclinicalTypeApi";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetSubclinicalTypeCompleted = yield call(subclinicalTypeApi.get, payload);
    yield put(subclinicalTypeActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(subclinicalTypeActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(subclinicalTypeActions.getStart.type, get);
}

function* addEdit({
  payload: { type, data, resetData },
}: PayloadAction<AddEditPayloadSubclinicalType>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(subclinicalTypeApi.post, data);
      messageSuccess = "Thêm loại CLS thành công.";
    } else {
      yield call(subclinicalTypeApi.patch, data, data?.id!);
      messageSuccess = `Cập nhật loại CLS thành công.`;
    }

    yield put(subclinicalTypeActions.addEditCompleted());
    yield call(resetData);
    yield put(subclinicalTypeActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(subclinicalTypeActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(subclinicalTypeActions.addEditStart.type, addEdit);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(subclinicalTypeApi.delete, payload);
    yield put(subclinicalTypeActions.deleteCompleted());
    yield put(subclinicalTypeActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        text: `Xoá loại CLS thành công`,
        severity: "success",
      })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(subclinicalTypeActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(subclinicalTypeActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(subclinicalTypeActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, subclinicalTypeActions.setDebounceSearch.type, searchDebounce);
}

function* subclinicalTypeSaga() {
  yield all([watchGet(), watchAddEdit(), watchDelete(), watchSearchDebounce()]);
}

export default subclinicalTypeSaga;
