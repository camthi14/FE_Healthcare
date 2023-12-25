import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import DoneIcon from "@mui/icons-material/Done";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HourglassDisabledIcon from "@mui/icons-material/HourglassDisabled";
import { Box, Stack, Typography } from "@mui/material";
import { FC } from "react";
import CalendarSchedules, { CalendarPropsSchedules } from "./CalendarSchedules";

type CalendarLayoutProps = {} & CalendarPropsSchedules;

const CalendarLayout: FC<CalendarLayoutProps> = (props) => {
  return (
    <Box mt={2}>
      <Stack flexDirection={"row"} justifyContent={"flex-end"} gap={4} mt={2} mb={1}>
        <Stack flexDirection={"row"} gap={0.5} alignItems={"center"} fontSize={18}>
          <DoneIcon fontSize="inherit" color="primary" />
          <Typography fontSize={14} color={(theme) => theme.palette.primary.main} fontWeight={700}>
            Lịch có sẵn
          </Typography>
        </Stack>
        <Stack flexDirection={"row"} gap={0.5} alignItems={"center"} fontSize={14}>
          <DoNotDisturbIcon fontSize="inherit" color="disabled" />
          <Typography fontSize={14} color={(theme) => theme.palette.grey[500]} fontWeight={700}>
            Lịch không có sẵn
          </Typography>
        </Stack>
        <Stack flexDirection={"row"} gap={0.5} alignItems={"center"} fontSize={14}>
          <HourglassDisabledIcon fontSize="inherit" color="error" />
          <Typography fontSize={14} color={(theme) => theme.palette.error.main} fontWeight={700}>
            Lịch đã bị hủy
          </Typography>
        </Stack>
        <Stack flexDirection={"row"} gap={0.5} alignItems={"center"} fontSize={14}>
          <EventAvailableIcon fontSize="inherit" color="success" />
          <Typography fontSize={14} color={(theme) => theme.palette.success.main} fontWeight={700}>
            Lịch đã được đặt
          </Typography>
        </Stack>
      </Stack>
      <CalendarSchedules {...props} />
    </Box>
  );
};

export default CalendarLayout;
