import { LoadingButton } from "@mui/lab";
import { Box, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useEffect, useRef } from "react";
import { SelectInput, UploadAvatar } from "~/components";
import { UploadAvatarRefProps } from "~/components/shared/form/UploadAvatar";
import { FlexCenter } from "~/constants";
import { useSnackbar } from "~/features/app";
import { useEquipments } from "~/features/equipment";
import { useOptionEquipmentType } from "~/features/equipmentType";
import { IEquipment } from "~/models";
import { addEditEquipmentSchema } from "../schemas/AddEditEquipmentSchema";

type FormAddEditEquipmentProps = {
  initialValues: IEquipment;
  textBtn: string;
  isEditMode?: boolean;
  defaultImage?: string;
  onSubmit?: (...args: any[]) => void;
};

const FormAddEditEquipment: FC<FormAddEditEquipmentProps> = ({
  initialValues,
  textBtn,
  defaultImage,
  isEditMode,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: addEditEquipmentSchema(isEditMode!),
    onSubmit(values, { resetForm }) {
      if (!onSubmit) return;
      onSubmit(values, resetForm);
    },
  });
  const { loading } = useEquipments();
  const { severity } = useSnackbar();
  const imageRef = useRef<UploadAvatarRefProps | null>(null);
  const dataEquipmentTypeOptions = useOptionEquipmentType();

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
          label="Tên vật tư y tế"
          placeholder="VD: Máy đo loãng xương"
          fullWidth
          margin="normal"
          {...getFieldProps("name")}
          error={Boolean(touched.name && errors.name)}
          helperText={touched.name && errors.name}
        />
        {dataEquipmentTypeOptions.length ? (
          <SelectInput
            {...getFieldProps("equipment_type_id")}
            options={dataEquipmentTypeOptions}
            label="Loại vật tư y tế"
            placeholder="Chọn vật tư y tế"
            error={touched.equipment_type_id && Boolean(errors.equipment_type_id)}
            helperText={touched.equipment_type_id && errors.equipment_type_id}
          />
        ) : null}
        <TextField
          multiline
          rows={3}
          label="Mô tả vật tư y tế"
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

export default FormAddEditEquipment;
