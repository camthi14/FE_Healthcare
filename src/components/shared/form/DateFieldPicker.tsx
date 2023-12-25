import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField, DateFieldProps } from "@mui/x-date-pickers/DateField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Dayjs } from "dayjs";
import { FC } from "react";

type DateFieldPickerProps = {} & DateFieldProps<Dayjs>;

const DateFieldPicker: FC<DateFieldPickerProps> = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateField"]}>
        <DateField {...props} />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default DateFieldPicker;
