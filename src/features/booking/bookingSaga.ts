import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, put, takeLatest, delay, debounce } from "redux-saga/effects";
import { BookingDesktopPayload } from "~/models";
import { GetBookingCompleted, bookingActions } from ".";
import { messageErrorSaga } from "~/helpers";
import { appActions } from "../app";
import bookingApi from "~/services/api/bookingApi";
import { DashboardPaths, Filters } from "~/types";

function* get({ payload }: PayloadAction<Filters>) {
  try {
    yield delay(500);
    const response: GetBookingCompleted = yield call(bookingApi.get, payload);
    yield put(bookingActions.getCompleted(response));
  } catch (error) {
    const message = messageErrorSaga(error);
    yield put(bookingActions.getFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchGet() {
  yield takeLatest(bookingActions.getStart.type, get);
}

function* bookingDesktop({ payload }: PayloadAction<BookingDesktopPayload>) {
  try {
    bookingApi.endPoint = "/Bookings/BookingDesktop";
    yield call(bookingApi.post, { ...payload, specialtyId: +payload.specialtyId });
    bookingApi.endPoint = "/Bookings";

    yield put(
      appActions.setSnackbar({ open: true, text: "Đặt lịch khám thành công", severity: "success" })
    );
    yield put(appActions.setNavigation(DashboardPaths.FrontDesk + "?tab=receive"));
    yield put(bookingActions.bookingDesktopSuccess());
  } catch (error) {
    const message = messageErrorSaga(error);
    put(bookingActions.bookingDesktopFailed(message));
    yield put(appActions.setSnackbar({ open: true, text: message, severity: "error" }));
  } finally {
    yield put(appActions.setCloseBackdrop());
  }
}

function* watchBookingDesktop() {
  yield takeLatest(bookingActions.bookingDesktopStart.type, bookingDesktop);
}

function* searchDebounce({ payload }: PayloadAction<Filters>) {
  yield put(bookingActions.setFilter(payload));
}

function* watchSearchDebounce() {
  yield debounce(500, bookingActions.setDebounceSearch.type, searchDebounce);
}

function* bookingSaga() {
  yield all([watchGet(), watchBookingDesktop(), watchSearchDebounce()]);
}

export default bookingSaga;
