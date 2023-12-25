import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { appReducer } from "~/features/app";
import { authReducer } from "~/features/auth";
import { bookingReducer } from "~/features/booking";
import { departmentReducer } from "~/features/department";
import { doctorReducer } from "~/features/doctor";
import { employeeReducer } from "~/features/employee";
import { equipmentReducer } from "~/features/equipment";
import { equipmentTypeReducer } from "~/features/equipmentType";
import { medicineReducer } from "~/features/medicine";
import { medicineTypeReducer } from "~/features/medicineType";
import { patientReducer } from "~/features/patient";
import { positionReducer } from "~/features/position";
import { qualificationReducer } from "~/features/qualification";
import { scheduleDoctorReducer } from "~/features/scheduleDoctor";
import { serviceReducer } from "~/features/servicePack";
import { serviceTypeReducer } from "~/features/serviceType";
import { specialtyReducer } from "~/features/specialty";
import { unitReducer } from "~/features/unit";
import rootSaga from "./rootSaga";
import { subclinicalReducer } from "~/features/subclinical";
import { subclinicalTypeReducer } from "~/features/subclinicalType";
import { roomReducer } from "~/features/room";
import { frontDeskReducer } from "~/features/frontDesk";
import { examinationCardReducer } from "~/features/examinationCard";

export const sagaMiddleware = createSagaMiddleware();

const defaultMiddlewareConfig = {
  serializableCheck: {
    ignoredPaths: [
      "booking.dateSelected",
      "booking.checkOut",
      "frontDesk.dataSelectReceive",
      "frontDesk.patients.date",
      "auth.navConfig.0.icon.$$typeof",
      "payload.0.icon.$$typeof",
      "auth.navConfig.0.icon.type.$$typeof",
      "auth.navConfig.0.icon.type.render",
      "auth.navConfig.0.icon.type.propTypes.children",
      "auth.navConfig.0.icon.type.propTypes.component",
      "auth.navConfig.0.icon.type.propTypes.sx",
      "auth.navConfig.0.icon.props.component.$$typeof",
      "auth.navConfig.0.icon.props.component.render",
      "doctor.screenExamination.patientActive.onSelectedPatient",
      "auth.navConfig.1.icon.$$typeof",
      "auth.navConfig.1.icon.type.$$typeof",
      "auth.navConfig.1.icon.type.render",
      "auth.navConfig.1.icon.type.propTypes.children",
      "examinationCard.examinationForDate.date",
      "specialty.screenSchedules.queries.date",
      "scheduleDoctor.screenDoctorSchedule.datesOfWeek.0.dayjs",
      "scheduleDoctor.screenDoctorSchedule.datesOfWeek.1.dayjs",
      "scheduleDoctor.screenDoctorSchedule.datesOfWeek.2.dayjs",
      "scheduleDoctor.screenDoctorSchedule.datesOfWeek.3.dayjs",
      "scheduleDoctor.screenDoctorSchedule.datesOfWeek.4.dayjs",
      "scheduleDoctor.screenDoctorSchedule.datesOfWeek.5.dayjs",
      "scheduleDoctor.screenDoctorSchedule.datesOfWeek.6.dayjs",
      "payload.selectedDate.dayjs",
      "scheduleDoctor.screenDoctorSchedule.selectedDate.dayjs",
    ],
    ignoredActions: [
      "booking/setCheckInOut",
      "booking/setDateSelected",
      "doctor/setSelectedPatientActive",
      "auth/setNavConfig",
      "scheduleDoctor/setSelectedData",
      "frontDesk/setDataSelectReceive",
    ],
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    employee: employeeReducer,
    doctor: doctorReducer,
    unit: unitReducer,
    department: departmentReducer,
    position: positionReducer,
    qualification: qualificationReducer,
    specialty: specialtyReducer,
    equipment: equipmentReducer,
    equipmentType: equipmentTypeReducer,
    service: serviceReducer,
    serviceType: serviceTypeReducer,
    subclinical: subclinicalReducer,
    subclinicalType: subclinicalTypeReducer,
    medicine: medicineReducer,
    medicineType: medicineTypeReducer,
    scheduleDoctor: scheduleDoctorReducer,
    booking: bookingReducer,
    patient: patientReducer,
    room: roomReducer,
    frontDesk: frontDeskReducer,
    examinationCard: examinationCardReducer,
  },
  middleware: (gMD) => gMD(defaultMiddlewareConfig).concat([sagaMiddleware]),
  devTools: process.env.NODE_ENV !== "production",
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
