import { intervalToDuration } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { appActions } from "~/features/app";
import { IDoctorResponse } from "~/models";
import { IHourObject, ScheduleDoctorPayload } from "~/models/scheduleDoctor";
import { ISessionCheckup } from "~/models/sessionCheckup";
import { useAppDispatch } from "~/stores";
import { fDateWithMoment } from "~/utils/formatTime";
import { createHour } from "./createHour";
import { scheduleDoctorActions } from "~/features/scheduleDoctor";
import {
  findSessionByName,
  getHourAndMinus,
  getHours,
  handleCompareTimeWithCurrentTime,
  isCurrentDate,
} from "~/utils/common";

type LoaderType = { doctor: IDoctorResponse[] | null; sessionCheckup: ISessionCheckup[] | null };

type ValuesState = {
  dateSelected: Dayjs;
  dates: Record<string, { sessionCheckup: ISessionCheckup; hours: IHourObject[]; date: string }>;
};

type ValuesType = Record<string, ValuesState>;

const FORMAT = "DD/MM/YYYY";

export const useGetDoctorIds = () => {
  const loaderData = useLoaderData() as LoaderType;
  const dispatch = useAppDispatch();
  const [sessionCheckups, setSessionCheckups] = useState<ISessionCheckup[]>([]);
  const [doctors, setDoctors] = useState<IDoctorResponse[]>([]);
  const [selected, setSelected] = useState<IDoctorResponse | null>(null);
  const [values, setValues] = useState<ValuesType | null>(null);
  const [disabled, setDisabled] = useState<Dayjs>(dayjs());

  const calcHours = useMemo(
    () => (doctor: IDoctorResponse, sessionCheckups: ISessionCheckup) => {
      const { specialtyData } = doctor;

      if (!specialtyData) return;

      const { time_chekup_avg } = specialtyData;
      const { time_end, time_start } = sessionCheckups;

      const _timeStart = time_start.split(":");
      const _timeEnd = time_end.split(":");

      const start = new Date(0, 0, 0, +_timeStart[0], +_timeStart[1]);
      const end = new Date(0, 0, 0, +_timeEnd[0], +_timeEnd[1]);
      const totalTimers = intervalToDuration({ end, start });

      const shiftCheckup = Math.floor(
        (totalTimers.hours! * 60 + totalTimers.minutes!) / +time_chekup_avg
      );

      let results: never[] = [];

      const shifts = createHour({
        hourStart: start.getHours(),
        minuteStart: start.getMinutes(),
        shifts: [...Array(shiftCheckup)],
        timeCheckupAvg: +time_chekup_avg,
        results,
      });

      const hours: IHourObject[] = shifts.map((shift) => ({
        id: `${Math.random()}`,
        is_booked: false,
        time_end: shift.end,
        time_start: shift.start,
        is_remove: false,
        is_cancel: false,
      }));

      return hours;
    },
    []
  );

  const hoursArrayObject = useMemo(() => {
    const startMorning = getHourAndMinus(7, 30);
    const endMorning = getHourAndMinus(11, 30);
    const startAfternoon = getHourAndMinus(13, 30);
    const endAfternoon = getHourAndMinus(17, 0);

    const hoursMorning = getHours(startMorning, endMorning);
    const hoursAfter = getHours(startAfternoon, endAfternoon);

    return [...hoursMorning, ...hoursAfter];
  }, []);

  useEffect(() => {
    if (!loaderData.sessionCheckup) return;
    setSessionCheckups(loaderData.sessionCheckup);

    if (!loaderData.doctor) return;

    const length = loaderData.doctor.length;

    if (length === 0) return;

    setDoctors(loaderData.doctor);

    const selected = loaderData.doctor[0];

    setSelected(selected);

    const sessionCheckups = findSessionByName(loaderData.sessionCheckup, "buổi sáng");

    let dateNow = dayjs();

    if (isCurrentDate(dateNow.toDate())) {
      let lastHoursArrayObject = [...hoursArrayObject];
      lastHoursArrayObject = lastHoursArrayObject.map((t) => {
        const isOverTime = handleCompareTimeWithCurrentTime(t.time_start, t.time_end);

        return {
          ...t,
          is_over_time: isOverTime,
          is_remove: isOverTime,
        };
      });

      if (lastHoursArrayObject.every((t) => t.is_over_time)) {
        dateNow = dateNow.add(1, "days");
        setDisabled(dateNow);
      }
    }

    let _values: ValuesType | null = null;
    const date = dateNow.format(FORMAT);

    for (let index = 0; index < length; index++) {
      const doctor = loaderData.doctor[index];
      let hours = calcHours(doctor, sessionCheckups!)!;

      if (isCurrentDate(dateNow.toDate())) {
        hours = hours.map((t) => {
          const isOverTime = handleCompareTimeWithCurrentTime(t.time_start, t.time_end);

          return {
            ...t,
            is_over_time: isOverTime,
            is_remove: isOverTime,
          };
        });
      }

      const data = {
        dates: {
          [date]: {
            date,
            hours,
            sessionCheckup: sessionCheckups!,
          },
        },
        dateSelected: dateNow,
      };

      if (!_values || _.isEmpty(_values)) {
        _values = {
          [doctor.id!]: data,
        };
      } else {
        _values = {
          ...(_values as ValuesType),
          [doctor.id!]: data,
        };
      }
    }

    setValues(_values);
  }, [loaderData, hoursArrayObject]);

  const onChangeSelected = useCallback((doctor: IDoctorResponse) => {
    setSelected(doctor);
  }, []);

  const onRemoveHour = useCallback(
    (doctorId: string, hourId: string) => {
      if (!values) return;

      /**
       * Select valuesDoctor.
       * Find hour byId
       * set toggle is_remove
       */

      const dataDoctor = values[doctorId];
      const { dateSelected, dates } = dataDoctor;
      const hours = dates[dateSelected.format(FORMAT)].hours;

      const index = hours.findIndex((h) => h.id === hourId);

      hours[index] = {
        ...hours[index],
        is_remove: !hours[index].is_remove,
      };

      setValues((prev) => {
        const doctor = prev![doctorId];
        const { dateSelected, dates } = doctor;
        const format = dateSelected.format(FORMAT);

        return {
          ...prev,
          [doctorId]: {
            ...doctor,
            dates: {
              ...dates,
              [format]: {
                ...dates[format],
                hours: hours,
              },
            },
          },
        };
      });
    },
    [values]
  );

  const onSelectSession = useCallback(
    (id: number) => {
      if (!sessionCheckups.length || !selected) return;

      const sessionCheckup = sessionCheckups.find((t) => t.id === id);

      if (sessionCheckup && sessionCheckup.name.toLowerCase().includes("cả 2 buổi")) {
        const sessionMorning = findSessionByName(sessionCheckups, "buổi sáng");
        const sessionAfternoon = findSessionByName(sessionCheckups, "buổi chiều");

        const hourMorning = calcHours(selected, sessionMorning!)!;
        const hourAfternoon = calcHours(selected, sessionAfternoon!)!;

        setValues((prev) => {
          const doctorId = selected.id!;
          const _prev = prev![doctorId];
          const _dateFormat = _prev.dateSelected.format(FORMAT);

          let hours = [...hourMorning, ...hourAfternoon];

          if (isCurrentDate(_prev.dateSelected.toDate())) {
            hours = hours.map((t) => {
              const isOverTime = handleCompareTimeWithCurrentTime(t.time_start, t.time_end);

              return {
                ...t,
                is_over_time: isOverTime,
                is_remove: isOverTime,
              };
            });
          }

          return {
            ...prev,
            [doctorId]: {
              ..._prev,
              dates: {
                ..._prev.dates,
                [_dateFormat]: {
                  ..._prev.dates[_dateFormat],
                  hours: hours,
                  sessionCheckup: sessionCheckup,
                },
              },
            },
          };
        });

        return;
      }

      let hours = calcHours(selected, sessionCheckup!)!;

      setValues((prev) => {
        const doctorId = selected.id!;
        const _prev = prev![doctorId];
        const _dateFormat = _prev.dateSelected.format(FORMAT);

        if (isCurrentDate(_prev.dateSelected.toDate())) {
          hours = hours.map((t) => {
            const isOverTime = handleCompareTimeWithCurrentTime(t.time_start, t.time_end);

            return {
              ...t,
              is_over_time: isOverTime,
              is_remove: isOverTime,
            };
          });
        }

        return {
          ...prev,
          [doctorId]: {
            ..._prev,
            dates: {
              ..._prev.dates,
              [_dateFormat]: {
                ..._prev.dates[_dateFormat],
                hours,
                sessionCheckup: sessionCheckup!,
              },
            },
          },
        };
      });
    },
    [sessionCheckups, selected]
  );

  const onChangeDate = useCallback(
    (date: Dayjs | null) => {
      if (!selected || !values || !sessionCheckups.length) return;
      /**
       * Check date exists?
       * If false => create new Hours with date change, sessionCheckup default morning
       * If true => setSelectedDate => date change
       */

      const dateFormat = date?.format(FORMAT)!;
      let valuesDoctor = values[selected.id!];

      if (valuesDoctor.dates.hasOwnProperty(dateFormat)) {
        setValues((prev) => {
          const data = prev![selected.id!];

          let hours = data.dates[dateFormat].hours;

          if (isCurrentDate(date?.toDate()!)) {
            hours = hours.map((t) => {
              const isOverTime = handleCompareTimeWithCurrentTime(t.time_start, t.time_end);

              return {
                ...t,
                is_over_time: isOverTime,
                is_remove: isOverTime,
              };
            });
          }

          return {
            ...prev,
            [selected.id!]: {
              ...prev![selected.id!],
              ...valuesDoctor,
              dateSelected: date!,
              dates: {
                ...valuesDoctor.dates,
                [dateFormat]: {
                  ...valuesDoctor.dates[dateFormat],
                  hours,
                },
              },
            },
          };
        });
        return;
      }

      const sessionMorning = findSessionByName(sessionCheckups, "buổi sáng")!;

      let hours = calcHours(selected, sessionMorning)!;

      if (isCurrentDate(date?.toDate()!)) {
        hours = hours.map((t) => {
          const isOverTime = handleCompareTimeWithCurrentTime(t.time_start, t.time_end);

          return {
            ...t,
            is_over_time: isOverTime,
            is_remove: isOverTime,
          };
        });
      }

      valuesDoctor = {
        dateSelected: date!,
        dates: {
          ...valuesDoctor.dates,
          [dateFormat!]: {
            date: dateFormat!,
            hours: hours,
            sessionCheckup: sessionMorning,
          },
        },
      };

      setValues((prev) => ({
        ...prev,
        [selected.id!]: {
          ...prev![selected.id!],
          ...valuesDoctor,
        },
      }));
    },
    [selected, values, sessionCheckups]
  );

  const dateSelectedResults = useMemo(() => {
    if (!values || !selected) return [];

    const _dateSelected: string[] = [];

    if (_.isEmpty(values[selected.id!].dates)) return [];

    Object.keys(values[selected.id!].dates).forEach((k) => {
      _dateSelected.push(k);
    });

    return _dateSelected;
  }, [values, selected]);

  const onRemoveSelectedDate = useCallback(
    (date: string) => {
      if (!selected || !values || !dateSelectedResults.length || dateSelectedResults?.length === 1)
        return;

      const valuesDoctor = values[selected.id!];

      // Xoa date da chon
      delete valuesDoctor.dates[date];

      // Set lại dateSelected được chọn
      const dateSelectedNew = [...dateSelectedResults].filter((t) => t !== date)[0];
      const dateSelected = dayjs(dateSelectedNew, "DD/MM/YYYY");

      setValues((prev) => ({
        ...prev,
        [selected.id!]: {
          ...prev![selected.id!],
          ...valuesDoctor,
          dateSelected,
        },
      }));
    },
    [selected, values, dateSelectedResults]
  );

  const selectedSessionDoctor = useMemo(() => {
    if (!values || !selected) return;

    const valuesDoctor = values[selected.id!];

    const session = valuesDoctor.dates[valuesDoctor.dateSelected.format(FORMAT)].sessionCheckup;

    return session;
  }, [values, selected]);

  const hourSelectedByDoctor = useMemo(() => {
    if (!selected || !values) return;
    const valuesDoctor = values[selected.id!];

    const hours = valuesDoctor.dates[valuesDoctor.dateSelected.format(FORMAT)].hours;
    return hours;
  }, [selected, values]);

  const onSave = useCallback(() => {
    if (!values) {
      dispatch(
        appActions.setSnackbar({
          open: true,
          text: "Đã có lỗi xảy ra. Vui lòng Refresh trang.",
          severity: "error",
        })
      );
      return;
    }

    const data: ScheduleDoctorPayload[] = [];

    Object.keys(values).forEach((k) => {
      const doctorId = k;
      const datesObject = values[doctorId].dates;

      Object.keys(datesObject).forEach((key) => {
        const date = fDateWithMoment(datesObject[key].date, FORMAT);
        data.push({
          date,
          doctorId,
          hours: datesObject[key].hours,
          sessionCheckUpId: datesObject[key].sessionCheckup.id!,
        });
      });
    });

    console.log(`onSave`, data);

    dispatch(scheduleDoctorActions.addEditMultipleStart({ data }));
  }, [values]);

  return {
    disabled,
    values,
    sessionCheckups,
    doctors,
    selected,
    dateSelectedResults,
    selectedSessionDoctor,
    hourSelectedByDoctor,
    onSave,
    onChangeSelected,
    onRemoveHour,
    onSelectSession,
    onChangeDate,
    onRemoveSelectedDate,
  };
};
