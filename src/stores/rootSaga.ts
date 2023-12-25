import { all } from "redux-saga/effects";
import appSaga from "~/features/app/appSaga";
import { authSaga } from "~/features/auth";
import { bookingSaga } from "~/features/booking";
import { departmentSaga } from "~/features/department";
import { doctorSaga } from "~/features/doctor";
import { employeeSaga } from "~/features/employee";
import { equipmentSaga } from "~/features/equipment";
import { equipmentTypeSaga } from "~/features/equipmentType";
import { examinationCardSaga } from "~/features/examinationCard";
import { frontDeskSaga } from "~/features/frontDesk";
import { medicineSaga } from "~/features/medicine";
import { medicineTypeSaga } from "~/features/medicineType";
import { patientSaga } from "~/features/patient";
import { positionSaga } from "~/features/position";
import { qualificationSaga } from "~/features/qualification";
import { roomSaga } from "~/features/room";
import { scheduleDoctorSaga } from "~/features/scheduleDoctor";
import { serviceSaga } from "~/features/servicePack";
import { serviceTypeSaga } from "~/features/serviceType";
import { specialtySaga } from "~/features/specialty";
import { subclinicalSaga } from "~/features/subclinical";
import { subclinicalTypeSaga } from "~/features/subclinicalType";
import { unitSaga } from "~/features/unit";

function* rootSaga() {
  yield all([
    appSaga(),
    authSaga(),
    employeeSaga(),
    doctorSaga(),
    unitSaga(),
    departmentSaga(),
    positionSaga(),
    qualificationSaga(),
    specialtySaga(),
    equipmentSaga(),
    equipmentTypeSaga(),
    serviceSaga(),
    serviceTypeSaga(),
    subclinicalSaga(),
    subclinicalTypeSaga(),
    medicineSaga(),
    medicineTypeSaga(),
    scheduleDoctorSaga(),
    patientSaga(),
    bookingSaga(),
    roomSaga(),
    examinationCardSaga(),
    frontDeskSaga(),
  ]);
}

export default rootSaga;
