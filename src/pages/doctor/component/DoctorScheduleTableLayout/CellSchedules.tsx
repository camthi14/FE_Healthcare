import BackspaceIcon from "@mui/icons-material/Backspace";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import DoneIcon from "@mui/icons-material/Done";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HourglassDisabledIcon from "@mui/icons-material/HourglassDisabled";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Button, Paper, Popover, Stack, TableCell, Tooltip, Typography } from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import { Colors } from "~/constants";
import { appActions } from "~/features/app";
import { messageErrorSaga } from "~/helpers";
import { IBooking } from "~/models";
import { GetScheduleDoctorForDates, IHourObject } from "~/models/scheduleDoctor";
import bookingApi from "~/services/api/bookingApi";
import { useAppDispatch } from "~/stores";
import { SelectWeekResponse } from "~/utils/common";
import { fDateWithMoment } from "~/utils/formatTime";

type CellSchedulesProps = {
  isOtherDate: boolean;
  scheduleHour: IHourObject;
  onSelected?: (payload: {
    date: SelectWeekResponse;
    hour: IHourObject;
    selected?: GetScheduleDoctorForDates;
  }) => void;
  onCancel?: (payload: {
    date: SelectWeekResponse;
    hour: IHourObject;
    selected?: GetScheduleDoctorForDates;
  }) => void;
  dateOfWeek: SelectWeekResponse;
  schedule: GetScheduleDoctorForDates;
  hour: IHourObject;
};

const CellSchedules: FC<CellSchedulesProps> = ({
  isOtherDate,
  scheduleHour,
  onSelected,
  onCancel,
  dateOfWeek,
  hour,
  schedule,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLTableCellElement>(null);
  const open = Boolean(anchorEl);
  const [booking, setBooking] = useState<IBooking | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        dispatch(appActions.setOpenBackdrop());
        const response = await bookingApi.getByHourId(scheduleHour.id);
        setBooking(response);
      } catch (error) {
        const message = messageErrorSaga(error);
        dispatch(appActions.setSnackbar({ open: true, severity: "error", text: message }));
      } finally {
        dispatch(appActions.setCloseBackdrop());
      }
    })();
  }, [open]);

  const handleClick = (event: React.MouseEvent<HTMLTableCellElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOnPressCancel = useCallback(() => {
    handleClose();
    if (!onCancel) return;
    onCancel({ date: dateOfWeek, hour: scheduleHour, selected: schedule });
  }, [onCancel, dateOfWeek, scheduleHour, schedule]);

  const handleOnPressEdit = useCallback(() => {
    handleClose();
    if (!onSelected) return;
    onSelected({ date: dateOfWeek, hour, selected: schedule });
  }, [onSelected, dateOfWeek, hour, schedule]);

  const handleSeePatient = useCallback(() => {
    handleClose();
  }, []);

  return (
    <>
      <TableCell
        sx={{
          color: (theme) => theme.palette.primary.main,
          fontWeight: 700,
          paddingY: 2,
          paddingX: 2,
          background: (_) =>
            isOtherDate || scheduleHour.is_over_time
              ? Colors.gray
              : scheduleHour.is_cancel
              ? Colors.redLight
              : scheduleHour.is_remove
              ? Colors.white
              : scheduleHour.is_booked
              ? Colors.greenLight
              : Colors.blueLight,
          cursor: isOtherDate || scheduleHour.is_over_time ? "default" : "pointer",
        }}
        onClick={
          isOtherDate ||
          scheduleHour.is_over_time ||
          scheduleHour.is_cancel ||
          scheduleHour.is_remove
            ? undefined
            : handleClick
        }
      >
        <Stack alignItems={"center"} flexDirection={"row"} justifyContent={"center"}>
          {/* {`${scheduleHour.id} ---- scheduleHour \n ${JSON.stringify(scheduleHour, null, 4)}`} */}

          {(scheduleHour.is_over_time && scheduleHour.is_remove) || scheduleHour.is_remove ? (
            <Tooltip title="Không có lịch" arrow>
              <DoNotDisturbIcon color="disabled" />
            </Tooltip>
          ) : null}

          {scheduleHour.is_booked ? (
            <Tooltip
              title="Lịch đã được đặt"
              arrow
              sx={{ cursor: "pointer" }}
              onClick={handleClick}
            >
              <EventAvailableIcon color="success" />
            </Tooltip>
          ) : null}

          {scheduleHour.is_cancel ? (
            <Tooltip title="Lịch đã bị hủy" arrow>
              <HourglassDisabledIcon color="error" />
            </Tooltip>
          ) : null}

          {(!scheduleHour.is_remove && !scheduleHour.is_booked && !scheduleHour.is_cancel) ||
          (!scheduleHour.is_remove && scheduleHour.is_over_time) ? (
            <Tooltip title="Lịch có sẵn" arrow>
              <DoneIcon />
            </Tooltip>
          ) : null}
        </Stack>
      </TableCell>

      <Popover
        id={"actions"}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {booking ? (
          <Stack minWidth={300} sx={{ px: 3, py: 4 }} gap={2} component={Paper} elevation={10}>
            <Stack width={"100%"} flexDirection={"row"} gap={2}>
              <Typography fontSize={18} fontWeight={700}>
                Thông tin bệnh nhân đặt lịch
              </Typography>
            </Stack>

            <Stack width={"100%"} flexDirection={"row"} gap={2}>
              <Typography>Ngày: </Typography>
              <Typography fontWeight={700}>{dateOfWeek.date}</Typography>
            </Stack>

            <Stack width={"100%"} flexDirection={"row"} gap={2}>
              <Typography>Ca khám:</Typography>
              <Typography
                fontWeight={700}
              >{`${scheduleHour.time_start} - ${scheduleHour.time_end}`}</Typography>
            </Stack>

            <Stack width={"100%"} flexDirection={"row"} gap={2}>
              <Typography>Bệnh nhân: </Typography>
              <Typography fontWeight={700}>{booking.dataPatient?.display_name}</Typography>
            </Stack>

            <Stack width={"100%"} flexDirection={"row"} gap={2}>
              <Typography>Số điện thoại: </Typography>
              <Typography fontWeight={700}>{booking.dataPatient?.phone_number}</Typography>
            </Stack>

            <Stack width={"100%"} flexDirection={"row"} gap={2}>
              <Typography>Ngày sinh: </Typography>
              <Typography fontWeight={700}>
                {fDateWithMoment(
                  booking.dataPatient?.infoData?.birth_date || "",
                  undefined,
                  "DD/MM/YYYY"
                )}
              </Typography>
            </Stack>

            <Stack width={"100%"} flexDirection={"row"} gap={2}>
              <Typography>Lý do khám: </Typography>
              <Typography fontWeight={700}>{booking.reason}</Typography>
            </Stack>

            <Stack flexDirection={"row"} gap={2}>
              {isOtherDate || scheduleHour.is_over_time || scheduleHour.is_cancel ? null : (
                <>
                  <Button
                    variant="contained"
                    onClick={handleOnPressEdit}
                    startIcon={<ModeEditIcon />}
                    sx={{ alignItems: "flex-start", justifyContent: "flex-start" }}
                  >
                    Cập nhật
                  </Button>

                  {booking?.examCard?.status === "complete" ? null : (
                    <Button
                      variant="contained"
                      onClick={handleOnPressCancel}
                      startIcon={<BackspaceIcon />}
                      color="error"
                      sx={{ alignItems: "flex-start", justifyContent: "flex-start" }}
                    >
                      Hủy lịch
                    </Button>
                  )}
                </>
              )}
            </Stack>
          </Stack>
        ) : (
          <Stack minWidth={140} p={1}>
            {isOtherDate || scheduleHour.is_over_time || scheduleHour.is_cancel ? null : (
              <>
                <Button
                  onClick={handleOnPressEdit}
                  startIcon={<ModeEditIcon />}
                  sx={{ alignItems: "flex-start", justifyContent: "flex-start" }}
                >
                  Cập nhật
                </Button>

                <Button
                  onClick={handleOnPressCancel}
                  startIcon={<BackspaceIcon />}
                  color="error"
                  sx={{ alignItems: "flex-start", justifyContent: "flex-start" }}
                >
                  Hủy lịch
                </Button>
              </>
            )}

            {scheduleHour.is_booked ? (
              <Button onClick={handleSeePatient} startIcon={<RemoveRedEyeIcon />} color="success">
                Xem bệnh nhân đặt lịch
              </Button>
            ) : null}
          </Stack>
        )}
      </Popover>
    </>
  );
};

export default CellSchedules;
