import { Alert, Box, Button, Container, LinearProgress, Stack, Typography } from "@mui/material";
import { Dayjs } from "dayjs";
import { FC, useCallback, useEffect } from "react";
import { DatePicker } from "~/components";
import { appActions } from "~/features/app";
import { bookingActions, useBooking } from "~/features/booking";
import { doctorActions, useDoctors } from "~/features/doctor";
import { useAppDispatch } from "~/stores";

type StepThreeSelectTimeProps = {
  onBack?: () => void;
  onNext?: () => void;
};

const StepThreeSelectTime: FC<StepThreeSelectTimeProps> = ({ onBack, onNext }) => {
  const { dateSelected, doctorId, hourId } = useBooking();
  const { schedulesData, loading } = useDoctors();
  const dispatch = useAppDispatch();

  const handleChangeDate = useCallback((date: Dayjs | null) => {
    dispatch(bookingActions.setDateSelected(date!));
  }, []);

  useEffect(() => {
    if (!doctorId) {
      onBack?.();
      return;
    }

    dispatch(doctorActions.getScheduleStart({ date: dateSelected.format("YYYY-MM-DD"), doctorId }));
  }, [doctorId, dateSelected, onBack]);

  const onSelected = useCallback((hourId: string, index: number) => {
    dispatch(bookingActions.setHourId({ hourId, order: index }));
  }, []);

  const onNextStep = useCallback(() => {
    if (!hourId) {
      dispatch(
        appActions.setSnackbar({ open: true, severity: "error", text: "Vui lòng chọn giờ" })
      );
      return;
    }

    if (!onNext) return;

    onNext();
  }, [onNext, hourId]);

  return (
    <Container maxWidth="md">
      <DatePicker label="Ngày" value={dateSelected} onChangeDate={handleChangeDate} />

      <Box position={"relative"}>
        <Box mb={2} position={"absolute"} top={-10} right={0} left={0}>
          {loading === "pending" ? <LinearProgress /> : null}
        </Box>

        <Stack mt={2} mb={5} flexDirection={"row"} flexWrap={"wrap"} gap={2}>
          {schedulesData?.length ? (
            schedulesData.map((hour, i) => {
              if (hour.is_booked || hour.is_cancel || hour.is_remove) return null;

              return (
                <Button
                  onClick={() => onSelected(hour.id, i + 1)}
                  key={i}
                  variant={hourId === hour.id ? "contained" : "outlined"}
                  sx={{ minWidth: 120 }}
                >
                  {`${hour.time_start} - ${hour.time_end}`}
                </Button>
              );
            })
          ) : (
            <Box>
              <Alert>{`Ngày ${dateSelected.format("DD/MM/YYYY")} không có lịch khám`}</Alert>
            </Box>
          )}

          {schedulesData.length &&
          schedulesData.every(
            (t) => t.is_booked || t.is_cancel || t.is_over_time || t.is_remove
          ) ? (
            <Box>
              <Alert>{`Ngày ${dateSelected.format("DD/MM/YYYY")} đã hết giờ khám bệnh`}</Alert>
            </Box>
          ) : null}
        </Stack>
      </Box>

      <Stack flexDirection={"row"} gap={2} justifyContent={"flex-end"}>
        <Button onClick={onBack} sx={{ minWidth: 120 }} variant="outlined" color="error">
          Trở về
        </Button>

        <Button
          onClick={onNextStep}
          sx={{ minWidth: 120, color: "white" }}
          variant="contained"
          color="success"
        >
          Tiếp tục
        </Button>
      </Stack>
    </Container>
  );
};

export default StepThreeSelectTime;
