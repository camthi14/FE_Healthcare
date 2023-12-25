import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { DashboardPaths, Filters } from "~/types";
import { AddEditPayloadDoctor, GetDoctorCompleted, GetPatientsCompleted, doctorActions } from ".";
import doctorApi from "~/services/api/doctorApi";
import { messageErrorSaga } from "~/helpers";
import { appActions } from "../app";
import { IHourObject } from "~/models/scheduleDoctor";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetDoctorCompleted = yield call(doctorApi.get, payload);
    yield put(doctorActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(doctorActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(doctorActions.getStart.type, get);
}

function* getPatients({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetPatientsCompleted = yield call(doctorApi.getPatients, payload);
    yield put(doctorActions.getPatientsSuccess(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(doctorActions.getPatientsFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetPatients() {
  yield takeLatest(doctorActions.getPatientsStart.type, getPatients);
}

function* getSchedule({ payload }: PayloadAction<{ doctorId: string; date: string }>) {
  try {
    yield delay(500);
    const response: IHourObject[] = yield call(doctorApi.getSchedule, payload);
    yield put(doctorActions.getScheduleSuccess(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(doctorActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetSchedule() {
  yield takeLatest(doctorActions.getScheduleStart.type, getSchedule);
}

function* addEdit({ payload: { type, data, resetData } }: PayloadAction<AddEditPayloadDoctor>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(doctorApi.postFormData, data);
      messageSuccess = "Thêm bác sĩ thành công.";
    } else {
      yield call(doctorApi.patchFormData, data, data?.id!);
      messageSuccess = `Cập nhật bác sĩ thành công.`;
    }

    yield put(doctorActions.addEditCompleted());
    yield call(resetData);
    yield put(doctorActions.getStart({ limit: 2, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
    yield put(appActions.setNavigation(DashboardPaths.Doctor));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(doctorActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(doctorActions.addEditStart.type, addEdit);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(doctorApi.delete, payload);
    yield put(doctorActions.deleteCompleted());
    yield put(doctorActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({ open: true, text: `Xoá bác sĩ thành công`, severity: "success" })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(doctorActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(doctorActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(doctorActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, doctorActions.setDebounceSearch.type, searchDebounce);
}

function* doctorSaga() {
  yield all([
    watchGet(),
    watchAddEdit(),
    watchDelete(),
    watchSearchDebounce(),
    watchGetSchedule(),
    watchGetPatients(),
  ]);
}

export default doctorSaga;
