import BlockIcon from "@mui/icons-material/Block";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { FC, useCallback } from "react";
import LabelLeftTable from "~/components/ui/CalendarLayout/LabelLeftTable";
import { Colors } from "~/constants";
import { appActions } from "~/features/app";
import { useAccount } from "~/features/auth";
import { scheduleDoctorActions } from "~/features/scheduleDoctor";
import useResponsive from "~/hooks/useResponsive";
import {
  DoctorCancelScheduleInput,
  GetScheduleDoctorForDates,
  IHourObject,
} from "~/models/scheduleDoctor";
import { useAppDispatch } from "~/stores";
import {
  DatesOfWeek,
  SelectWeekResponse,
  handleCompareTimeWithCurrentTime,
  isCurrentDate,
} from "~/utils/common";
import CellHeaderTime from "./CellHeaderTime";
import CellSchedules from "./CellSchedules";

type DoctorScheduleTableLayoutProps = {
  datesOfWeek: DatesOfWeek;
  hours: IHourObject[];
  data: GetScheduleDoctorForDates[];
};

const DoctorScheduleTableLayout: FC<DoctorScheduleTableLayoutProps> = ({
  datesOfWeek,
  hours,
  data,
}) => {
  const user = useAccount();
  const isLaptopScreen = useResponsive("between", "lg", "xl");

  const dispatch = useAppDispatch();

  const handleSelected = useCallback(
    (date: SelectWeekResponse, hour: IHourObject, selected?: GetScheduleDoctorForDates) => {
      if (isCurrentDate(date.dayjs.toDate())) {
        const isCompare = handleCompareTimeWithCurrentTime(hour.time_start, hour.time_end);
        if (isCompare) return;
      }

      dispatch(
        scheduleDoctorActions.setSelectedData({
          selectedData: selected || null,
          selectedDate: date,
        })
      );
    },
    []
  );

  const handleCancel = useCallback(
    ({
      date,
      hour,
    }: {
      date: SelectWeekResponse;
      hour: IHourObject;
      selected?: GetScheduleDoctorForDates;
    }) => {
      if (!user || !hour.schedule_doctor_id) return;

      if (isCurrentDate(date.dayjs.toDate())) {
        const isCompare = handleCompareTimeWithCurrentTime(hour.time_start, hour.time_end);
        if (isCompare) return;
      }

      const data: DoctorCancelScheduleInput = {
        date: date.date,
        doctorId: String(user.id),
        hourId: hour.id!,
      };

      dispatch(appActions.setOpenBackdrop());
      dispatch(scheduleDoctorActions.doctorCancelStart(data));
    },
    [user]
  );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 1 }} elevation={2}>
      <TableContainer
        sx={{
          width: "100%",
          maxHeight: isLaptopScreen ? 440 : 700,
          "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
          "&::-webkit-scrollbar-thumb": {
            background: (theme) => theme.palette.grey[300],
            borderRadius: 20,
          },
          "&::-webkit-scrollbar": { width: "8px", height: 8 },
          "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
        }}
      >
        <Table
          stickyHeader
          sx={{
            "& > tbody > tr > td:nth-of-type(1), & > thead > tr  > th:nth-of-type(1)": {
              position: "sticky",
              left: 0,
              background: Colors.white,
            },
            "& td, & th": {
              border: "1px dashed rgba(0, 0 ,0, 0.5)",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  minWidth: 170,
                  padding: 0,
                }}
                align="center"
              >
                <LabelLeftTable label="Thời gian / Ngày" />
              </TableCell>

              {datesOfWeek.map((date) => (
                <CellHeaderTime date={date} key={date.day} />
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {hours.map((hour, indexHour) => {
              let maxIndex = -1;
              let minIndex = -1;
              let columnIndex = -1;

              return (
                <TableRow key={`${hour.id}`}>
                  <TableCell>
                    <Stack alignItems={"center"}>
                      <Typography
                        fontSize={14}
                        fontWeight={700}
                      >{`${hour.time_start} - ${hour.time_end}`}</Typography>
                    </Stack>
                  </TableCell>

                  {/* Date CN */}
                  <TableCell style={{ padding: 0 }}>
                    <Stack
                      sx={{
                        background: Colors.gray,
                        p: 2,
                        cursor: "no-drop",
                      }}
                      alignItems={"center"}
                    >
                      <BlockIcon fontSize="medium" />
                    </Stack>
                  </TableCell>

                  {/* Foreach */}
                  {datesOfWeek.slice(1).map((dateOfWeek, idxDateOfWeek) => {
                    const isOtherDate = dateOfWeek.dayjs.diff(dayjs(), "days") < 0;

                    const schedule = data.find(
                      (d) => dayjs(d.date).format("YYYY-MM-DD") === dateOfWeek.date
                    );

                    if (!data.length || !schedule || !schedule?.hours?.length)
                      return (
                        <TableCell
                          onClick={
                            isOtherDate
                              ? undefined
                              : () => handleSelected(dateOfWeek, hour, schedule)
                          }
                          key={`${hour.id}-${idxDateOfWeek}`}
                          sx={{
                            color: (theme) => theme.palette.primary.main,
                            fontWeight: 700,
                            paddingY: 2,
                            paddingX: 2,
                            background: Colors.white,
                          }}
                        >
                          <Stack alignItems={"center"}>
                            <Tooltip title="Không có lịch" arrow>
                              <DoNotDisturbIcon color="disabled" />
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      );

                    columnIndex = idxDateOfWeek;

                    return schedule.hours.map((scheduleHour, idxScheduleHour) => {
                      if (hour.time_start !== scheduleHour.time_start) {
                        if (++columnIndex === idxDateOfWeek) return null;

                        const indexFindInSchedule = schedule?.hours?.findIndex(
                          (t) => t.time_start === hour.time_start
                        );

                        if (
                          indexFindInSchedule !== -1 ||
                          maxIndex === indexHour ||
                          minIndex === indexHour
                        ) {
                          return null;
                        }

                        if (maxIndex < indexHour) {
                          maxIndex = indexHour;
                        }

                        if (indexFindInSchedule === -1) {
                          minIndex = indexHour;

                          return (
                            <TableCell
                              onClick={
                                isOtherDate || scheduleHour.is_over_time
                                  ? undefined
                                  : () => handleSelected(dateOfWeek, hour, schedule)
                              }
                              key={`${scheduleHour.id}-${indexHour}-${hour.id}`}
                              sx={{
                                color: (theme) => theme.palette.primary.main,
                                fontWeight: 700,
                                paddingY: 2,
                                paddingX: 2,
                                background: Colors.white,
                              }}
                            >
                              <Stack alignItems={"center"}>
                                <Tooltip title="Không có lịch" arrow>
                                  <DoNotDisturbIcon color="disabled" />
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          );
                        }
                      }

                      maxIndex++;
                      minIndex++;

                      return (
                        <CellSchedules
                          key={idxScheduleHour}
                          isOtherDate={isOtherDate}
                          scheduleHour={scheduleHour}
                          dateOfWeek={dateOfWeek}
                          schedule={schedule}
                          hour={hour}
                          onSelected={({ date, hour, selected }) =>
                            handleSelected(date, hour, selected)
                          }
                          onCancel={handleCancel}
                        />
                      );
                    });
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DoctorScheduleTableLayout;
