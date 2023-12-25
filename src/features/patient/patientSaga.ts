import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, debounce, delay, put, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import {
  GetHistoryExamination,
  GetHistoryExaminationQuery,
  PatientPayloadAdd,
  PatientTypeModel,
} from "~/models";
import { ResponseGetExamCardAndDetails } from "~/models/prescriptions.model";
import patientApi from "~/services/api/patientApi";
import prescriptionApi from "~/services/api/prescriptionApi";
import { Filters } from "~/types";
import { AddEditPayloadPatient, PatientCompleted, patientActions } from ".";
import { appActions } from "../app";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: PatientCompleted = yield call(patientApi.get, payload);
    yield put(patientActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(patientActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(patientActions.getStart.type, get);
}

function* getPatientType() {
  try {
    const response: PatientTypeModel[] = yield call(patientApi.getPatientType);
    yield put(patientActions.getPatientTypeCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(patientActions.getPatientTypeFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetPatientType() {
  yield takeLatest(patientActions.getPatientTypeStart.type, getPatientType);
}

function* getPrescriptions({ payload }: PayloadAction<string>) {
  try {
    const response: ResponseGetExamCardAndDetails = yield call(
      prescriptionApi.getPrescriptionsAndDetails,
      payload
    );
    yield put(patientActions.getExaminationCardAndDetailsSuccess(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(patientActions.getHistoryExaminationFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetPrescriptions() {
  yield takeLatest(patientActions.getExaminationCardAndDetailsStart.type, getPrescriptions);
}

function* addEdit({ payload: { type, data, resetData } }: PayloadAction<AddEditPayloadPatient>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(patientApi.postFormData, data);
      messageSuccess = "Thêm chuyên khoa thành công.";
    } else {
      yield call(patientApi.patchFormData, data, data?.id!);
      messageSuccess = `Cập nhật chuyên khoa thành công.`;
    }

    yield put(patientActions.addEditCompleted());
    yield call(resetData);
    yield put(patientActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(patientActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(patientActions.addEditStart.type, addEdit);
}

function* addPatientDesktop({
  payload: { data, resetForm },
}: PayloadAction<{ data: PatientPayloadAdd; resetForm: () => void }>) {
  try {
    yield delay(350);
    yield call(patientApi.addPatientDesktop, data);
    yield put(
      appActions.setSnackbar({ open: true, text: "Thêm bệnh nhân thành công", severity: "success" })
    );
    yield put(patientActions.addPatientDesktopCompleted());
    yield put(patientActions.getStart({ limit: 100, page: 1 }));
    yield call(resetForm);
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(patientActions.addPatientDesktopFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddPatientDesktop() {
  yield takeLatest(patientActions.addPatientDesktopStart.type, addPatientDesktop);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(patientApi.delete, payload);
    yield put(patientActions.deleteCompleted());
    yield put(patientActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        text: `Xoá chuyên khoa thành công`,
        severity: "success",
      })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(patientActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* getHistoryExamination({ payload }: PayloadAction<GetHistoryExaminationQuery>) {
  try {
    yield delay(500);
    const response: GetHistoryExamination[] = yield call(
      patientApi.getHistoryExaminationCard,
      payload
    );

    yield put(patientActions.getHistoryExaminationSuccess(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(patientActions.getHistoryExaminationFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetHistoryExamination() {
  yield takeLatest(patientActions.getHistoryExaminationStart.type, getHistoryExamination);
}

function* watchDelete() {
  yield takeLatest(patientActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(patientActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, patientActions.setDebounceSearch.type, searchDebounce);
}

function* patientSaga() {
  yield all([
    watchGet(),
    watchAddEdit(),
    watchDelete(),
    watchSearchDebounce(),
    watchGetPatientType(),
    watchAddPatientDesktop(),
    watchGetHistoryExamination(),
    watchGetPrescriptions(),
  ]);
}

export default patientSaga;
