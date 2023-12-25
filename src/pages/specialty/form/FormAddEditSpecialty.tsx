import { LoadingButton } from "@mui/lab";
import { Box, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useEffect, useRef } from "react";
import { UploadAvatar } from "~/components";
import { UploadAvatarRefProps } from "~/components/shared/form/UploadAvatar";
import { FlexCenter } from "~/constants";
import { useSnackbar } from "~/features/app";
import { useSpecialties } from "~/features/specialty";
import { ISpecialty } from "~/models";
import { addEditSpecialtySchema } from "../schemas/AddEditSpecialtySchema";

type FormAddEditSpecialtyProps = {
  initialValues: ISpecialty;
  textBtn: string;
  isEditMode?: boolean;
  defaultImage?: string;
  onSubmit?: (...args: any[]) => void;
};

const FormAddEditSpecialty: FC<FormAddEditSpecialtyProps> = ({
  initialValues,
  textBtn,
  isEditMode,
  defaultImage,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: addEditSpecialtySchema(isEditMode!),
    onSubmit(values, { resetForm }) {
      if (!onSubmit) return;
      onSubmit(values, resetForm);
    },
  });
  const { loading } = useSpecialties();
  const { severity } = useSnackbar();
  const imageRef = useRef<UploadAvatarRefProps | null>(null);

  const { handleSubmit, errors, touched, getFieldProps, setFieldValue } = formik;

  const handleChangeImage = useCallback(async (file: File) => {
    await setFieldValue("photo", file);
  }, []);

  useEffect(() => {
    if (severity !== "success" || !imageRef.current) return;

    imageRef.current.clearState();
  }, [severity]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <Box sx={{ ...FlexCenter }}>
          <UploadAvatar ref={imageRef} defaultImage={defaultImage} onChange={handleChangeImage} />
        </Box>

        <TextField
          label="Tên chuyên khoa"
          placeholder="VD: Thần kinh"
          fullWidth
          margin="normal"
          {...getFieldProps("name")}
          error={Boolean(touched.name && errors.name)}
          helperText={touched.name && errors.name}
        />
        <TextField
          label="Thời gian khám"
          placeholder="VD: 15"
          fullWidth
          margin="normal"
          {...getFieldProps("time_chekup_avg")}
          error={Boolean(touched.time_chekup_avg && errors.time_chekup_avg)}
          helperText={touched.time_chekup_avg && errors.time_chekup_avg}
        />
        <TextField
          label="Giá khám"
          fullWidth
          margin="normal"
          {...getFieldProps("price")}
          error={Boolean(touched.price && errors.price)}
          helperText={touched.price && errors.price}
        />
        <TextField
          multiline
          rows={3}
          label="Mô tả chuyên khoa"
          placeholder="VD: Mô tả"
          fullWidth
          margin="normal"
          {...getFieldProps("desc")}
          error={Boolean(touched.desc && errors.desc)}
          helperText={touched.desc && errors.desc}
        />

        <LoadingButton
          sx={{ mt: 2 }}
          loading={loading === "pending"}
          disabled={loading === "pending"}
          variant="contained"
          type="submit"
        >
          {textBtn}
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditSpecialty;
