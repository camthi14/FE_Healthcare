import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { Alert, Box, Button, Container, Stack, Typography } from "@mui/material";
import "dayjs/locale/vi";
import { FC, useMemo } from "react";
import { Iconify } from "~/components";
import { useBooking } from "~/features/booking";
import { useDoctors } from "~/features/doctor";
import { usePatients } from "~/features/patient";

type StepFourConfirmProps = {
  onBack?: () => void;
  onSubmit?: () => void;
};

const StepFourConfirm: FC<StepFourConfirmProps> = ({ onBack, onSubmit }) => {
  /**
   * 1.Info Patient (display_name,phone_number, dịa chỉ )
   * 2.specialty (name)
   * 3.doctor (display_name,email,phone_number,qualificationData.name )
   * 4.Schedule appointment
   */
  const { specialty, doctorId, dateSelected, hourId, patient, reason } = useBooking();
  const { data, schedulesData } = useDoctors();
  const { data: patientData } = usePatients();

  const doctor = useMemo(() => {
    return data.find((d) => d.id === doctorId)!;
  }, [doctorId, data]);

  const patientInfo = useMemo(() => {
    return patientData.find((d) => d.id === patient?.id)!;
  }, [patient, patientData]);

  const hourBooking = useMemo(() => {
    return schedulesData.find((d) => d.id === hourId)!;
  }, [hourId, schedulesData]);

  const arrConfirm = useMemo(() => {
    let date = dateSelected.locale("vi").format("dddd, DD/MM/YYYY");

    date = date.charAt(0).toUpperCase() + date.slice(1);

    return [
      {
        title: "Xác nhận khai báo cơ bản",
        content: `Chuyên khoa: ${specialty?.name}`,
        contentSub: `Lý do khám: ${reason}`,
        icon: <PermContactCalendarIcon />,
        color: "grey",
      },
      {
        title: "Xác nhận bác sĩ khám",
        content: `Họ và tên: ${doctor?.qualificationData?.character} ${doctor?.display_name}`,
        contentSub: `Chuyên khoa: ${specialty?.name}`,
        icon: <Iconify width={24} height={24} icon={"fontisto:doctor"} />,
        color: "info",
      },
      {
        title: "Xác nhận ngày giờ khám",
        content: `Ngày khám: ${date}`,
        contentSub: `Giờ khám: ${hourBooking?.time_start} - ${hourBooking?.time_end}`,
        icon: <Iconify width={24} height={24} icon={"ion:time-outline"} />,
        color: "warning",
      },
    ];
  }, [dateSelected, specialty, doctor, hourBooking, reason]);

  return (
    <Container maxWidth={"md"}>
      <Box>
        <Box border={({ palette }) => `1px dashed ${palette.grey[400]}`} my={3} p={3}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Vui lòng xem lại thông tin đặt khám
          </Alert>

          <Box
            flexDirection={"row"}
            display={"flex"}
            justifyContent={"space-between"}
            gap={5}
            mb={3}
          >
            <Box>
              <Typography variant="h6" mb={2}>
                Phòng khám HealthyCare
              </Typography>
              <Typography>Email: healthycare@gmail.com</Typography>
              <Typography>Số điện thoại: 0123456789</Typography>
              <Typography>Địa chỉ: Đại Học Cần Thơ</Typography>
            </Box>
            <Box>
              <Typography variant="h6" mb={2}>
                Thông tin bệnh nhân
              </Typography>
              <Typography>Tên bệnh nhân: {patientInfo?.display_name}</Typography>
              <Typography>Email: {patientInfo?.email}</Typography>
              <Typography>Số điện thoại: {patientInfo?.phone_number}</Typography>
            </Box>
          </Box>

          <Box>
            <Timeline
              sx={{
                p: 0,
                "& .css-1wdn2mv-MuiTypography-root-MuiTimelineOppositeContent-root": {
                  flex: 0.1,
                  p: 0,
                  textAlign: "left",
                },
                "& .css-kva70g-MuiTypography-root-MuiTimelineContent-root": {
                  maxWidth: "700px",
                },
                "& p.MuiTypography-root.MuiTypography-body1.css-1yrymlm-MuiTypography-root": {
                  wordWrap: "break-word",
                },
              }}
            >
              {arrConfirm.map((item, index) => (
                <TimelineItem
                  key={index}
                  sx={{
                    width: "100%",
                    justifyContent: "flex-start",
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <TimelineOppositeContent sx={{ m: "auto 0" }} variant="body2" textAlign={"left"}>
                    Bước {index + 1}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
                    <TimelineDot color={item.color as any}>{item.icon}</TimelineDot>
                    <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: "12px", px: 2 }}>
                    <Typography variant="h6" component="span">
                      {item.title}
                    </Typography>
                    <Typography>{item.content}</Typography>
                    <Typography>{item.contentSub}</Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Box>
        </Box>
      </Box>

      <Stack flexDirection={"row"} gap={2} justifyContent={"flex-end"}>
        <Button onClick={onBack} sx={{ minWidth: 120 }} variant="outlined" color="error">
          Trở về
        </Button>

        <Button
          onClick={onSubmit}
          sx={{ minWidth: 120, color: "white" }}
          variant="contained"
          color="success"
        >
          Đặt lịch
        </Button>
      </Stack>
    </Container>
  );
};

export default StepFourConfirm;
