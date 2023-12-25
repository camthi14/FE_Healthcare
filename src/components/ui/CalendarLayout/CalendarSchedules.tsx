import { Alert, Stack, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { FC, memo } from "react";
import { GetDoctorSpecialist } from "~/models";
import { IHourObject } from "~/models/scheduleDoctor";
import LabelLeftTable from "./LabelLeftTable";
import RowSpecialty from "./RowSpecailty";
import TableSticky from "./TableSticky";

export type CalendarPropsSchedules = {
  hours: IHourObject[];
  data: GetDoctorSpecialist[];
};

const CalendarSchedules: FC<CalendarPropsSchedules> = ({ hours, data }) => {
  return (
    <TableSticky>
      <TableHead>
        <TableRow>
          <TableCell
            style={{
              minWidth: 300,
              padding: 0,
            }}
          >
            <LabelLeftTable label="Thời gian" />
          </TableCell>
          {hours.map((hour) => (
            <TableCell key={hour.id} style={{ minWidth: 130 }}>
              <Stack alignItems={"center"}>
                <Typography
                  fontSize={14}
                  fontWeight={700}
                >{`${hour.time_start} - ${hour.time_end}`}</Typography>
              </Stack>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {data.length ? (
          data.map((row, index) => (
            <RowSpecialty index={index} key={row.id} row={row} hours={hours} />
          ))
        ) : (
          <TableRow>
            <TableCell>
              <Stack>
                <Alert color="info">Chưa có dữ liệu</Alert>
              </Stack>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </TableSticky>
  );
};

export default memo(CalendarSchedules);
