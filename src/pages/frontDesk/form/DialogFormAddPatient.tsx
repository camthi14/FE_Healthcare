import { LoadingButton } from "@mui/lab";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { DateValidationError } from "@mui/x-date-pickers";
import { FieldChangeHandlerContext } from "@mui/x-date-pickers/internals";
import { Dayjs } from "dayjs";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useState } from "react";
import { SelectInput } from "~/components";
import DateFieldPicker from "~/components/shared/form/DateFieldPicker";
import { useOptionPatientType } from "~/features/patient";
import { PatientPayloadAdd } from "~/models";
import { calcAge } from "~/utils/common";
import { addPatientSchema } from "../schemas/AddPatientSchema";

type FormAddPatientProps = {
  openAdd: boolean;
  onClose: () => void;
  initialValues: PatientPayloadAdd;
  defaultImage?: string;
  onSubmit?: (...args: any[]) => void;
};

const dataRadio = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
];

const DialogFormAddPatient: FC<FormAddPatientProps> = ({
  initialValues,
  onSubmit,
  openAdd,
  onClose,
}) => {
  const patientTypeOptions = useOptionPatientType();
  const [value, setValue] = useState<Dayjs | null>(null);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: addPatientSchema,
    onSubmit(values, { resetForm }) {
      if (!onSubmit) return;
      onSubmit(values, resetForm);
    },
  });

  const { handleSubmit, errors, touched, getFieldProps, handleChange } = formik;

  const handleChangeDate = useCallback(
    (value: Dayjs | null, context: FieldChangeHandlerContext<DateValidationError>) => {
      setValue(value);

      if (!value || context.validationError) handleChange("birth_date")("");
      else handleChange("birth_date")(value.format("YYYY-MM-DD"));
    },
    []
  );

  return (
    <FormikProvider value={formik}>
      <Dialog
        open={openAdd}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" variant="h4">
          Thêm bệnh nhân
        </DialogTitle>
        <DialogContent>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <Box border={({ palette }) => `1px dashed ${palette.grey[400]}`} p={3}>
              <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Grid item lg={6}>
                  <TextField
                    fullWidth
                    label="Họ và chữ lót"
                    placeholder="VD: Nguyễn Văn"
                    {...getFieldProps("last_name")}
                    error={touched.last_name && Boolean(errors.last_name)}
                    helperText={touched.last_name && errors.last_name}
                  />
                </Grid>

                <Grid item lg={6}>
                  <TextField
                    fullWidth
                    label="Tên"
                    placeholder="VD: A"
                    {...getFieldProps("first_name")}
                    error={touched.first_name && Boolean(errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                  />
                </Grid>

                <Grid item lg={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    placeholder="VD: 0123456789"
                    {...getFieldProps("phone_number")}
                    error={touched.phone_number && Boolean(errors.phone_number)}
                    helperText={touched.phone_number && errors.phone_number}
                  />
                </Grid>

                <Grid item lg={6}>
                  <TextField
                    fullWidth
                    autoComplete="none"
                    aria-autocomplete="none"
                    label="Địa chỉ"
                    placeholder="VD: vinh long"
                    {...getFieldProps("address")}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Grid>

                <Grid item lg={12}>
                  <DateFieldPicker
                    onChange={handleChangeDate}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        error: touched.birth_date && Boolean(errors.birth_date),
                        helperText: touched.birth_date && errors.birth_date,
                      },
                    }}
                    value={value}
                    fullWidth
                    label="Ngày sinh"
                    margin="none"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography fontSize={14}>{`${
                            value && calcAge(value.toDate()) ? calcAge(value.toDate()) : 0
                          } tuổi`}</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item lg={12}>
                  <SelectInput
                    margin="none"
                    {...getFieldProps("gender")}
                    options={dataRadio}
                    label="Giới tính"
                    placeholder="Chọn giới tính"
                    error={touched.gender && Boolean(errors.gender)}
                    helperText={touched.gender && errors.gender}
                  />
                </Grid>

                <Grid item lg={12}>
                  <SelectInput
                    margin="none"
                    {...getFieldProps("patient_type_id")}
                    options={patientTypeOptions}
                    label="Loại bệnh nhân"
                    error={touched.patient_type_id && Boolean(errors.patient_type_id)}
                    helperText={touched.patient_type_id && errors.patient_type_id}
                  />
                </Grid>

                <Grid item lg={12}>
                  <Box textAlign={"end"}>
                    <LoadingButton
                      sx={{ mt: 2, mr: 2 }}
                      onClick={onClose}
                      variant="outlined"
                      color="error"
                    >
                      Huỷ bỏ
                    </LoadingButton>
                    <LoadingButton
                      sx={{ mt: 2 }}
                      // loading={loading === "pending"}
                      // disabled={loading === "pending"}
                      variant="contained"
                      type="submit"
                    >
                      Thêm mới
                    </LoadingButton>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Form>
        </DialogContent>
      </Dialog>
    </FormikProvider>
  );
};

export default DialogFormAddPatient;
