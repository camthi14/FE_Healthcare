import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import medicineApi from "~/services/api/medicineApi";
import { Filters } from "~/types";
import { AddEditPayloadMedicine, GetMedicineCompleted, medicineActions } from ".";
import { appActions } from "../app";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetMedicineCompleted = yield call(medicineApi.get, payload);
    yield put(medicineActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(medicineActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(medicineActions.getStart.type, get);
}

function* addEdit({ payload: { type, data, resetData } }: PayloadAction<AddEditPayloadMedicine>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(medicineApi.post, {
        ...data,
        drug_concentration: +data.drug_concentration,
        price: +data.price,
        price_sell: +data.price_sell,
        quantity: +data.quantity,
      });
      messageSuccess = "Thêm thuốc thành công.";
    } else {
      yield call(
        medicineApi.patch,
        {
          ...data,
          medictine_type_id: +data.medictine_type_id,
          unit_id: +data.unit_id,
          drug_concentration: +data.drug_concentration,
          price: +data.price,
          price_sell: +data.price_sell,
          quantity: +data.quantity,
        },
        data?.id!
      );
      messageSuccess = `Cập nhật thuốc thành công.`;
    }

    yield put(medicineActions.addEditCompleted());
    yield call(resetData);
    yield put(medicineActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(medicineActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(medicineActions.addEditStart.type, addEdit);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(medicineApi.delete, payload);
    yield put(medicineActions.deleteCompleted());
    yield put(medicineActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        text: `Xoá thuốc thành công`,
        severity: "success",
      })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(medicineActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(medicineActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(medicineActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, medicineActions.setDebounceSearch.type, searchDebounce);
}

function* medicineSaga() {
  yield all([watchGet(), watchAddEdit(), watchDelete(), watchSearchDebounce()]);
}

export default medicineSaga;
