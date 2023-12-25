import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import DoneIcon from "@mui/icons-material/Done";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HourglassDisabledIcon from "@mui/icons-material/HourglassDisabled";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { FC, useCallback } from "react";
import { AppbarDialog, Transition } from "~/components";
import CalendarHelper from "~/components/ui/CalendarLayout/CalendarHelpert";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { scheduleDoctorActions, useScheduleDoctor } from "~/features/scheduleDoctor";
import { IHourObject, ScheduleDoctorPayload } from "~/models/scheduleDoctor";
import { ISessionCheckup } from "~/models/sessionCheckup";
import { useAppDispatch } from "~/stores";
import { appActions } from "~/features/app";
import { useAccount } from "~/features/auth";
import { isNumber } from "lodash";

type DialogScheduleProps = {
  open: boolean;
  onClose?: () => void;
  hours: IHourObject[];
};

const DialogSchedule: FC<DialogScheduleProps> = ({ open, onClose, hours }) => {
  const {
    screenDoctorSchedule: { selectedData, selectedDate, sessionCheckup, selectedSessionCheckup },
  } = useScheduleDoctor();
  const doctor = useAccount();

  const dispatch = useAppDispatch();

  const handleChangeSession = useCallback((item: ISessionCheckup) => {
    dispatch(scheduleDoctorActions.setSelectedCheckup(item));
  }, []);

  const handleRemoveHours = useCallback((id: string) => {
    dispatch(scheduleDoctorActions.setRemoveHour(id));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!selectedSessionCheckup || !selectedDate || !doctor) return;

    let data = hours.filter((t) => !t.is_over_time);

    if (!data.length) {
      dispatch(
        appActions.setSnackbar({
          open: true,
          severity: "error",
          text: `${selectedSessionCheckup.name} đã hết thời gian làm việc Vui lòng chọn buổi làm việc khác`,
        })
      );
      return;
    }

    if (selectedData) {
      data = selectedData.hours!.filter((t) => !t.is_over_time);
    }

    let dataRemove = data.filter((d) => !d.is_remove);

    if (!selectedData && !dataRemove.length) {
      dispatch(
        appActions.setSnackbar({
          open: true,
          severity: "error",
          text: `Vui lòng không bỏ chọn tất cả`,
        })
      );
      return;
    }

    dataRemove = dataRemove.map((hour) => ({
      ...hour,
      is_booked: isNumber(hour.is_booked) ? Boolean(hour.is_booked === 1) : hour.is_booked,
      is_cancel: isNumber(hour.is_cancel) ? Boolean(hour.is_cancel === 1) : hour.is_cancel,
      is_remove: isNumber(hour.is_remove) ? Boolean(hour.is_remove === 1) : hour.is_remove,
    }));

    const payload: ScheduleDoctorPayload[] = [
      {
        date: selectedDate.date,
        doctorId: String(doctor.id),
        hours: dataRemove,
        sessionCheckUpId: selectedData
          ? selectedData.session_checkup_id
          : Number(selectedSessionCheckup.id),
      },
    ];

    console.log(payload);

    dispatch(appActions.setOpenBackdrop());

    if (selectedData) {
      dispatch(
        scheduleDoctorActions.editScheduleStart({ data: payload[0], id: String(selectedData.id) })
      );
      return;
    }

    dispatch(scheduleDoctorActions.addScheduleStart({ data: payload }));
  }, [hours, selectedSessionCheckup, selectedDate, selectedData, doctor]);

  return (
    <Dialog TransitionComponent={Transition} maxWidth="lg" fullWidth open={open} onClose={onClose}>
      <AppbarDialog
        title={
          selectedData && selectedDate
            ? `Cập nhật lịch khám ngày ${selectedDate.dayjs.format("DD/MM/YYYY")}`
            : `Thêm mới lịch khám ngày ${selectedDate?.dayjs.format("DD/MM/YYYY")}`
        }
      >
        <IconButton color="error" size="small" onClick={onClose}>
          <HighlightOffIcon />
        </IconButton>
      </AppbarDialog>

      <DialogContent sx={SCROLLBAR_CUSTOM}>
        <Stack
          flexDirection={"row"}
          gap={1}
          alignItems={"flex-end"}
          justifyContent={"flex-end"}
          p={1}
        >
          {sessionCheckup?.length
            ? sessionCheckup.map((item) => (
                <Button
                  onClick={() => handleChangeSession(item)}
                  key={item.id}
                  variant={selectedSessionCheckup?.id === item.id ? "contained" : "outlined"}
                  color="primary"
                >
                  {item.name}
                </Button>
              ))
            : null}
        </Stack>

        <Stack mb={1}>
          <CalendarHelper />
        </Stack>

        <Alert color="info">Chọn buổi để thay đổi thời gian làm việc</Alert>

        <Alert color="warning">
          Tất cả giờ màu xanh là giờ đã được chọn. Nếu không muốn chọn giờ nào vui lòng chọn vào giờ
          đó.
        </Alert>
        <Alert color="error">Không cho phép thay đổi những lịch đã hủy hoặc đã đặt</Alert>

        <Stack mt={2}>
          <Typography fontWeight={700}>Thời gian làm việc</Typography>
          <Stack flexDirection={"row"} mt={1} flexWrap={"wrap"} mb={4} gap={2}>
            {hours?.length
              ? hours.map((hour, i) => (
                  <Button
                    disabled={hour.is_over_time}
                    key={i}
                    variant={hour.is_remove ? "outlined" : "contained"}
                    onClick={
                      hour.is_cancel || hour.is_over_time || hour.is_booked
                        ? undefined
                        : () => handleRemoveHours(hour.id)
                    }
                    color={hour.is_booked ? "success" : hour.is_cancel ? "error" : "primary"}
                    startIcon={
                      hour.is_remove || hour.is_over_time ? (
                        <Tooltip
                          title={hour.is_remove ? "Không có lịch" : "Đã quá thời gian"}
                          arrow
                        >
                          <DoNotDisturbIcon color="disabled" />
                        </Tooltip>
                      ) : hour.is_booked ? (
                        <Tooltip title="Lịch đã được đặt" arrow>
                          <EventAvailableIcon />
                        </Tooltip>
                      ) : hour.is_cancel ? (
                        <Tooltip title="Lịch đã bị hủy" arrow>
                          <HourglassDisabledIcon />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Lịch có sẵn" arrow>
                          <DoneIcon />
                        </Tooltip>
                      )
                    }
                  >
                    {`${hour.time_start} - ${hour.time_end}`}
                  </Button>
                ))
              : null}
          </Stack>
        </Stack>

        <DialogActions>
          <LoadingButton
            onClick={handleSubmit}
            variant="contained"
            color="success"
            sx={{ color: "white", px: 8, py: 1 }}
          >
            {selectedData ? `Lưu thay đổi` : "Thêm mới"}
          </LoadingButton>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSchedule;
