import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import { GetDoctorSpecialist } from "~/models";
import specialtyApi from "~/services/api/specialtyApi";
import { Filters } from "~/types";
import { AddEditPayloadSpecialty, GetSpecialtyCompleted, Queries, specialtyActions } from ".";
import { appActions } from "../app";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetSpecialtyCompleted = yield call(specialtyApi.get, payload);
    yield put(specialtyActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(specialtyActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(specialtyActions.getStart.type, get);
}

function* getDoctor({ payload }: PayloadAction<Queries>) {
  try {
    yield delay(350);
    const response: GetDoctorSpecialist[] = yield call(specialtyApi.getDoctor, payload);
    yield put(specialtyActions.getDoctorSuccess(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(specialtyActions.getDoctorFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetDoctor() {
  yield takeLatest(specialtyActions.getDoctorStart.type, getDoctor);
}

function* addEdit({ payload: { type, data, resetData } }: PayloadAction<AddEditPayloadSpecialty>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(specialtyApi.postFormData, data);
      messageSuccess = "Thêm chuyên khoa thành công.";
    } else {
      yield call(specialtyApi.patchFormData, data, data?.id!);
      messageSuccess = `Cập nhật chuyên khoa thành công.`;
    }

    yield put(specialtyActions.addEditCompleted());
    yield call(resetData);
    yield put(specialtyActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(specialtyActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(specialtyActions.addEditStart.type, addEdit);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(specialtyApi.delete, payload);
    yield put(specialtyActions.deleteCompleted());
    yield put(specialtyActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        text: `Xoá chuyên khoa thành công`,
        severity: "success",
      })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(specialtyActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(specialtyActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(specialtyActions.setFilter(payload));
}

function* searchDebounceDoctor({ payload }: PayloadAction<Queries>) {
  yield put(specialtyActions.setQuery(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, specialtyActions.setDebounceSearch.type, searchDebounce);
}

function* watchSearchDoctorDebounce() {
  yield debounce(500, specialtyActions.setDebounceSearchDoctor.type, searchDebounceDoctor);
}

function* specialtySaga() {
  yield all([
    watchGet(),
    watchAddEdit(),
    watchDelete(),
    watchSearchDebounce(),
    watchGetDoctor(),
    watchSearchDoctorDebounce(),
  ]);
}

export default specialtySaga;
