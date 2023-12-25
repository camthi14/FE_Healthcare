import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as DatePickerMUI } from "@mui/x-date-pickers/DatePicker";
import "date-fns/locale/vi";
import dayjs, { Dayjs } from "dayjs";
import { FC } from "react";

type DatePickerProps = {
  label: string;
  value: Dayjs;
  minDate?: Dayjs;
  hideMinDate?: boolean;
  onChangeDate?: (day: Dayjs | null) => void;
};

const DatePicker: FC<DatePickerProps> = ({
  label,
  value,
  minDate = dayjs(),
  hideMinDate,
  onChangeDate,
}) => {
  return (
    <LocalizationProvider adapterLocale="vi" dateAdapter={AdapterDayjs}>
      <DatePickerMUI
        dayOfWeekFormatter={(day) => `${day}`}
        format="DD/MM/YYYY"
        minDate={hideMinDate ? undefined : minDate}
        label={label}
        value={value}
        onChange={onChangeDate}
        slotProps={{ textField: { size: "small" } }}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
