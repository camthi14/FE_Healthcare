import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { IUnit } from "~/models";
import addEditUnitSchema from "../schemas/AddEditUnitSchema";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

type FormAddEditUnitProps = {
  initialValues: IUnit;
  textBtn: string;
  onSubmit?: (...args: any[]) => void;
};

const FormAddEditUnit: FC<FormAddEditUnitProps> = ({ initialValues, textBtn, onSubmit }) => {
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: addEditUnitSchema,
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
          label="Tên đơn vị"
          placeholder="VD: Viên"
          fullWidth
          margin="normal"
          {...getFieldProps("name")}
          error={Boolean(touched.name && errors.name)}
          helperText={touched.name && errors.name}
        />
        <TextField
          label="Kí tự đơn vị"
          placeholder="VD: V"
          fullWidth
          margin="normal"
          {...getFieldProps("character")}
          error={Boolean(touched.character && errors.character)}
          helperText={touched.character && errors.character}
        />
        <TextField
          multiline
          rows={3}
          label="Mô tả đơn vị"
          placeholder="VD: Viên"
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

export default FormAddEditUnit;
