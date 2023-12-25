import dayjs from "dayjs";
import { Background } from "~/constants";
import { BookingStatus, ExaminationCardStatus } from "~/models";
import { IHourObject } from "~/models/scheduleDoctor";
import { handleCompareTimeWithCurrentTime } from "./common";

export type ConvertStatusBookingAtReceiveTabPayload = {
  status: ExaminationCardStatus | null;
  date: string;
  dataHour: IHourObject;
};

export const convertStatusBookingAtReceiveTab = ({
  dataHour,
  date,
  status,
}: ConvertStatusBookingAtReceiveTabPayload) => {
  const statuses: Record<ExaminationCardStatus, string> = {
    in_progress: Background.orangeLight,
    complete: Background.white,
    pending: Background.blueLight,
    reject: Background.redLight,
    delay_results: Background.redLight,
    examination: Background.greenLight,
  };

  // console.log(status);

  // 1. Cancel  | 2. Doctor cancel | 3. not here examination | 4. not confirm
  if (!status) {
    if (dayjs(date).isToday()) {
      const isOverTime = handleCompareTimeWithCurrentTime(dataHour.time_start, dataHour.time_end);
      // console.log(isOverTime);

      return isOverTime ? Background.gray : Background.white;
    }
    // So sánh nếu ngày date lớn hơn ngày hiện tại
    if (dayjs().diff(dayjs(date), "days", true) < 0) {
      return Background.white;
    }

    return Background.redLight;
  }

  return statuses[status];
};
