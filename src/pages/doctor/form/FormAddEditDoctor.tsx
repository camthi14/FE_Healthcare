import { LoadingButton } from "@mui/lab";
import { CardContent, Grid, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback } from "react";
import { InputSecure, SelectInput, UploadAvatar } from "~/components";
import { useOptionDepartment } from "~/features/department";
import { useDoctors } from "~/features/doctor";
import { useOptionPosition } from "~/features/position";
import { useOptionQualification } from "~/features/qualification";
import { useOptionSpecialty } from "~/features/specialty";
import { MainLayout } from "~/layouts";
import { DoctorPayloadAdd } from "~/models";
import { addEditDoctorSchema } from "../schemas/AddEditDoctorSchema";

const { Card } = MainLayout;

type FormAddEditDoctorProps = {
  initialValues: DoctorPayloadAdd;
  isEditMode?: boolean;
  textBtn: string;
  defaultImage?: string;
  onSubmit?: (...args: any[]) => void;
};

const dataRadio = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
];

const FormAddEditDoctor: FC<FormAddEditDoctorProps> = ({
  initialValues,
  isEditMode,
  textBtn,
  defaultImage,
  onSubmit,
}) => {
  const dataPositionOptions = useOptionPosition();
  const dataDepartmentOptions = useOptionDepartment();
  const dataQualificationOptions = useOptionQualification();
  const dataSpecialtyOptions = useOptionSpecialty();
  const { loading } = useDoctors();

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: addEditDoctorSchema(isEditMode!),
    onSubmit: (values, { resetForm }) => {
      if (!onSubmit) return;
      onSubmit?.(values, resetForm);
    },
  });

  const { errors, touched, handleSubmit, values, getFieldProps, setFieldValue } = formik;

  const handleChangeAvatar = useCallback(async (file: File) => {
    await setFieldValue("photo", file);
  }, []);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item lg={4}>
            <Card
              sx={{
                height: "100%",
                width: "100%",
              }}
            >
              <CardContent
                sx={{
                  height: "inherit",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <UploadAvatar defaultImage={defaultImage} onChange={handleChangeAvatar} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={8}>
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
                    label="Tên của bác sĩ"
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
                    label="Email"
                    placeholder="VD: nhanvienA@gmail.com"
                    {...getFieldProps("email")}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>

                <Grid item lg={6}>
                  <TextField
                    fullWidth
                    label="Tài khoản"
                    placeholder="VD: nhanvienA"
                    {...getFieldProps("username")}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                    disabled={isEditMode}
                  />
                </Grid>

                <Grid item lg={6}>
                  <InputSecure
                    fullWidth
                    label="Mật khẩu"
                    placeholder="Nhập mật khẩu"
                    {...getFieldProps("password")}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    disabled={isEditMode}
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
                  {dataQualificationOptions.length ? (
                    <SelectInput
                      margin="none"
                      {...getFieldProps("qualified_doctor_id")}
                      options={dataQualificationOptions}
                      label="Trình độ"
                      placeholder="Chọn trình độ"
                      error={touched.qualified_doctor_id && Boolean(errors.qualified_doctor_id)}
                      helperText={touched.qualified_doctor_id && errors.qualified_doctor_id}
                    />
                  ) : null}
                </Grid>
                <Grid item lg={6}>
                  {dataSpecialtyOptions.length ? (
                    <SelectInput
                      margin="none"
                      {...getFieldProps("speciality_id")}
                      options={dataSpecialtyOptions}
                      label="Chuyên khoa"
                      placeholder="Chọn chuyên khoa"
                      error={touched.speciality_id && Boolean(errors.speciality_id)}
                      helperText={touched.speciality_id && errors.speciality_id}
                    />
                  ) : null}
                </Grid>

                {/* <Grid item lg={6}>
                  {optionsRoles && optionsRoles.length ? (
                    <FormSelectChangeRole
                      error={touched.roles && Boolean(errors.roles)}
                      helperText={touched.roles && (errors.roles as string)}
                      sizeLarge
                      options={optionsRoles}
                      value={values}
                      onChange={handleChangeValues}
                    />
                  ) : null}
                </Grid> */}

                <Grid item lg={6}>
                  {dataDepartmentOptions.length ? (
                    <SelectInput
                      margin="none"
                      {...getFieldProps("department_id")}
                      options={dataDepartmentOptions}
                      label="Bộ phận"
                      placeholder="Chọn bộ phận"
                      error={touched.department_id && Boolean(errors.department_id)}
                      helperText={touched.department_id && errors.department_id}
                    />
                  ) : null}
                </Grid>

                <Grid item lg={12}>
                  {dataPositionOptions.length ? (
                    <SelectInput
                      margin="none"
                      {...getFieldProps("position_id")}
                      options={dataPositionOptions}
                      label="Chức vụ"
                      placeholder="Chọn chức vụ"
                      error={touched.position_id && Boolean(errors.position_id)}
                      helperText={touched.position_id && errors.position_id}
                    />
                  ) : null}
                </Grid>

                <Grid item lg={12}>
                  <LoadingButton
                    type="submit"
                    size="medium"
                    loading={loading === "pending"}
                    disabled={loading === "pending"}
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    {textBtn}
                  </LoadingButton>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditDoctor;
