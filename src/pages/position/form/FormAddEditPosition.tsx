import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { IPosition } from "~/models";
import addEditPositionSchema from "../schemas/AddEditPositionSchema";

type FormAddEditPositionProps = {
  initialValues: IPosition;
  textBtn: string;
  onSubmit?: (...args: any[]) => void;
};

const FormAddEditPosition: FC<FormAddEditPositionProps> = ({
  initialValues,
  textBtn,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: addEditPositionSchema,
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
          label="Tên chức vụ"
          placeholder="VD: Chăm sóc khách hàng"
          fullWidth
          margin="normal"
          {...getFieldProps("name")}
          error={Boolean(touched.name && errors.name)}
          helperText={touched.name && errors.name}
        />
        <TextField
          multiline
          rows={3}
          label="Mô tả chức vụ"
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

export default FormAddEditPosition;
