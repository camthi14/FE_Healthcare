import { Box } from "@mui/material";
import { FC, ReactElement, memo, useCallback, useEffect, useMemo, useState } from "react";
import { appActions } from "~/features/app";
import { useAccount } from "~/features/auth";
import { bookingActions, useBooking } from "~/features/booking";
import { doctorActions } from "~/features/doctor";
import { patientActions } from "~/features/patient";
import { scheduleDoctorActions } from "~/features/scheduleDoctor";
import { specialtyActions } from "~/features/specialty";
import { MainLayout } from "~/layouts";
import { BookingDesktopPayload, StepOnBasicState } from "~/models";
import { useAppDispatch } from "~/stores";
import { FORMAT_DATE_SQL } from "~/utils/formatTime";
import StepperPatientBooking from "./components/StepperPatientBooking";
import {
  StepFourConfirm,
  StepOneBasic,
  StepThreeSelectTime,
  StepTwoSelectDoctor,
} from "./components/Steps";

const { Head, Container } = MainLayout;

const steps = ["Khai báo cơ bản", "Chọn bác sĩ", "Chọn thời gian", "Xác nhận"];

const PatientBookPage: FC = () => {
  const dispatch = useAppDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const { patient, reason, specialty, isReExamination, dateSelected, doctorId, hourId, order } =
    useBooking();
  const user = useAccount();

  const initialValuesStepOne = useMemo((): StepOnBasicState => {
    if (patient && reason && specialty)
      return {
        patient,
        reason,
        specialty,
        isReExamination,
      };

    return {
      reason: "",
      patient: null,
      specialty: null,
      isReExamination: false,
    };
  }, [patient, reason, specialty, isReExamination]);

  useEffect(() => {
    const filters = { limit: 100, page: 1 };
    dispatch(doctorActions.getStart(filters));
    dispatch(specialtyActions.getStart(filters));
    dispatch(scheduleDoctorActions.getStart(filters));
    dispatch(patientActions.getStart(filters));

    return () => {
      dispatch(bookingActions.setReset());
    };
  }, []);

  const onBackStep = useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);

  const onNextStep = useCallback(() => {
    setActiveStep((prev) => prev + 1);
  }, []);

  const handleNextStepTwo = useCallback((values: StepOnBasicState) => {
    dispatch(bookingActions.setStepOne({ ...values }));
    onNextStep();
  }, []);

  const handleSubmitStepFourConfirm = useCallback(() => {
    if (!patient?.id || !doctorId || !hourId || order === -1) {
      setActiveStep(0);
      return;
    }

    const data: BookingDesktopPayload = {
      date: dateSelected.format(FORMAT_DATE_SQL),
      doctorId,
      specialtyId: `${specialty?.id!}`,
      employeeId: user?.id as string,
      hourId,
      isReExamination,
      patientId: patient.id,
      reason,
      order,
    };

    dispatch(bookingActions.bookingDesktopStart(data));
    dispatch(appActions.setOpenBackdrop());
  }, [patient, reason, order, isReExamination, dateSelected, doctorId, hourId, user]);

  const components: Record<string, ReactElement> = {
    0: <StepOneBasic initialValues={initialValuesStepOne} onSubmit={handleNextStepTwo} />,
    1: <StepTwoSelectDoctor onBack={onBackStep} onNext={onNextStep} />,
    2: <StepThreeSelectTime onBack={onBackStep} onNext={onNextStep} />,
    3: <StepFourConfirm onBack={onBackStep} onSubmit={handleSubmitStepFourConfirm} />,
  };

  return (
    <Box>
      <Head title="Đăng ký khám cho bệnh nhân" />
      <Container maxWidth="xl">
        <Box mt={5}>
          <StepperPatientBooking steps={steps} activeStep={activeStep} />

          <Container maxWidth="lg" sx={{ mt: 5 }}>
            {components[activeStep]}
          </Container>
        </Box>
      </Container>
    </Box>
  );
};

export default memo(PatientBookPage);
