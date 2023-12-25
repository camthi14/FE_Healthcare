import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, delay, put, select, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import {
  GetPatientForDateQuery,
  GetPatientForDateResponse,
  GetPatientInformationPatient,
} from "~/models";
import { ReceivePrescriptionInput } from "~/models/prescriptions.model";
import billApi from "~/services/api/billApi";
import examinationCardsApi from "~/services/api/examinationCardsApi";
import prescriptionApi from "~/services/api/prescriptionApi";
import { Filters } from "~/types";
import { GetBillCompleted, InitialStateFrontDesk, frontDeskActions } from ".";
import { appActions } from "../app";
import { doctorActions } from "../doctor";
import { patientActions } from "../patient";
import dayjs from "dayjs";
import { bookingActions } from "../booking";

function* getInformationPaymentByPatient({ payload }: PayloadAction<string>) {
  try {
    yield delay(500);
    const response: GetPatientInformationPatient = yield call(
      examinationCardsApi.getPatientInformation,
      payload
    );
    yield put(frontDeskActions.getPatientInformationPaymentSuccess(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(frontDeskActions.getPatientInformationPaymentFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetInformationPaymentByPatient() {
  yield takeLatest(
    frontDeskActions.getPatientInformationPaymentStart.type,
    getInformationPaymentByPatient
  );
}

function* ReceivePrescriptionStart({ payload }: PayloadAction<ReceivePrescriptionInput>) {
  try {
    yield delay(500);
    yield call(prescriptionApi.receivePrescription, payload);
    yield put(
      appActions.setSnackbar({ open: true, text: "Nhận thuốc thành công", severity: "success" })
    );
    yield put(frontDeskActions.ReceivePrescriptionSuccess());
    yield put(patientActions.getExaminationCardAndDetailsSuccess(null));

    const { patients }: InitialStateFrontDesk = yield select((state) => state.frontDesk);

    yield put(
      frontDeskActions.getPatientForDateStart({
        bookingStatus: "completed",
        date: patients.date.format("YYYY-MM-DD"),
        examinationStatus: "complete",
      })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(frontDeskActions.ReceivePrescriptionFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchReceivePrescriptionStart() {
  yield takeLatest(frontDeskActions.ReceivePrescriptionStart.type, ReceivePrescriptionStart);
}

function* getPatientForDate({ payload }: PayloadAction<GetPatientForDateQuery>) {
  try {
    yield delay(500);
    const response: GetPatientForDateResponse[] = yield call(
      examinationCardsApi.getPatientForDate,
      payload
    );

    yield put(frontDeskActions.getPatientForDateSuccess(response));

    const length = response.length;

    if (payload.examinationStatus === "examination" && length) {
      if (length === 1) {
        const data = response[0];
        yield put(doctorActions.setSelectedExaminationId(data.examinationData.id!));
        yield put(doctorActions.setSelectedPatientActive(data));
        return;
      }

      const find = response.find(
        (r) =>
          !(
            r.examinationData.options === "doctor.subclinical" ||
            r.examinationData.options === "doctor.service"
          )
      );

      if (find) {
        yield put(doctorActions.setSelectedExaminationId(find.examinationData.id!));
        yield put(doctorActions.setSelectedPatientActive(find));
      }
    }
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(frontDeskActions.getPatientForDateFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetPatientForDate() {
  yield takeLatest(frontDeskActions.getPatientForDateStart.type, getPatientForDate);
}

function* getBill({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetBillCompleted = yield call(billApi.get, payload);
    yield put(frontDeskActions.getBillCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(frontDeskActions.getBillFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetBill() {
  yield takeLatest(frontDeskActions.getBillStart.type, getBill);
}

function* paymentBillStart({ payload }: PayloadAction<{ billId: string; lengthIsUnPaid: number }>) {
  try {
    yield delay(500);
    yield call(billApi.patch, { status: "paid" }, payload.billId);

    yield put(
      appActions.setSnackbar({ open: true, text: "Thanh toán  thành công", severity: "success" })
    );

    if (payload.lengthIsUnPaid > 1) {
      const {
        bill: { selected },
      }: InitialStateFrontDesk = yield select((state) => state.frontDesk);

      yield put(
        frontDeskActions.getBillStart({
          limit: 9999,
          examination_card_id: selected?.examination_card_id,
        })
      );
    } else {
      yield put(patientActions.setToggleActions({ data: null, open: null }));
      yield put(
        bookingActions.getStart({
          date: dayjs()?.format("YYYY-MM-DD")!,
          limit: 9999,
          page: 1,
        })
      );
    }

    yield put(frontDeskActions.paymentBillSuccess());
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(frontDeskActions.getBillFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchPaymentBillStart() {
  yield takeLatest(frontDeskActions.paymentBillStart.type, paymentBillStart);
}

function* frontDeskSaga() {
  yield all([
    watchGetInformationPaymentByPatient(),
    watchGetPatientForDate(),
    watchGetBill(),
    watchReceivePrescriptionStart(),
    watchPaymentBillStart(),
  ]);
}

export default frontDeskSaga;
