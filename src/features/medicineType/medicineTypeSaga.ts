import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import medicineTypeApi from "~/services/api/medicineTypeApi";
import { Filters } from "~/types";
import { AddEditPayloadMedicineType, GetMedicineTypeCompleted, medicineTypeActions } from ".";
import { appActions } from "../app";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetMedicineTypeCompleted = yield call(medicineTypeApi.get, payload);
    yield put(medicineTypeActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(medicineTypeActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(medicineTypeActions.getStart.type, get);
}

function* addEdit({
  payload: { type, data, resetData },
}: PayloadAction<AddEditPayloadMedicineType>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(medicineTypeApi.post, data);
      messageSuccess = "Thêm loại thuốc thành công.";
    } else {
      yield call(medicineTypeApi.patch, data, data?.id!);
      messageSuccess = `Cập nhật loại thuốc thành công.`;
    }

    yield put(medicineTypeActions.addEditCompleted());
    yield call(resetData);
    yield put(medicineTypeActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(medicineTypeActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(medicineTypeActions.addEditStart.type, addEdit);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(medicineTypeApi.delete, payload);
    yield put(medicineTypeActions.deleteCompleted());
    yield put(medicineTypeActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        text: `Xoá loại thuốc thành công`,
        severity: "success",
      })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(medicineTypeActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(medicineTypeActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(medicineTypeActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, medicineTypeActions.setDebounceSearch.type, searchDebounce);
}

function* medicineSaga() {
  yield all([watchGet(), watchAddEdit(), watchDelete(), watchSearchDebounce()]);
}

export default medicineSaga;
