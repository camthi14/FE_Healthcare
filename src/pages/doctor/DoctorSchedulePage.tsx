import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Container, IconButton, Stack } from "@mui/material";
import { Dayjs } from "dayjs";
import { FC, useCallback, useEffect, useMemo } from "react";
import { DatePicker } from "~/components";
import CalendarHelper from "~/components/ui/CalendarLayout/CalendarHelpert";
import { appActions } from "~/features/app";
import { useAccount } from "~/features/auth";
import { scheduleDoctorActions, useScheduleDoctor } from "~/features/scheduleDoctor";
import { MainLayout } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { getHourAndMinus, getHours } from "~/utils/common";
import DialogSchedule from "./component/DialogSchedule";
import DoctorScheduleTableLayout from "./component/DoctorScheduleTableLayout";

const { Head } = MainLayout;

const DoctorSchedulePage: FC = () => {
  const {
    screenDoctorSchedule: { datesOfWeek, data, selectedDate, hours: hoursSession },
  } = useScheduleDoctor();
  const dispatch = useAppDispatch();
  const doctor = useAccount();

  useEffect(() => {
    // milliseconds * seconds
    const timeInterval = 1000 * 60;

    // Function check timeout after 1 minute isOverTime
    const intervalId = setInterval(() => {
      console.log(`setInterval after ${timeInterval} milliseconds`);
      dispatch(scheduleDoctorActions.setIntervalDataGetSchedule());
    }, timeInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [data]);

  useEffect(() => {
    dispatch(scheduleDoctorActions.getSessionCheckupStart());
  }, []);

  useEffect(() => {
    if (!doctor) return;

    const dates = datesOfWeek.reduce(
      (results, value, index, old) =>
        (results += `${value.date}${index !== old.length - 1 ? "," : ""}`),
      ""
    );

    dispatch(appActions.setOpenBackdrop());
    dispatch(
      scheduleDoctorActions.getSchedulesByDoctorStart({ dates, doctorId: String(doctor.id) })
    );
  }, [doctor, datesOfWeek]);

  const hours = useMemo(() => {
    const startMorning = getHourAndMinus(7, 30);
    const endMorning = getHourAndMinus(11, 30);
    const startAfternoon = getHourAndMinus(13, 30);
    const endAfternoon = getHourAndMinus(20, 0);

    const hoursMorning = getHours(startMorning, endMorning);
    const hoursAfter = getHours(startAfternoon, endAfternoon);

    return [...hoursMorning, ...hoursAfter];
  }, []);

  const handleNextWeek = useCallback(() => {
    dispatch(scheduleDoctorActions.setNextWeek());
  }, []);

  const handlePrevWeek = useCallback(() => {
    dispatch(scheduleDoctorActions.setPrevWeek());
  }, []);

  const handleChangeDate = useCallback((date: Dayjs | null) => {
    dispatch(scheduleDoctorActions.setChangeWeek(date?.toDate()!));
  }, []);

  const handleClose = useCallback(() => {
    dispatch(
      scheduleDoctorActions.setSelectedData({
        selectedData: null,
        selectedDate: null,
      })
    );
  }, []);

  return (
    <MainLayout>
      <Head title="Danh sách lịch khám bệnh" />

      <DialogSchedule hours={hoursSession} open={Boolean(selectedDate)} onClose={handleClose} />

      <Container maxWidth="xl">
        <Stack flexDirection={"row"} mb={2} justifyContent={"space-between"} alignItems={"center"}>
          <Stack flexDirection={"row"} gap={1}>
            <Box>
              <DatePicker
                onChangeDate={handleChangeDate}
                label="Ngày"
                value={datesOfWeek[0].dayjs}
                hideMinDate
              />
            </Box>
            <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
              <Box>
                <IconButton size="small" color="primary" onClick={handlePrevWeek}>
                  <ArrowBackIosNewIcon fontSize="inherit" />
                </IconButton>
              </Box>

              <Box>
                <IconButton size="small" color="primary" onClick={handleNextWeek}>
                  <ArrowForwardIosIcon fontSize="inherit" />
                </IconButton>
              </Box>
            </Stack>
          </Stack>

          <CalendarHelper />
        </Stack>

        <DoctorScheduleTableLayout data={data} datesOfWeek={datesOfWeek} hours={hours} />
      </Container>
    </MainLayout>
  );
};

export default DoctorSchedulePage;
