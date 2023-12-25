import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, delay, put, select, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import {
  ConfirmExaminationType,
  ExaminationCardDetailsPayload,
  ExaminationCardType,
  ExaminationCardsDetailType,
  GetPatientForDateQuery,
  GetPatientForDateResponse,
  GetRequiredByDoctor,
  PaymentServicePayload,
  RequiredExaminationSubclinical,
} from "~/models";
import examinationCardsApi from "~/services/api/examinationCardsApi";
import { DashboardPaths, Filters, SuccessResponseProp } from "~/types";
import { GetExaminationCardCompleted, examinationCardActions } from ".";
import { appActions } from "../app";
import { InitialStateFrontDesk, frontDeskActions } from "../frontDesk";
import { InitialStateBooking, bookingActions } from "../booking";
import { InitialStateDoctorSlice, doctorActions } from "../doctor";
import { ResultsDiagnosisSubclinical } from "~/models/resultsDiagnosisSubclinical.model";
import resultsDiagnosisSubclinical from "~/services/api/resultsDiagnosisSubclinical";
import {
  AddPrescriptionDetailsPayload,
  PrescriptionGetByExamCardIdQuery,
  PrescriptionType,
} from "~/models/prescriptions.model";
import prescriptionModel from "~/services/api/prescriptionApi";
import prescriptionApi from "~/services/api/prescriptionApi";
import examinationCardsDetailsApi from "~/services/api/examinationCardsDetailsApi";
import { patientActions } from "../patient";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetExaminationCardCompleted = yield call(examinationCardsApi.get, payload);
    yield put(examinationCardActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(examinationCardActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(examinationCardActions.getStart.type, get);
}

function* getDataRequired({ payload }: PayloadAction<GetRequiredByDoctor>) {
  try {
    yield delay(500);
    const response: ExaminationCardsDetailType[] = yield call(
      examinationCardsApi.getRequiredByDoctor,
      payload
    );
    yield put(examinationCardActions.getDataRequiredCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(examinationCardActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetDataRequiredStart() {
  yield takeLatest(examinationCardActions.getDataRequiredStart.type, getDataRequired);
}

function* getDataFinished({ payload }: PayloadAction<GetRequiredByDoctor>) {
  try {
    yield delay(500);
    const response: ExaminationCardsDetailType[] = yield call(
      examinationCardsApi.getRequiredByDoctor,
      payload
    );
    yield put(examinationCardActions.getDataFinishedCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(examinationCardActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetDataFinishedStart() {
  yield takeLatest(examinationCardActions.getDataFinishedStart.type, getDataFinished);
}

function* addEdit({
  payload: { data, resetForm },
}: PayloadAction<{ data: ExaminationCardType & { employee_id: string }; resetForm: () => void }>) {
  try {
    const { billId, examinationId }: { examinationId: string; billId: string } = yield call(
      examinationCardsApi.post,
      data
    );

    yield delay(350);

    yield call(resetForm);

    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Xác nhận bệnh nhân thành công.",
      })
    );

    yield put(frontDeskActions.setToggleConfirm({ open: false }));
    yield put(examinationCardActions.addExaminationCompleted());

    if (!data.is_use_service) {
      yield put(frontDeskActions.setToggleConfirm({ bookingId: data.booking_id }));
      yield put(frontDeskActions.setTogglePayment({ open: true }));
      return;
    }

    yield put(
      frontDeskActions.setToggleService({ examinationCardId: examinationId, billId, open: true })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(examinationCardActions.addExaminationFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(examinationCardActions.addExaminationStart.type, addEdit);
}

function* confirmExamination({ payload }: PayloadAction<ConfirmExaminationType>) {
  try {
    yield delay(350);

    yield call(examinationCardsApi.confirmExamination, payload);

    const {
      screenExamination: { selectedExaminationId },
    }: InitialStateDoctorSlice = yield select((state) => state.doctor);

    const {
      patients: { data },
    }: InitialStateFrontDesk = yield select((state) => state.frontDesk);

    const patient = data.find((r) => r.examinationData.id === selectedExaminationId);

    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Xác nhận tiếp nhận bệnh nhân thành công.",
      })
    );

    yield put(doctorActions.setStatus("examination"));

    yield put(doctorActions.setSelectedPatientActive(patient!));

    yield put(doctorActions.setToggleConfirmExamination(false));

    yield put(examinationCardActions.confirmExaminationCompleted());
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(examinationCardActions.addExaminationFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
    yield put(doctorActions.setSelectedPatientActive(null));
    yield put(doctorActions.setToggleConfirmExamination(false));
    yield put(doctorActions.setSelectedExaminationId(""));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchConfirmExamination() {
  yield takeLatest(examinationCardActions.confirmExaminationStart.type, confirmExamination);
}

function* requiredExaminationSubclinical({
  payload,
}: PayloadAction<{ data: RequiredExaminationSubclinical; resetForm: () => void }>) {
  try {
    yield delay(350);

    const response: ExaminationCardsDetailType[] = yield call(
      examinationCardsApi.requiredExaminationSubclinical,
      payload.data
    );

    yield call(payload.resetForm);

    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Tạo chỉ định CLS thành công.",
      })
    );

    yield put(examinationCardActions.requiredExaminationSubclinicalCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(examinationCardActions.addExaminationFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchRequiredExaminationSubclinical() {
  yield takeLatest(
    examinationCardActions.requiredExaminationSubclinicalStart.type,
    requiredExaminationSubclinical
  );
}

function* addResultsExamDetails({
  payload,
}: PayloadAction<{
  data: ResultsDiagnosisSubclinical;
  resetForm: () => void;
  examCardId: string;
}>) {
  try {
    yield delay(350);

    yield call(resultsDiagnosisSubclinical.postForm, payload.data);

    yield put(examinationCardActions.getDataDetailsExamStart(payload.examCardId));

    yield call(payload.resetForm);

    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Cập nhật kết quả thành công",
      })
    );

    yield put(examinationCardActions.setToggleOpenPerFormSubclinical(false));
    yield put(examinationCardActions.setToggleSelectedItem(null));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(examinationCardActions.addExaminationFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddResultsExamDetails() {
  yield takeLatest(examinationCardActions.addResultsExamDetailsStart.type, addResultsExamDetails);
}

function* addPrescription({
  payload,
}: PayloadAction<{
  data: PrescriptionType;
}>) {
  try {
    yield delay(350);

    const response: string = yield call(prescriptionModel.post, payload.data);

    yield put(examinationCardActions.addPrescriptionCompleted(response));

    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Lưu thành công",
      })
    );

    yield put(appActions.setNavigation(DashboardPaths.CheckHealthy + "?tab=prescribe-medicine"));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(examinationCardActions.addExaminationFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddPrescription() {
  yield takeLatest(examinationCardActions.addPrescriptionStart.type, addPrescription);
}

function* addDetails({
  payload: { data, resetForm },
}: PayloadAction<{ data: ExaminationCardDetailsPayload; resetForm: () => void }>) {
  try {
    examinationCardsApi.endPoint = "/ExaminationCards/AddServiceConfirm";

    yield call(examinationCardsApi.post, data);

    examinationCardsApi.useLastEndPoint();

    yield delay(350);

    yield call(resetForm);

    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Thêm dịch vụ thành công.",
      })
    );

    yield put(frontDeskActions.setToggleService({ open: false }));
    yield put(frontDeskActions.setTogglePayment({ open: true }));
    yield put(examinationCardActions.addExaminationCompleted());
    yield put(patientActions.getExaminationCardAndDetailsSuccess(null));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(examinationCardActions.addExaminationFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddDetails() {
  yield takeLatest(examinationCardActions.addExaminationDetailStart.type, addDetails);
}

function* paymentService({
  payload: { data, resetForm },
}: PayloadAction<{ data: PaymentServicePayload; resetForm: () => void }>) {
  try {
    yield delay(350);
    yield call(examinationCardsApi.paymentService, data);
    yield call(resetForm);
    yield put(
      appActions.setSnackbar({
        open: true,
        severity: "success",
        text: "Thanh toán thành công.",
      })
    );

    yield put(frontDeskActions.setToggleConfirm({ bookingId: "", displayName: "", order: 0 }));
    yield put(
      frontDeskActions.setTogglePayment({ data: null, error: "", isLoading: "ready", open: false })
    );

    const state: InitialStateBooking = yield select((state) => state.booking);

    yield put(
      bookingActions.getStart({
        date: state.dateSelected?.format("YYYY-MM-DD")!,
        limit: 100,
        page: 1,
      })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(examinationCardActions.addExaminationFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchPaymentService() {
  yield takeLatest(examinationCardActions.paymentServiceStart.type, paymentService);
}

function* getExaminationForDate({ payload }: PayloadAction<GetPatientForDateQuery>) {
  try {
    yield delay(500);
    const response: GetPatientForDateResponse[] = yield call(
      examinationCardsApi.getExaminationForDate,
      payload
    );

    yield put(examinationCardActions.getExaminationForDateSuccess(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(examinationCardActions.getExaminationForDateFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetExaminationForDate() {
  yield takeLatest(examinationCardActions.getExaminationForDateStart.type, getExaminationForDate);
}

function* getDataDetailsExam({ payload }: PayloadAction<string>) {
  try {
    yield delay(500);
    const response: ExaminationCardsDetailType[] = yield call(
      examinationCardsApi.getExaminationCardDetails,
      payload
    );

    yield put(examinationCardActions.getDataDetailsExamCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(examinationCardActions.getExaminationForDateFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetDataDetailsExam() {
  yield takeLatest(examinationCardActions.getDataDetailsExamStart.type, getDataDetailsExam);
}

function* prescriptionGetByExamCardId({
  payload,
}: PayloadAction<PrescriptionGetByExamCardIdQuery>) {
  try {
    yield delay(350);
    const response: PrescriptionType | null = yield call(prescriptionApi.getByExamCardId, payload);
    yield put(examinationCardActions.prescriptionGetByExamCardIdSuccess(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(examinationCardActions.prescriptionGetByExamCardIdFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchPrescriptionGetByExamCardId() {
  yield takeLatest(
    examinationCardActions.prescriptionGetByExamCardIdStart.type,
    prescriptionGetByExamCardId
  );
}

function* prescriptionAddDetails({
  payload,
}: PayloadAction<{
  data: AddPrescriptionDetailsPayload;
  resetForm: (...args: any[]) => void;
}>) {
  try {
    yield delay(350);
    yield call(prescriptionApi.addPrescriptionDetails, payload.data);
    yield put(examinationCardActions.prescriptionAddDetailsSuccess());
    yield put(
      appActions.setSnackbar({
        open: true,
        text: "Lưu toa thuốc thành công. Hoàn thành khám.",
        severity: "success",
      })
    );
    yield put(doctorActions.setStatus("complete"));
    yield put(doctorActions.setStatusBooking("completed"));
    yield call(payload.resetForm, {
      values: { medicines: [], doctorId: "", examCardId: "", quantityReExam: 7 },
    });
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(examinationCardActions.prescriptionGetByExamCardIdFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchPrescriptionAddDetails() {
  yield takeLatest(examinationCardActions.prescriptionAddDetailsStart.type, prescriptionAddDetails);
}

function* getExaminationCardDetailsForExamCardId({ payload }: PayloadAction<string>) {
  try {
    yield delay(350);
    const response: SuccessResponseProp<ExaminationCardsDetailType[]> = yield call(
      examinationCardsDetailsApi.get,
      {
        limit: 9999,
        examination_card_id: payload,
      }
    );
    yield put(examinationCardActions.getExaminationCardDetailsSuccess(response.metadata));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(examinationCardActions.getExaminationCardDetailsFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetExaminationCardDetailsForExamCardId() {
  yield takeLatest(
    examinationCardActions.getExaminationCardDetailsStart.type,
    getExaminationCardDetailsForExamCardId
  );
}

function* examinationCardSaga() {
  yield all([
    watchGet(),
    watchAddEdit(),
    watchAddDetails(),
    watchPaymentService(),
    watchConfirmExamination(),
    watchGetDataRequiredStart(),
    watchGetDataFinishedStart(),
    watchRequiredExaminationSubclinical(),
    watchGetExaminationForDate(),
    watchGetDataDetailsExam(),
    watchAddResultsExamDetails(),
    watchAddPrescription(),
    watchPrescriptionGetByExamCardId(),
    watchPrescriptionAddDetails(),
    watchGetExaminationCardDetailsForExamCardId(),
  ]);
}

export default examinationCardSaga;
