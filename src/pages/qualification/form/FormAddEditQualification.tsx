import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { IQualification } from "~/models";
import addEditQualificationSchema from "../schemas/AddEditQualificationSchema";

type FormAddEditQualificationProps = {
  initialValues: IQualification;
  textBtn: string;
  onSubmit?: (...args: any[]) => void;
};

const FormAddEditQualification: FC<FormAddEditQualificationProps> = ({
  initialValues,
  textBtn,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: addEditQualificationSchema,
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
          label="Tên trình độ của bác sĩ"
          placeholder="VD: Tiến sĩ"
          fullWidth
          margin="normal"
          {...getFieldProps("name")}
          error={Boolean(touched.name && errors.name)}
          helperText={touched.name && errors.name}
        />
        <TextField
          label="Kí tự viết tắt"
          placeholder="VD: TS"
          fullWidth
          margin="normal"
          {...getFieldProps("character")}
          error={Boolean(touched.character && errors.character)}
          helperText={touched.character && errors.character}
        />

        <LoadingButton sx={{ mt: 2 }} variant="contained" type="submit">
          {textBtn}
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditQualification;
