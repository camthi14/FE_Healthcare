import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, memo, useCallback, useMemo } from "react";
import { SelectInputAutoComplete } from "~/components";
import { appActions } from "~/features/app";
import { patientActions, useOptionPatientBooking, usePatients } from "~/features/patient";
import { useOptionSpecialtyBooking } from "~/features/specialty";
import { PatientPayloadAdd, PatientSelect, SpecialtySelect, StepOnBasicState } from "~/models";
import { useAppDispatch } from "~/stores";
import DialogFormAddPatient from "../../form/DialogFormAddPatient";
import { StepOnBasicSchema } from "../../schemas/PatientBookSchema";

type StepOneBasicProps = {
  initialValues: StepOnBasicState;
  onSubmit?: (value: StepOnBasicState) => void;
};

const StepOneBasic: FC<StepOneBasicProps> = ({ initialValues, onSubmit }) => {
  const optionsSpecialty = useOptionSpecialtyBooking();
  const optionsPatient = useOptionPatientBooking();
  const { patientTypes } = usePatients();
  const dispatch = useAppDispatch();

  const fomirk = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: StepOnBasicSchema,
    onSubmit(values) {
      onSubmit?.(values);
    },
  });

  const { values, errors, touched, getFieldProps, setFieldValue, handleSubmit } = fomirk;

  const handleChangeSpecialty = useCallback(async (value: SpecialtySelect) => {
    await setFieldValue("specialty", value ?? null);
  }, []);

  const handleChangePatient = useCallback(async (value: PatientSelect) => {
    await setFieldValue("patient", value ?? null);
  }, []);

  const dataPatient = useMemo((): PatientPayloadAdd => {
    return {
      patient_type_id: "",
      phone_number: "",
      first_name: "",
      last_name: "",
      birth_date: "",
      address: "",
      gender: undefined,
    };
  }, []);

  const handleSubmitDialog = (values: PatientPayloadAdd, resetForm?: () => void) => {
    dispatch(appActions.setOpenBackdrop());
    dispatch(patientActions.addPatientDesktopStart({ data: values, resetForm: resetForm! }));
  };

  const handleDialogPatient = () => {
    dispatch(patientActions.setToggleOpenAddPatient(true));
  };

  const handleClose = () => {
    dispatch(patientActions.setToggleOpenAddPatient(false));
  };

  return (
    <Container maxWidth="sm">
      {patientTypes.open ? (
        <DialogFormAddPatient
          initialValues={dataPatient}
          onClose={handleClose}
          openAdd={patientTypes.open}
          onSubmit={handleSubmitDialog}
        />
      ) : null}

      <FormikProvider value={fomirk}>
        <Form noValidate onSubmit={handleSubmit}>
          <SelectInputAutoComplete
            key={"specialty"}
            disableCloseOnSelect={false}
            options={optionsSpecialty}
            keyOption="name"
            multiple={false}
            placeholder=""
            label="Chuyên khoa"
            value={values.specialty}
            onChange={handleChangeSpecialty}
            error={touched.specialty && Boolean(errors.specialty)}
            helperText={touched.specialty && errors.specialty}
          />

          <SelectInputAutoComplete
            key={"patient"}
            disableCloseOnSelect={false}
            options={optionsPatient}
            keyOption="displayName"
            multiple={false}
            placeholder=""
            label="Bệnh nhân"
            onChange={handleChangePatient}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleDialogPatient}>
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            }
            value={values.patient}
            error={touched.patient && Boolean(errors.patient)}
            helperText={touched.patient && errors.patient}
          />

          <TextField
            multiline
            rows={5}
            fullWidth
            margin="normal"
            label="Triệu chứng"
            {...getFieldProps("reason")}
            error={touched.reason && Boolean(errors.reason)}
            helperText={touched.reason && errors.reason}
          />

          <Stack
            alignItems={"flex-end"}
            mt={1}
            justifyContent={"space-between"}
            flexDirection={"row"}
          >
            <FormControlLabel
              control={
                <Switch
                  {...getFieldProps("isReExamination")}
                  checked={values.isReExamination}
                  color="success"
                />
              }
              label="Tái khám"
            />
            <Box>
              <Button
                type="submit"
                sx={{ minWidth: 120, color: "white" }}
                variant="contained"
                color="success"
              >
                Tiếp tục
              </Button>
            </Box>
          </Stack>
        </Form>
      </FormikProvider>
    </Container>
  );
};

export default memo(StepOneBasic);
