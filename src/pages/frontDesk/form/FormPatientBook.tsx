import { LoadingButton } from "@mui/lab";
import { Grid, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useEffect } from "react";
import { SelectInput } from "~/components";
import { useDoctors } from "~/features/doctor";
import { specialtyActions, useOptionSpecialty, useSpecialties } from "~/features/specialty";
import { MainLayout } from "~/layouts";
import { IPatientData } from "~/models";
import patientBookSchema from "../schemas/PatientBookSchema";
import { useAppDispatch } from "~/stores";

const { Card } = MainLayout;

type FormPatientBookProps = {
  initialValues: IPatientData;
  onSubmit?: (...args: any[]) => void;
};

const dataRadio = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
];

const PatientType = [
  { label: "Bệnh nhân bình thường", value: "Bệnh nhân bình thường" },
  { label: "Bệnh nhân cao tuổi", value: "Bệnh nhân cao tuổi" },
];

const FormPatientBook: FC<FormPatientBookProps> = ({ initialValues, onSubmit }) => {
  const dispatch = useAppDispatch();
  const { data: dataSpecialty, filters } = useSpecialties();
  const { loading } = useDoctors();

  useEffect(() => {
    dispatch(specialtyActions.getStart(filters));
  }, [filters]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: patientBookSchema,
    onSubmit: (values, { resetForm }) => {
      if (!onSubmit) return;
      onSubmit?.(values, resetForm);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Card sx={{ height: "100%" }}>
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
                  label="Tên bệnh nhân"
                  placeholder="VD: A"
                  {...getFieldProps("first_name")}
                  error={touched.first_name && Boolean(errors.first_name)}
                  helperText={touched.first_name && errors.first_name}
                />
              </Grid>
              <Grid item lg={6}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  placeholder="VD: A"
                  {...getFieldProps("address")}
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
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
              <Grid item lg={6}>
                <SelectInput
                  margin="none"
                  {...getFieldProps("patient_type_id")}
                  options={PatientType}
                  label="Loại bệnh nhân"
                  placeholder="Chọn loại bệnh nhân"
                  error={touched.patient_type_id && Boolean(errors.patient_type_id)}
                  helperText={touched.patient_type_id && errors.patient_type_id}
                />
              </Grid>

              {/* <Grid item lg={6}>
                {dataSpecialty.length ? (
                  <SelectInput
                    margin="none"
                    {...getFieldProps("id")}
                    options={dataSpecialty}
                    label="Chuyên khoa"
                    placeholder="Chọn chuyên khoa"
                    error={touched.id && Boolean(errors.id)}
                    helperText={touched.id && errors.id}
                  />
                ) : null}
              </Grid> */}

              <Grid item lg={12}>
                <LoadingButton
                  type="submit"
                  size="medium"
                  loading={loading === "pending"}
                  disabled={loading === "pending"}
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Đặt khám
                </LoadingButton>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Form>
    </FormikProvider>
  );
};

export default FormPatientBook;
