import { Box, Button, Stack, Typography } from "@mui/material";
import { FC, useCallback, useEffect } from "react";
import { bookingActions, useBooking } from "~/features/booking";
import { doctorActions, useDoctors } from "~/features/doctor";
import { useAppDispatch } from "~/stores";
import DoctorItemCard from "../DoctorItemCard";
import SkeletonItemDoctor from "../SkeletonItemDoctor";
import { appActions } from "~/features/app";

type StepTwoSelectDoctorProps = {
  onBack?: () => void;
  onNext?: () => void;
};

const StepTwoSelectDoctor: FC<StepTwoSelectDoctorProps> = ({ onBack, onNext }) => {
  const { data, loading } = useDoctors();
  const { specialty, doctorId } = useBooking();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!specialty?.id) {
      onBack?.();
      return;
    }

    dispatch(doctorActions.getStart({ limit: 100, speciality_id: specialty?.id }));
  }, [specialty, onBack]);

  const handleNextStep = useCallback(() => {
    if (!doctorId) {
      dispatch(
        appActions.setSnackbar({ open: true, severity: "error", text: "Vui lòng chọn bác sĩ" })
      );
      return;
    }

    if (!onNext) return;

    onNext();
  }, [doctorId, onNext]);

  const handleOnChecked = useCallback((id: string) => {
    dispatch(bookingActions.setSelectedDoctor(id));
  }, []);

  return (
    <Box>
      <Stack flexDirection={"row"} flexWrap={"wrap"} gap={2} mb={2}>
        {loading === "pending"
          ? [...Array(5)].map((_, index) => <SkeletonItemDoctor key={index} />)
          : null}

        {loading !== "pending" ? (
          data.length ? (
            data.map((row) => <DoctorItemCard key={row.id} {...row} onChecked={handleOnChecked} />)
          ) : (
            <Typography>Không tìm thấy</Typography>
          )
        ) : null}
      </Stack>

      <Stack flexDirection={"row"} gap={2} justifyContent={"flex-end"}>
        <Button onClick={onBack} sx={{ minWidth: 120 }} variant="outlined" color="error">
          Trở về
        </Button>

        <Button
          onClick={handleNextStep}
          sx={{ minWidth: 120, color: "white" }}
          variant="contained"
          color="success"
        >
          Tiếp tục
        </Button>
      </Stack>
    </Box>
  );
};

export default StepTwoSelectDoctor;
