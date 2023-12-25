import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import {
  DoctorCancelScheduleInput,
  GetScheduleDoctorForDates,
  IHourObject,
  IScheduleDoctor,
  ScheduleDoctorPayload,
} from "~/models/scheduleDoctor";
import { ISessionCheckup } from "~/models/sessionCheckup";
import { Filters, LoadingState, Pagination, SuccessResponseProp } from "~/types";
import {
  DatesOfWeek,
  SelectWeekResponse,
  findSessionByName,
  getHourAndMinus,
  getHours,
  getTimeStartEnd,
  handleCompareTimeWithCurrentTime,
  isCurrentDate,
  selectWeek,
} from "~/utils/common";

export interface InitialStateSchedule {
  data: IScheduleDoctor[];
  loading: LoadingState;
  filters: Filters;
  pagination: Pagination;
  errors: {
    addEdit?: string;
    get?: string;
    delete?: string;
  };

  screenDoctorSchedule: {
    data: GetScheduleDoctorForDates[];
    isLoading: LoadingState;
    error: string;
    datesOfWeek: DatesOfWeek;

    selectedDate: SelectWeekResponse | null;
    selectedSessionCheckup: ISessionCheckup | null;
    lastSession: ISessionCheckup | null;
    selectedData: GetScheduleDoctorForDates | null;

    sessionCheckup: ISessionCheckup[];
    hours: IHourObject[];
  };
}

const datesOfWeek = (): DatesOfWeek => {
  return selectWeek(dayjs().toDate());
};

const initialState: InitialStateSchedule = {
  data: [],
  loading: "ready",
  errors: {
    addEdit: "",
    delete: "",
    get: "",
  },
  filters: {
    page: 1,
    limit: 5,
  },
  pagination: {
    totalRows: 10,
    totalPage: 2,
    page: 1,
    limit: 5,
  },

  screenDoctorSchedule: {
    data: [],
    sessionCheckup: [],
    hours: [],

    isLoading: "ready",
    error: "",
    datesOfWeek: datesOfWeek(),

    selectedDate: null,
    selectedData: null,
    selectedSessionCheckup: null,
    lastSession: null,
  },
};

export type GetScheduleDoctorCompleted = SuccessResponseProp<IScheduleDoctor[], Pagination>;
export type AddEditPayloadScheduleDoctor = {
  type: "add" | "edit";
  data: IScheduleDoctor;
  resetData: () => void;
};

const scheduleDoctorSlice = createSlice({
  name: "scheduleDoctor",
  initialState,
  reducers: {
    getStart: (state, _: PayloadAction<Partial<Filters>>) => {
      state.loading = "pending";
      state.errors.get = "";
    },
    getCompleted: (
      state,
      { payload: { metadata, options } }: PayloadAction<GetScheduleDoctorCompleted>
    ) => {
      state.loading = "completed";
      state.errors.get = "";
      state.data = metadata;
      state.pagination = options ?? initialState.pagination;
    },
    getFailed: (state, { payload }: PayloadAction<string>) => {
      state.loading = "failed";
      state.errors.get = payload;
    },

    addEditMultipleStart: (state, _: PayloadAction<{ data: ScheduleDoctorPayload[] }>) => {
      state.loading = "pending";
      state.errors.addEdit = "";
    },
    addScheduleStart: (state, _: PayloadAction<{ data: ScheduleDoctorPayload[] }>) => {
      state.loading = "pending";
      state.errors.addEdit = "";
    },
    editScheduleStart: (state, _: PayloadAction<{ data: ScheduleDoctorPayload; id: string }>) => {
      state.loading = "pending";
      state.errors.addEdit = "";
    },
    addEditStart: (state, _: PayloadAction<AddEditPayloadScheduleDoctor>) => {
      state.loading = "pending";
      state.errors.addEdit = "";
    },
    addEditCompleted: (state) => {
      state.loading = "completed";
      state.errors.addEdit = "";
    },
    addEditFailed: (state, { payload }: PayloadAction<string>) => {
      state.loading = "failed";
      state.errors.addEdit = payload;
    },

    deleteStart: (state, _: PayloadAction<string>) => {
      state.loading = "pending";
      state.errors.delete = "";
    },
    deleteCompleted: (state) => {
      state.loading = "completed";
      state.errors.delete = "";
    },
    deleteFailed: (state, { payload }: PayloadAction<string>) => {
      state.loading = "failed";
      state.errors.delete = payload;
    },

    setFilter: (state, { payload }: PayloadAction<Filters>) => {
      state.filters = {
        ...payload,
      };
    },

    setDebounceSearch: (_state, _actions: PayloadAction<Filters>) => {},

    setNextWeek: (state) => {
      const firstDate = state.screenDoctorSchedule.datesOfWeek[0];
      const newDate = firstDate.dayjs.add(7, "days");
      const nextWeek = selectWeek(dayjs(newDate).toDate());
      state.screenDoctorSchedule.datesOfWeek = nextWeek;
    },

    setPrevWeek: (state) => {
      const firstDate = state.screenDoctorSchedule.datesOfWeek[0];
      const newDate = firstDate.dayjs.subtract(7, "days");
      const prevWeek = selectWeek(dayjs(newDate).toDate());
      state.screenDoctorSchedule.datesOfWeek = prevWeek;
    },

    setChangeWeek: (state, { payload }: PayloadAction<Date>) => {
      const nextWeek = selectWeek(payload);
      state.screenDoctorSchedule.datesOfWeek = nextWeek;
    },

    getSchedulesByDoctorStart: (state, {}: PayloadAction<{ doctorId: string; dates: string }>) => {
      state.screenDoctorSchedule.isLoading = "pending";
      state.screenDoctorSchedule.error = "";
    },

    getSchedulesByDoctorSuccess: (
      state,
      { payload }: PayloadAction<GetScheduleDoctorForDates[]>
    ) => {
      state.screenDoctorSchedule.isLoading = "completed";
      state.screenDoctorSchedule.error = "";
      state.screenDoctorSchedule.data = payload;
    },

    getSchedulesByDoctorFailed: (state, { payload }: PayloadAction<string>) => {
      state.screenDoctorSchedule.isLoading = "failed";
      state.screenDoctorSchedule.error = payload;
    },

    getSessionCheckupStart: (state) => {
      state.screenDoctorSchedule.isLoading = "pending";
      state.screenDoctorSchedule.error = "";
    },

    getSessionCheckupSuccess: (state, { payload }: PayloadAction<ISessionCheckup[]>) => {
      state.screenDoctorSchedule.isLoading = "completed";
      state.screenDoctorSchedule.error = "";
      state.screenDoctorSchedule.sessionCheckup = payload;
      state.screenDoctorSchedule.selectedSessionCheckup = payload[0];
    },

    doctorCancelStart: (state, _: PayloadAction<DoctorCancelScheduleInput>) => {
      state.screenDoctorSchedule.isLoading = "pending";
      state.screenDoctorSchedule.error = "";
    },

    doctorCancelSuccess: (state) => {
      state.screenDoctorSchedule.isLoading = "completed";
      state.screenDoctorSchedule.error = "";
    },

    setSelectedData: (
      state,
      {
        payload,
      }: PayloadAction<{
        selectedDate: SelectWeekResponse | null;
        selectedData: GetScheduleDoctorForDates | null;
      }>
    ) => {
      state.screenDoctorSchedule.selectedData = payload.selectedData;
      state.screenDoctorSchedule.selectedDate = payload.selectedDate;

      const lastData = [...state.screenDoctorSchedule.sessionCheckup];

      if (!payload.selectedData && !payload.selectedDate) {
        const sessionMorning = findSessionByName(lastData, "buổi sáng");

        state.screenDoctorSchedule.selectedSessionCheckup = sessionMorning!;

        const { time_end, time_start } = sessionMorning!;

        const duration = getTimeStartEnd(time_start, time_end);
        const start = getHourAndMinus(duration.hourStart, duration.minusStart);
        const end = getHourAndMinus(duration.hourEnd, duration.minusEnd);

        let hoursObject = getHours(start, end);

        state.screenDoctorSchedule.hours = hoursObject;
        state.screenDoctorSchedule.lastSession = null;

        return;
      }

      // TODO: Add
      if (!payload.selectedData) {
        const lastData = [...state.screenDoctorSchedule.sessionCheckup];

        const sessionMorning = findSessionByName(lastData, "buổi sáng");

        state.screenDoctorSchedule.selectedSessionCheckup = sessionMorning!;

        const { time_end, time_start } = sessionMorning!;

        const duration = getTimeStartEnd(time_start, time_end);
        const start = getHourAndMinus(duration.hourStart, duration.minusStart);
        const end = getHourAndMinus(duration.hourEnd, duration.minusEnd);

        let hoursObject = getHours(start, end);

        if (payload.selectedDate?.active) {
          hoursObject = hoursObject.map((t) => {
            const isOverTime = handleCompareTimeWithCurrentTime(t.time_start, t.time_end);

            return {
              ...t,
              is_over_time: isOverTime,
              is_remove: isOverTime,
            };
          });
        }

        state.screenDoctorSchedule.hours = hoursObject;

        return;
      }

      // TODO: Update
      const selectedSessionCheckup = state.screenDoctorSchedule.sessionCheckup.find(
        (t) => Number(t.id) === Number(payload.selectedData?.session_checkup_id)
      );

      if (!selectedSessionCheckup) return;

      state.screenDoctorSchedule.selectedSessionCheckup = selectedSessionCheckup;
      state.screenDoctorSchedule.lastSession = selectedSessionCheckup;

      const { time_end, time_start } = selectedSessionCheckup;

      const duration = getTimeStartEnd(time_start, time_end);
      const start = getHourAndMinus(duration.hourStart, duration.minusStart);
      const end = getHourAndMinus(duration.hourEnd, duration.minusEnd);

      let hoursObject = getHours(start, end);

      hoursObject = payload.selectedData.hours!.filter((t) =>
        hoursObject.map((h) => h.time_end).includes(t.time_end)
      );

      state.screenDoctorSchedule.hours = hoursObject;
    },

    setSelectedCheckup: (state, { payload }: PayloadAction<ISessionCheckup | null>) => {
      state.screenDoctorSchedule.selectedSessionCheckup = payload;

      if (!payload) {
        state.screenDoctorSchedule.hours = [];
      } else {
        const { name, time_end, time_start } = payload;

        let hoursObject: IHourObject[] = [];

        if (name.toLowerCase().includes("cả 2 buổi")) {
          const sessionMorning = findSessionByName(
            state.screenDoctorSchedule.sessionCheckup,
            "buổi sáng"
          );
          const sessionAfternoon = findSessionByName(
            state.screenDoctorSchedule.sessionCheckup,
            "buổi chiều"
          );

          const durationMo = getTimeStartEnd(sessionMorning!.time_start, sessionMorning!.time_end);
          const durationAf = getTimeStartEnd(
            sessionAfternoon!.time_start,
            sessionAfternoon!.time_end
          );

          const startMo = getHourAndMinus(durationMo.hourStart, durationMo.minusStart);
          const endMo = getHourAndMinus(durationMo.hourEnd, durationMo.minusEnd);
          const startAf = getHourAndMinus(durationAf.hourStart, durationAf.minusStart);
          const endAf = getHourAndMinus(durationAf.hourEnd, durationAf.minusEnd);

          hoursObject = [...getHours(startMo, endMo), ...getHours(startAf, endAf)];
        } else {
          const duration = getTimeStartEnd(time_start, time_end);
          const start = getHourAndMinus(duration.hourStart, duration.minusStart);
          const end = getHourAndMinus(duration.hourEnd, duration.minusEnd);

          hoursObject = getHours(start, end);
        }

        if (state.screenDoctorSchedule.selectedDate?.active) {
          hoursObject = hoursObject.map((t) => {
            const isOverTime = handleCompareTimeWithCurrentTime(t.time_start, t.time_end);

            return {
              ...t,
              is_over_time: isOverTime,
              is_remove: isOverTime,
            };
          });
        }

        if (state.screenDoctorSchedule.selectedData) {
          const { hours, session_checkup_id } = state.screenDoctorSchedule.selectedData;

          if (session_checkup_id === payload.id) {
            hoursObject = hoursObject!.map((hour) => {
              const _hour = hours?.find(
                (h) => h.time_start === hour.time_start && h.time_end === hour.time_end
              );

              if (_hour) {
                return _hour;
              }

              return hour;
            });
          } else {
            hoursObject = hoursObject.map((t) => {
              const hour = hours?.find(
                (h) => h.time_start === t.time_start && h.time_end === t.time_end
              );

              if (hour) {
                return hour;
              }

              return t;
            });
          }
        } else {
          const hours = [...state.screenDoctorSchedule.hours];

          hoursObject = hoursObject.map((t) => {
            const hour = hours.find(
              (h) => h.time_start === t.time_start && h.time_end === t.time_end
            );

            if (hour) {
              return hour;
            }

            return t;
          });
        }

        state.screenDoctorSchedule.hours = hoursObject;
      }
    },

    setRemoveHour: (state, { payload }: PayloadAction<string>) => {
      const findIndex = state.screenDoctorSchedule.hours.findIndex((t) => t.id === payload);

      const lastHours = [...state.screenDoctorSchedule.hours];

      lastHours[findIndex] = {
        ...lastHours[findIndex],
        is_remove: !lastHours[findIndex].is_remove,
      };

      state.screenDoctorSchedule.hours = lastHours;

      if (state.screenDoctorSchedule.selectedData && state.screenDoctorSchedule.lastSession) {
        let hours = [...(state.screenDoctorSchedule.selectedData.hours || [])];

        const findIndex = hours.findIndex((t) => t.id === payload);

        hours[findIndex] = {
          ...hours[findIndex],
          is_remove: !hours[findIndex].is_remove,
        };

        state.screenDoctorSchedule.selectedData.hours = hours;

        // console.log(`hours[findIndex].is_remove`, hours[findIndex].is_remove);

        if (
          state.screenDoctorSchedule.selectedSessionCheckup?.id !==
          state.screenDoctorSchedule.selectedData.session_checkup_id
        ) {
          if (hours[findIndex].is_remove) {
            // console.log(`one session`);
            // TODO: rollback => to one session
            state.screenDoctorSchedule.selectedData.session_checkup_id =
              state.screenDoctorSchedule.lastSession.id!;
            state.screenDoctorSchedule.selectedData.sessions =
              state.screenDoctorSchedule.lastSession;
          } else {
            // console.log(`two session`);

            // TODO: commit => to two session
            const session = findSessionByName(
              state.screenDoctorSchedule.sessionCheckup,
              "cả 2 buổi"
            );
            if (!session) return;
            state.screenDoctorSchedule.selectedData.session_checkup_id = session.id!;
            state.screenDoctorSchedule.selectedData.sessions = session;
          }
        }
      }
    },

    setIntervalDataGetSchedule: (state) => {
      const lastData = [...state.screenDoctorSchedule.data];

      if (!lastData.length) return;

      const index = lastData.findIndex((t) => isCurrentDate(t.date));

      if (index === -1) return;

      let hours = lastData[index].hours!;

      if (hours.every((h) => h.is_over_time)) return;

      hours = hours.map((t) => {
        const isOverTime = handleCompareTimeWithCurrentTime(t.time_start, t.time_end);

        return {
          ...t,
          is_over_time: isOverTime,
        };
      });

      lastData[index] = {
        ...lastData[index],
        hours,
      };

      state.screenDoctorSchedule.data = lastData;
    },
  },
});

export const scheduleDoctorActions = scheduleDoctorSlice.actions;
export default scheduleDoctorSlice.reducer;
