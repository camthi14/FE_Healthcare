import { Alert, Box, Button, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useEffect, useMemo } from "react";
import { Iconify } from "~/components";
import { useAccount } from "~/features/auth";
import { useDoctors } from "~/features/doctor";
import { MainLayout } from "~/layouts";

import { appActions } from "~/features/app";
import { examinationCardActions, usePrescription } from "~/features/examinationCard";
import { CheckHealthyPatientPayload } from "~/models";
import { useAppDispatch } from "~/stores";
import { saveSchema } from "../../schemas/SaveSchema";

const { Head, Container } = MainLayout;

type Props = {};

const CheckHealthyPatient: FC<Props> = () => {
  // const [personName, setPersonName] = React.useState<string[]>([]);
  const {
    screenExamination: { patientActive, selectedExaminationId },
  } = useDoctors();
  const doctor = useAccount();
  const dispatch = useAppDispatch();
  const { selected } = usePrescription();

  useEffect(() => {
    if (!selectedExaminationId || !doctor) return;
    dispatch(
      examinationCardActions.prescriptionGetByExamCardIdStart({
        doctorId: String(doctor.id),
        examCardId: selectedExaminationId,
      })
    );
  }, [selectedExaminationId, doctor]);

  // const handleSelectDate = (event: SelectChangeEvent<typeof personName>) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setPersonName(typeof value === "string" ? value.split(",") : value);
  // };

  const initialValues = useMemo((): CheckHealthyPatientPayload => {
    if (!patientActive || !doctor || !selectedExaminationId)
      return {
        artery: 0,
        blood_pressure: 0,
        breathing_rate: 0,
        spO2: 0,
        temperature: 0,
        under_blood_pressure: 0,
        reason: "",
        doctor_id: "",
        exam_card_id: "",
        diagnosis: "",
        note: "",
      };

    const { examinationData, reason } = patientActive;

    return {
      ...examinationData,
      reason,
      doctor_id: String(doctor.id),
      exam_card_id: selectedExaminationId,
      diagnosis: selected?.diagnosis || "",
      note: selected?.note || "",
    };
  }, [patientActive, doctor, selectedExaminationId, selected]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: saveSchema,
    onSubmit(values) {
      console.log(values);
      if (!values.doctor_id || !values.exam_card_id) {
        dispatch(
          appActions.setSnackbar({ open: true, text: "Vui lòng chọn bệnh nhân", severity: "error" })
        );
        return;
      }

      dispatch(appActions.setOpenBackdrop());

      dispatch(
        examinationCardActions.addPrescriptionStart({
          data: {
            doctor_id: values.doctor_id,
            exam_card_id: values.exam_card_id,
            diagnosis: values.diagnosis,
            note: values.note,
          },
        })
      );
    },
  });

  const { getFieldProps, errors, handleSubmit, touched } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <Box>
          <Head title="Thông tin khám bệnh" />
          <Container maxWidth="xl">
            <Box border={({ palette }) => `1px dashed ${palette.grey[400]}`} p={2} m={1}>
              <Grid container spacing={2}>
                <Grid item lg={12} sx={{ mb: 1 }}>
                  <Alert severity="info">Thông tin chỉ số sinh tồn</Alert>
                </Grid>
                <Grid item lg={4} md={4} xs={6}>
                  <TextField
                    variant="standard"
                    {...getFieldProps("artery")}
                    disabled
                    size="small"
                    label="Mạch(Lần/phút)"
                  />
                </Grid>
                <Grid item lg={4} md={4} xs={6}>
                  <TextField
                    variant="standard"
                    {...getFieldProps("temperature")}
                    disabled
                    size="small"
                    label="Nhiệt độ(Độ C)"
                  />
                </Grid>
                <Grid item lg={4} md={4} xs={6}>
                  <TextField
                    variant="standard"
                    {...getFieldProps("spO2")}
                    disabled
                    size="small"
                    label="SpO2(%)"
                  />
                </Grid>
                <Grid item lg={4} md={4} xs={6}>
                  <TextField
                    variant="standard"
                    {...getFieldProps("breathing_rate")}
                    disabled
                    size="small"
                    label="Nhịp thở(Nhịp/phút)"
                  />
                </Grid>
                <Grid item lg={4} md={4} xs={6}>
                  <TextField
                    sx={{ p: 0 }}
                    disabled
                    size="small"
                    variant="standard"
                    label="Huyết áp(mmHg)"
                    {...getFieldProps("blood_pressure")}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <TextField
                            disabled
                            size="small"
                            variant="standard"
                            {...getFieldProps("under_blood_pressure")}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">/</InputAdornment>,
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box border={({ palette }) => `1px dashed ${palette.grey[400]}`} p={2} m={1}>
              <Grid container spacing={2}>
                <Grid item lg={12}>
                  <Alert severity="info">Thông tin khám của bác sĩ</Alert>
                </Grid>

                <Grid item lg={12}>
                  <Typography>Lý do khám</Typography>
                  <TextField
                    {...getFieldProps("reason")}
                    disabled
                    placeholder="VD: mệt mỏi, đau đầu"
                    fullWidth
                    size="small"
                  />
                </Grid>

                <Grid item lg={12}>
                  <Typography>Chẩn đoán</Typography>
                  <TextField
                    {...getFieldProps("diagnosis")}
                    error={touched.diagnosis && Boolean(errors.diagnosis)}
                    helperText={touched.diagnosis && errors.diagnosis}
                    fullWidth
                    size="small"
                    placeholder="Quá trình bệnh lý"
                  />
                </Grid>
                <Grid item lg={12}>
                  <Typography>Dặn dò</Typography>
                  <TextField
                    {...getFieldProps("note")}
                    error={touched.note && Boolean(errors.note)}
                    helperText={touched.note && errors.note}
                    fullWidth
                    size="small"
                    placeholder="Nhập"
                  />
                </Grid>

                {/* <Grid item lg={12} sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography>Hình thức tái khám:</Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Checkbox />
                      <Typography> Tái khám</Typography>
                    </Box>
                    <Typography sx={{ mx: 1 }}> |</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography>Tái khám sau</Typography>
                      <Box
                        sx={{
                          width: "30px",
                          height: "30px",
                          border: "1px solid #000",
                          borderRadius: "4px",
                          mx: 1,
                          ...FlexCenter,
                        }}
                      >
                        1
                      </Box>
                    </Box>
                    <Select
                      label="demo-multiple-name-label"
                      id="demo-multiple-name"
                      size="small"
                      value={personName}
                      onChange={handleSelectDate}
                      input={<OutlinedInput label="Name" />}
                      MenuProps={MenuProps}
                      sx={{
                        "& .css-1c5w2no-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                          {
                            padding: "4.5px 28px !important",
                          },
                      }}
                    >
                      {names.map((name, index) => (
                        <MenuItem
                          key={index}
                          value={name}
                          style={getStyles(name, personName, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Grid> */}
              </Grid>
            </Box>

            <Box textAlign={"end"} my={3}>
              {/* <Button variant="outlined" sx={{ mr: 1 }} color="error">
                Kết thúc và Lưu cuộc khám
              </Button> */}
              <Button type="submit" variant="contained" sx={{ mr: "4px" }}>
                <Iconify mr={1} width={23} height={23} icon={"bx:save"} />
                Lưu cuộc khám
              </Button>
            </Box>
          </Container>
        </Box>
      </Form>
    </FormikProvider>
  );
};

export default CheckHealthyPatient;
