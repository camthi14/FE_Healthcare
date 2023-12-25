import { Box, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { FC, useMemo } from "react";
import { LazyLoadImage, SelectInput } from "~/components";
import { useDoctors } from "~/features/doctor";
import { useOptionPatientType } from "~/features/patient";
import { MainLayout } from "~/layouts";
import { PatientInfoNotModify } from "~/models";
import { fDateWithMoment } from "~/utils/formatTime";

const { Head, Container } = MainLayout;

const SPACING = 100;

const InfoPatient: FC = () => {
  const {
    screenExamination: { patientActive },
  } = useDoctors();
  const patientTypeOptions = useOptionPatientType();

  const initialValues = useMemo((): PatientInfoNotModify => {
    if (!patientActive)
      return {
        display_name: "",
        email: "",
        patient_type_id: "",
        phone_number: "",
        address: "",
        birth_date: "",
        id: "",
        reason: "",
      };

    const { patient, reason } = patientActive;

    return {
      display_name: patient.display_name || "",
      email: patient.email || "",
      patient_type_id: patient.patient_type_id || "",
      phone_number: patient.phone_number || "",
      address: patient.infoData?.address || "",
      birth_date: patient.infoData?.birth_date
        ? fDateWithMoment(new Date(patient.infoData?.birth_date))
        : "",
      id: patient.id!,
      reason: reason,
    };
  }, [patientActive]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit() {},
  });

  const { getFieldProps } = formik;

  return (
    <Box>
      <Head title="Thông tin bệnh nhân" />
      <Container maxWidth="xl">
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item lg={6} md={6} xs={12}>
            <SelectInput
              {...getFieldProps("patient_type_id")}
              disabled
              margin="none"
              size="small"
              options={patientTypeOptions}
              label="Đối tượng"
            />
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <TextField
              {...getFieldProps("id")}
              label="Mã BN"
              variant="outlined"
              sx={{ width: "100%" }}
              size="small"
              disabled
            />
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <TextField
              {...getFieldProps("display_name")}
              disabled
              label="Tên BN"
              variant="outlined"
              sx={{ width: "100%" }}
              size="small"
            />
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <TextField
              {...getFieldProps("email")}
              disabled
              label="E-mail"
              variant="outlined"
              sx={{ width: "100%" }}
              size="small"
            />
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <TextField
              {...getFieldProps("birth_date")}
              disabled
              label="Năm sinh"
              variant="outlined"
              sx={{ width: "100%" }}
              size="small"
            />
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <TextField
              {...getFieldProps("phone_number")}
              disabled
              label="Số điện thoại"
              variant="outlined"
              sx={{ width: "100%" }}
              size="small"
            />
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <TextField
              {...getFieldProps("address")}
              disabled
              label="Địa chỉ"
              variant="outlined"
              sx={{ width: "100%" }}
              size="small"
            />
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <TextField
              {...getFieldProps("reason")}
              disabled
              label="Lý do khám"
              variant="outlined"
              sx={{ width: "100%" }}
              size="small"
            />
          </Grid>

          <Grid item lg={12} md={12} xs={12}>
            <Stack mt={1} flexDirection={"row"} gap={0.5}>
              <Typography minWidth={80} fontSize={14}>
                Hình ảnh:
              </Typography>

              <Stack width={"100%"} flexWrap={"wrap"} flexDirection={"row"} gap={1}>
                {patientActive?.imageData?.length ? (
                  patientActive?.imageData?.map(({ url }, index) => (
                    <Stack
                      key={index}
                      sx={{ borderRadius: 2, overflow: "hidden" }}
                      component={Paper}
                      elevation={3}
                      position={"relative"}
                    >
                      <LazyLoadImage
                        src={url}
                        sxBox={{
                          width: SPACING,
                          height: SPACING,
                          borderRadius: 2,
                          transition: "all 0.25s ease-in-out",
                          "&:hover": { transform: "scale(1.2)" },
                        }}
                        sxImage={{
                          width: SPACING,
                          height: SPACING,
                          borderRadius: 2,
                        }}
                      />
                    </Stack>
                  ))
                ) : (
                  <Typography minWidth={80} fontSize={14}>
                    Không có hình ảnh
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InfoPatient;
