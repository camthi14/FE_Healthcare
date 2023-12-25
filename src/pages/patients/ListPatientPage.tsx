import { Alert, Paper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { FC, useCallback, useEffect, useState } from "react";
import { LazyLoadImage } from "~/components";
import { Colors } from "~/constants";
import { appActions } from "~/features/app";
import { useAccount } from "~/features/auth";
import { doctorActions, useDoctors } from "~/features/doctor";
import { patientActions } from "~/features/patient";
import { MainLayout } from "~/layouts";
import { IPatientData } from "~/models";
import { useAppDispatch } from "~/stores";
import { calcAge } from "~/utils/common";
import SkeletonPatient from "./SkeletonPatient";
import DialogHistoryBooking from "./component/DialogHistoryBooking";
import avt1 from "~/assets/image/avt1.jpg";

const { Container, Head, Title } = MainLayout;

type ListPatientPageProps = {};

const ListPatientPage: FC<ListPatientPageProps> = () => {
  const {
    screenListPatients: { data, isLoading, filters },
  } = useDoctors();
  const doctor = useAccount();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!doctor) return;

    dispatch(doctorActions.getPatientsStart({ limit: 9999, doctorId: String(doctor.id) }));
  }, [doctor, filters]);

  const handleOpenHistory = (patient: IPatientData) => {
    dispatch(patientActions.setSelectedPatient(patient));
    setOpen(true);
    dispatch(appActions.setOpenBackdrop());
    dispatch(patientActions.getHistoryExaminationStart({ patientId: String(patient.id) }));
  };

  const handleClose = useCallback(() => {
    setOpen(false);
    dispatch(patientActions.setSelectedPatient(null));
  }, []);

  return (
    <MainLayout>
      <Head title="Danh sách bệnh nhân đã khám" />

      {open ? <DialogHistoryBooking onOpen={open} onClose={handleClose} /> : null}

      <Container maxWidth="xl">
        {/* <Title title="Danh sách bệnh nhân đã khám" /> */}

        <Stack flexDirection={"row"} flexWrap={"wrap"} gap={1}>
          {isLoading === "pending" ? (
            [...Array(5)].map((_, index) => <SkeletonPatient key={index} />)
          ) : data.length ? (
            data.map((patient, index) => {
              const birthDate = patient?.infoData?.birth_date
                ? dayjs(patient?.infoData?.birth_date)
                : null;

              const birthDateRender = birthDate
                ? `${birthDate.format("DD/MM/YYYY")} (${calcAge(birthDate.toDate())} tuổi)`
                : "Chưa có thông tin";

              return (
                <Stack
                  sx={{
                    transition: "all 0.25s ease-in-out",
                    "&:hover": {
                      background: Colors.blueLight,
                    },
                  }}
                  component={Paper}
                  key={index}
                  elevation={3}
                  maxWidth={300}
                  p={2}
                  onClick={() => handleOpenHistory(patient)}
                >
                  <Stack alignItems={"center"}>
                    <LazyLoadImage
                      src={patient?.photo || avt1}
                      sxBox={{ width: 100, height: 100, borderRadius: "100%" }}
                      sxImage={{ width: 100, height: 100, borderRadius: "100%" }}
                    />
                  </Stack>

                  <Stack mt={2} gap={0.6}>
                    <Typography fontWeight={700}>{patient.display_name}</Typography>
                    <Typography fontWeight={500}>{birthDateRender}</Typography>
                    <Typography fontWeight={700}>
                      {patient.phone_number || "Không có thông tin"}
                    </Typography>
                    <Typography fontWeight={500}>
                      {patient.infoData?.address || "Không có thông tin"}
                    </Typography>

                    <Typography
                      fontSize={14}
                      fontWeight={500}
                    >{`Loại bệnh nhân: ${patient?.patientType?.name}`}</Typography>

                    <Typography fontWeight={500} fontSize={14}>{`Ngày đặt gần nhất: ${dayjs(
                      patient?.lastCurrent
                    ).format("DD/MM/YYYY HH:mm")}`}</Typography>
                  </Stack>
                </Stack>
              );
            })
          ) : (
            <Stack width={"100%"}>
              <Alert color="info">Chưa có bệnh nhân nào</Alert>
            </Stack>
          )}
        </Stack>
      </Container>
    </MainLayout>
  );
};

export default ListPatientPage;
