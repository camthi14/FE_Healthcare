import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import serviceTypeApi from "~/services/api/serviceTypeApi";
import { Filters } from "~/types";
import { AddEditPayloadServiceType, GetServiceTypeCompleted, serviceTypeActions } from ".";
import { appActions } from "../app";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetServiceTypeCompleted = yield call(serviceTypeApi.get, payload);
    yield put(serviceTypeActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(serviceTypeActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(serviceTypeActions.getStart.type, get);
}

function* addEdit({
  payload: { type, data, resetData },
}: PayloadAction<AddEditPayloadServiceType>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(serviceTypeApi.post, data);
      messageSuccess = "Thêm loại loại gói khám thành công.";
    } else {
      yield call(serviceTypeApi.patch, data, data?.id!);
      messageSuccess = `Cập nhật loại loại gói khám thành công.`;
    }

    yield put(serviceTypeActions.addEditCompleted());
    yield call(resetData);
    yield put(serviceTypeActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(serviceTypeActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(serviceTypeActions.addEditStart.type, addEdit);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(serviceTypeApi.delete, payload);
    yield put(serviceTypeActions.deleteCompleted());
    yield put(serviceTypeActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        text: `Xoá loại loại gói khám thành công`,
        severity: "success",
      })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(serviceTypeActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(serviceTypeActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(serviceTypeActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, serviceTypeActions.setDebounceSearch.type, searchDebounce);
}

function* serviceTypeSaga() {
  yield all([watchGet(), watchAddEdit(), watchDelete(), watchSearchDebounce()]);
}

export default serviceTypeSaga;
