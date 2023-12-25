import { intervalToDuration } from "date-fns";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import isToday from "dayjs/plugin/isToday";
import { Colors } from "~/constants";
import {
  BillStatus,
  BookingStatus,
  BookingTypePatient,
  ExaminationCardOptions,
  ExaminationCardStatus,
  ExaminationCardsDetailStatus,
  PaymentForBill,
} from "~/models";
import { IHourObject } from "~/models/scheduleDoctor";
import { ISessionCheckup } from "~/models/sessionCheckup";
import { createHour } from "~/pages/doctor/helpers/createHour";

dayjs.extend(isToday);

export const convertGender = (gender: "MALE" | "FEMALE") => ({ MALE: "Nam", FEMALE: "Nữ" }[gender]);

export const convertPaymentStatus = (status: BillStatus) =>
  ({
    paid: "Đã thanh toán",
    unpaid: "Chưa thanh toán",
    partially_paid: "Thanh toán một phần",
    others: "Khác",
  }[status]);

export const convertPaymentStatusColors = (status: BillStatus) =>
  ({
    paid: Colors.green,
    unpaid: Colors.red,
    partially_paid: Colors.orange,
    others: Colors.yellow,
  }[status]);

export const convertOptionsBill = (status: PaymentForBill) =>
  ({
    medicine: "Hóa đơn thuốc",
    cost_exam: "Hóa đơn dịch vụ",
    cost_cls: "Hóa đơn CLS",
  }[status]);

export const convertBookingStatus = (status: BookingStatus) =>
  ({
    in_progress: "Chờ gọi khám",
    waiting: "Chờ bệnh nhân đến khám",
    completed: "Hoàn thành khám",
    paid: "Thanh toán",
    canceled: "Huỷ",
    doctor_canceled: "Bác sĩ đã huỷ",
  }[status]);

export const convertTypePatientStatus = (status: BookingTypePatient) =>
  ({
    new: "Bệnh nhân mới",
    re_examination: "Tái khám",
  }[status]);

export const convertExaminationCardStatus = (status: ExaminationCardStatus) =>
  ({
    in_progress: "Đang xử lý",
    complete: "Hoàn thành khám",
    pending: "Chờ khám",
    reject: "Từ chối",
    delay_results: "Chậm",
    examination: "Đang khám",
  }[status]);

export const convertExaminationCardDetailStatus = (status: ExaminationCardsDetailStatus) =>
  ({
    required: "Yêu cầu thực hiện",
    finished: "Hoàn thành",
    unfinished: "Chưa hoàn thành",
  }[status]);

export const convertExaminationCardDetailStatusColor = (status: ExaminationCardsDetailStatus) =>
  ({
    required: Colors.yellow,
    finished: Colors.green,
    unfinished: Colors.red,
  }[status]);

export const convertExaminationCardOptions = (status: ExaminationCardOptions) => {
  const response: Record<ExaminationCardOptions, string> = {
    service: "Khám dịch vụ",
    subclinical: "Khám CLS",
    "doctor.service": "BS CĐ",
    "doctor.subclinical": "BS CĐ",
    re_examination: "Tái khám",
    "doctor.re_examination": "BS CĐ",
  };

  return response[status];
};

export const calcAge = (birthDate: string | Date) => {
  const age = new Date(birthDate);
  const current = new Date();
  return current.getFullYear() - age.getFullYear() + 1;
};

export const getHours = (startHour: Date, endHour: Date) => {
  let results: never[] = [];

  const totalTimers = intervalToDuration({ end: endHour, start: startHour });
  const timeCheckupAvg = 15;

  const shiftCheckup = Math.floor(
    (totalTimers.hours! * 60 + totalTimers.minutes!) / timeCheckupAvg
  );

  const shifts = createHour({
    hourStart: startHour.getHours(),
    minuteStart: startHour.getMinutes(),
    shifts: [...Array(shiftCheckup)],
    timeCheckupAvg: timeCheckupAvg,
    results,
  });

  const hours: IHourObject[] = shifts.map((shift) => ({
    id: `${Math.random()}`,
    is_booked: false,
    time_end: shift.end,
    time_start: shift.start,
    is_remove: false,
    is_cancel: false,
    is_over_time: false,
  }));

  return hours;
};

export const findSessionByName = (sessions: ISessionCheckup[], sessionName: string) =>
  sessions.find((value) => value.name.toLowerCase().includes(sessionName));

export const getHourAndMinus = (hour: number, minus: number) => new Date(0, 0, 0, hour, minus);

export function selectWeek(date: Date) {
  return Array(7)
    .fill(new Date(date))
    .map((el, idx) => {
      const date = dayjs(new Date(el.setDate(el.getDate() - el.getDay() + idx)), { locale: "vi" });
      return {
        date: date.format("YYYY-MM-DD"),
        dayjs: date,
        day: date.day(),
        active: Boolean(date.isToday()),
        disabled: Boolean(date.day() === 0),
      };
    });
}

export const isCurrentDate = (date: string | Date) => dayjs(new Date(date)).isToday();

export type SelectWeekResponse = {
  date: string;
  dayjs: dayjs.Dayjs;
  day: number;
  active: boolean;
  disabled: boolean;
};

export type DatesOfWeek = SelectWeekResponse[];

export const getTimeStartEnd = (timeStart: string, timeEnd: string) => {
  const _timeStart = timeStart.split(":");
  const _timeEnd = timeEnd.split(":");

  return {
    hourStart: Number(_timeStart[0]),
    minusStart: Number(_timeStart[1]),
    hourEnd: Number(_timeEnd[0]),
    minusEnd: Number(_timeEnd[1]),
  };
};

export const getHourAndMinusCurrent = (time: string) => {
  return dayjs().format(`YYYY-MM-DD  ${time}`);
};

/**
 * Check timeCurrent with time selected
 * @param hourStart
 * @param hourEnd
 * @returns
 */
export const handleCompareTimeWithCurrentTime = (hourStart: string, hourEnd: string) => {
  const start = dayjs(getHourAndMinusCurrent(hourStart));
  const end = dayjs(getHourAndMinusCurrent(hourEnd));
  const current = dayjs();

  const startCompare = current.diff(start, "minutes", true);
  const endCompare = current.diff(end, "minutes", true);

  if (startCompare >= 0 || endCompare >= 0) return true;

  return false;
};
