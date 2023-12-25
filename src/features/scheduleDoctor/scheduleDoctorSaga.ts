import { PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { all, call, debounce, delay, put, select, takeLatest } from "redux-saga/effects";
import { messageErrorSaga } from "~/helpers";
import {
  DoctorCancelScheduleInput,
  GetScheduleDoctorForDates,
  ScheduleDoctorPayload,
} from "~/models/scheduleDoctor";
import { ISessionCheckup } from "~/models/sessionCheckup";
import scheduleDoctorApi from "~/services/api/scheduleDoctorApi";
import sessionCheckupApi from "~/services/api/sessionCheckupApi";
import { DashboardPaths, Filters, SuccessResponseProp } from "~/types";
import {
  AddEditPayloadScheduleDoctor,
  GetScheduleDoctorCompleted,
  InitialStateSchedule,
  scheduleDoctorActions,
} from ".";
import { appActions } from "../app";
import { InitialStateSpecialty, specialtyActions } from "../specialty";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetScheduleDoctorCompleted = yield call(scheduleDoctorApi.get, payload);
    yield put(scheduleDoctorActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(scheduleDoctorActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(scheduleDoctorActions.getStart.type, get);
}

function* getScheduleDoctor({ payload }: PayloadAction<{ doctorId: string; dates: string }>) {
  try {
    yield delay(350);
    const response: GetScheduleDoctorForDates[] = yield call(
      scheduleDoctorApi.getScheduleDoctors,
      payload
    );
    yield put(scheduleDoctorActions.getSchedulesByDoctorSuccess(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(scheduleDoctorActions.getSchedulesByDoctorFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetScheduleDoctor() {
  yield takeLatest(scheduleDoctorActions.getSchedulesByDoctorStart.type, getScheduleDoctor);
}

function* doctorCancel({ payload }: PayloadAction<DoctorCancelScheduleInput>) {
  try {
    yield delay(350);
    yield call(scheduleDoctorApi.doctorCancel, payload);

    const {
      screenDoctorSchedule: { datesOfWeek },
    }: InitialStateSchedule = yield select((state) => state.scheduleDoctor);

    const dates = datesOfWeek.reduce(
      (results, value, index, old) =>
        (results += `${value.date}${index !== old.length - 1 ? "," : ""}`),
      ""
    );

    yield put(
      scheduleDoctorActions.getSchedulesByDoctorStart({
        dates,
        doctorId: String(payload.doctorId),
      })
    );

    yield put(scheduleDoctorActions.doctorCancelSuccess());
    yield put(
      appActions.setSnackbar({ open: true, text: "Hủy lịch thành công", severity: "success" })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(scheduleDoctorActions.getSchedulesByDoctorFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDoctorCancel() {
  yield takeLatest(scheduleDoctorActions.doctorCancelStart.type, doctorCancel);
}

function* getSessionCheckup() {
  try {
    yield delay(350);
    const response: SuccessResponseProp<ISessionCheckup[]> = yield call(sessionCheckupApi.get, {
      limit: 9999,
    });
    yield put(scheduleDoctorActions.getSessionCheckupSuccess(response.metadata));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(scheduleDoctorActions.getSchedulesByDoctorFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGetSessionCheckup() {
  yield takeLatest(scheduleDoctorActions.getSessionCheckupStart.type, getSessionCheckup);
}

function* addEdit({
  payload: { type, data, resetData },
}: PayloadAction<AddEditPayloadScheduleDoctor>) {
  try {
    let messageSuccess = "";

    if (type === "add") {
      yield call(scheduleDoctorApi.post, data);
      messageSuccess = "Thêm lịch khám thành công.";
    } else {
      yield call(scheduleDoctorApi.patch, data, data?.id!);
      messageSuccess = `Cập nhật lịch khám thành công.`;
    }

    yield put(scheduleDoctorActions.addEditCompleted());
    yield call(resetData);
    yield put(scheduleDoctorActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(scheduleDoctorActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEdit() {
  yield takeLatest(scheduleDoctorActions.addEditStart.type, addEdit);
}

function* addEditMultiple({ payload }: PayloadAction<{ data: ScheduleDoctorPayload[] }>) {
  try {
    let messageSuccess = "Thêm thành công";

    yield call(scheduleDoctorApi.createMultiple, payload);

    yield put(scheduleDoctorActions.addEditCompleted());
    yield put(scheduleDoctorActions.getStart({ limit: 5, page: 1 }));
    yield put(appActions.setSnackbar({ open: true, text: messageSuccess, severity: "success" }));

    const state: InitialStateSpecialty = yield select((state) => state.specialty);

    yield put(
      specialtyActions.getDoctorStart({
        ...state.screenSchedules.queries,
        // @ts-ignore
        date: state.screenSchedules.queries.date.format("YYYY-MM-DD"),
      })
    );

    yield put(appActions.setNavigation(DashboardPaths.DoctorScheduleList));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(scheduleDoctorActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddEditMultiple() {
  yield takeLatest(scheduleDoctorActions.addEditMultipleStart.type, addEditMultiple);
}

function* addSchedule({ payload }: PayloadAction<{ data: ScheduleDoctorPayload[] }>) {
  try {
    yield delay(350);

    yield call(scheduleDoctorApi.createMultiple, payload);

    yield put(
      appActions.setSnackbar({
        open: true,
        text: `Thêm lịch ngày ${dayjs(payload.data[0].date).format("DD/MM/YYYY")} thành công`,
        severity: "success",
      })
    );

    const {
      screenDoctorSchedule: { datesOfWeek },
    }: InitialStateSchedule = yield select((state) => state.scheduleDoctor);

    const dates = datesOfWeek.reduce(
      (results, value, index, old) =>
        (results += `${value.date}${index !== old.length - 1 ? "," : ""}`),
      ""
    );

    yield put(
      scheduleDoctorActions.getSchedulesByDoctorStart({
        dates,
        doctorId: String(payload.data[0].doctorId),
      })
    );

    yield put(scheduleDoctorActions.setSelectedData({ selectedData: null, selectedDate: null }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(scheduleDoctorActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchAddSchedule() {
  yield takeLatest(scheduleDoctorActions.addScheduleStart.type, addSchedule);
}

function* editSchedule({ payload }: PayloadAction<{ data: ScheduleDoctorPayload; id: string }>) {
  try {
    yield delay(350);

    yield call(scheduleDoctorApi.patch, payload.data, payload.id);

    yield put(
      appActions.setSnackbar({
        open: true,
        text: `Cập nhật ca khám ngày ${dayjs(payload.data.date).format("DD/MM/YYYY")} thành công`,
        severity: "success",
      })
    );

    const {
      screenDoctorSchedule: { datesOfWeek },
    }: InitialStateSchedule = yield select((state) => state.scheduleDoctor);

    const dates = datesOfWeek.reduce(
      (results, value, index, old) =>
        (results += `${value.date}${index !== old.length - 1 ? "," : ""}`),
      ""
    );

    yield put(
      scheduleDoctorActions.getSchedulesByDoctorStart({
        dates,
        doctorId: String(payload.data.doctorId),
      })
    );

    yield put(scheduleDoctorActions.setSelectedData({ selectedData: null, selectedDate: null }));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(scheduleDoctorActions.addEditFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchEditSchedule() {
  yield takeLatest(scheduleDoctorActions.editScheduleStart.type, editSchedule);
}

function* handleDelete({ payload }: PayloadAction<string>) {
  try {
    yield call(scheduleDoctorApi.delete, payload);
    yield put(scheduleDoctorActions.deleteCompleted());
    yield put(scheduleDoctorActions.getStart({ limit: 5, page: 1 }));
    yield put(
      appActions.setSnackbar({
        open: true,
        text: `Xoá lịch khám thành công`,
        severity: "success",
      })
    );
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(scheduleDoctorActions.deleteFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchDelete() {
  yield takeLatest(scheduleDoctorActions.deleteStart.type, handleDelete);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(scheduleDoctorActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, scheduleDoctorActions.setDebounceSearch.type, searchDebounce);
}

function* scheduleDoctorSaga() {
  yield all([
    watchGet(),
    watchAddEdit(),
    watchDelete(),
    watchSearchDebounce(),
    watchAddEditMultiple(),
    watchGetScheduleDoctor(),
    watchGetSessionCheckup(),
    watchAddSchedule(),
    watchEditSchedule(),
    watchDoctorCancel(),
  ]);
}

export default scheduleDoctorSaga;
