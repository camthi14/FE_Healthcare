import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import DoneIcon from "@mui/icons-material/Done";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HourglassDisabledIcon from "@mui/icons-material/HourglassDisabled";
import { Stack, TableCell, TableRow, Tooltip } from "@mui/material";
import { FC, memo } from "react";
import { Colors } from "~/constants";
import { GetDoctorSpecialist } from "~/models";
import { IHourObject } from "~/models/scheduleDoctor";
import LabelLeftTable from "./LabelLeftTable";

type RowSpecialtyProps = {
  row: GetDoctorSpecialist;
  hours: IHourObject[];
  index: number;
};

const RowSpecialty: FC<RowSpecialtyProps> = ({ hours, row, index }) => {
  return (
    <>
      <TableRow>
        <TableCell
          style={{
            minWidth: 300,
            padding: 0,
          }}
        >
          <LabelLeftTable label={`${index + 1}. Chuyên khoa ${row.name}`} />
        </TableCell>

        <TableCell colSpan={hours?.length} />
      </TableRow>

      {row.doctors?.length
        ? row.doctors.map((doctor) => {
            return (
              <TableRow key={doctor.id}>
                <TableCell
                  style={{
                    minWidth: 300,
                    padding: 0,
                  }}
                >
                  <LabelLeftTable
                    label={`${doctor.qualificationData?.character} ${doctor.display_name}`}
                    color="black"
                  />
                </TableCell>

                {!doctor?.schedules || !doctor?.schedules?.hours?.length
                  ? hours.map((hour) => (
                      <TableCell
                        key={hour.id}
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
                    ))
                  : hours.map((hour, indexHour) => {
                      let maxIndex = -1;
                      let minIndex = -1;

                      return doctor?.schedules?.hours?.map((schedule, indexSchedule) => {
                        if (hour.time_start !== schedule.time_start) {
                          const indexFindSchedule = hours.findIndex(
                            (h) => h.time_start === schedule.time_start
                          );

                          const indexFindInSchedule = doctor?.schedules?.hours?.findIndex(
                            (t) => t.time_start === hour.time_start
                          );

                          if (
                            indexFindInSchedule !== -1 ||
                            maxIndex === indexHour ||
                            minIndex === indexHour
                          )
                            return null;

                          if (indexFindInSchedule === -1) {
                            minIndex = indexHour;

                            return (
                              <TableCell
                                key={`${schedule.id}-${indexHour}-${hour.id}`}
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

                          if (
                            indexFindSchedule === indexSchedule ||
                            indexHour - 1 > Number(doctor?.schedules?.hours?.length)
                          )
                            return null;

                          if (maxIndex < indexHour) {
                            maxIndex = indexHour;
                          }

                          if (indexHour <= indexFindSchedule) {
                            return (
                              <TableCell
                                key={`${schedule.id}-${indexHour}-${hour.id}`}
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

                          return (
                            <TableCell
                              key={`${schedule.id}-${indexHour}-${hour.id}`}
                              sx={{
                                color: (theme) => theme.palette.primary.main,
                                fontWeight: 700,
                                paddingY: 2,
                                paddingX: 2,
                                background: (_) =>
                                  schedule.is_remove
                                    ? Colors.white
                                    : schedule.is_cancel
                                    ? Colors.redLight
                                    : schedule.is_booked
                                    ? Colors.greenLight
                                    : Colors.blueLight,
                              }}
                            >
                              <Stack
                                alignItems={"center"}
                                flexDirection={"row"}
                                justifyContent={"center"}
                              >
                                {schedule.is_remove ? (
                                  <Tooltip title="Không có lịch" arrow>
                                    <DoNotDisturbIcon color="disabled" />
                                  </Tooltip>
                                ) : null}

                                {schedule.is_booked ? (
                                  <Tooltip
                                    title="Lịch đã được đặt"
                                    arrow
                                    sx={{ cursor: "pointer" }}
                                  >
                                    <EventAvailableIcon color="success" />
                                  </Tooltip>
                                ) : null}

                                {schedule.is_cancel ? (
                                  <Tooltip title="Lịch đã bị hủy" arrow>
                                    <HourglassDisabledIcon color="error" />
                                  </Tooltip>
                                ) : null}

                                {!schedule.is_remove &&
                                !schedule.is_booked &&
                                !schedule.is_cancel ? (
                                  <Tooltip title="Lịch có sẵn" arrow>
                                    <DoneIcon />
                                  </Tooltip>
                                ) : null}
                              </Stack>
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell
                            key={`${schedule.id}-${indexHour}-${hour.id}`}
                            sx={{
                              color: (theme) => theme.palette.primary.main,
                              fontWeight: 700,
                              paddingY: 2,
                              paddingX: 2,

                              background: (_) =>
                                schedule.is_remove
                                  ? Colors.white
                                  : schedule.is_cancel
                                  ? Colors.redLight
                                  : schedule.is_booked
                                  ? Colors.greenLight
                                  : Colors.blueLight,
                            }}
                          >
                            <Stack
                              alignItems={"center"}
                              flexDirection={"row"}
                              justifyContent={"center"}
                            >
                              {/* {`${schedule.id} ---- schedule \n ${JSON.stringify(
                                schedule,
                                null,
                                4
                              )}`} */}
                              {schedule.is_remove ? (
                                <Tooltip title="Không có lịch" arrow>
                                  <DoNotDisturbIcon color="disabled" />
                                </Tooltip>
                              ) : null}

                              {schedule.is_booked ? (
                                <Tooltip title="Lịch đã được đặt" arrow sx={{ cursor: "pointer" }}>
                                  <EventAvailableIcon color="success" />
                                </Tooltip>
                              ) : null}

                              {schedule.is_cancel ? (
                                <Tooltip title="Lịch đã bị hủy" arrow>
                                  <HourglassDisabledIcon color="error" />
                                </Tooltip>
                              ) : null}

                              {!schedule.is_remove && !schedule.is_booked && !schedule.is_cancel ? (
                                <Tooltip title="Lịch có sẵn" arrow>
                                  <DoneIcon />
                                </Tooltip>
                              ) : null}
                            </Stack>
                          </TableCell>
                        );
                      });
                    })}
              </TableRow>
            );
          })
        : null}
    </>
  );
};

export default memo(RowSpecialty);
