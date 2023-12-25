import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { IMedicineType } from "~/models";
import addEditMedicineTypeSchema from "../schemas/AddEditMedicineTypeSchema";

type FormAddEditMedicineTypeProps = {
  initialValues: IMedicineType;
  textBtn: string;
  onSubmit?: (...args: any[]) => void;
};

const FormAddEditMedicineType: FC<FormAddEditMedicineTypeProps> = ({
  initialValues,
  textBtn,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: addEditMedicineTypeSchema,
    onSubmit(values, { resetForm }) {
      if (!onSubmit) return;
      onSubmit(values, resetForm);
    },
  });

  const { handleSubmit, errors, touched, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <TextField
          label="Tên loại thuốc"
          placeholder="VD: thuốc"
          fullWidth
          margin="normal"
          {...getFieldProps("name")}
          error={Boolean(touched.name && errors.name)}
          helperText={touched.name && errors.name}
        />
        <TextField
          multiline
          rows={3}
          label="Mô tả loại thuốc"
          placeholder="VD: Mô tả"
          fullWidth
          margin="normal"
          {...getFieldProps("desc")}
          error={Boolean(touched.desc && errors.desc)}
          helperText={touched.desc && errors.desc}
        />

        <LoadingButton sx={{ mt: 2 }} variant="contained" type="submit">
          {textBtn}
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditMedicineType;
