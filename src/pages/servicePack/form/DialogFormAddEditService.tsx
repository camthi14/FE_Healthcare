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
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useEffect, useRef } from "react";
import {
  NumericFormatCustom,
  SelectInput,
  SelectInputAutoComplete,
  UploadAvatar,
} from "~/components";
import { UploadAvatarRefProps } from "~/components/shared/form/UploadAvatar";
import { FlexCenter } from "~/constants";
import { useSnackbar } from "~/features/app";
import { useServices } from "~/features/servicePack";
import { useOptionServiceType } from "~/features/serviceType";
import { ISubclinical, ServicePayloadAdd } from "~/models";
import { addEditServiceSchema } from "../schemas/AddEditServiceSchema";
import { useSubclinicals } from "~/features/subclinical";

type FormAddEditServiceProps = {
  title: string;
  openAdd: boolean;
  onClose: () => void;
  initialValues: ServicePayloadAdd;
  textBtn: string;
  defaultImage?: string;
  onSubmit?: (...args: any[]) => void;
};

const DialogFormAddEditService: FC<FormAddEditServiceProps> = ({
  initialValues,
  textBtn,
  onSubmit,
  openAdd,
  onClose,
  title,
  defaultImage,
}) => {
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: addEditServiceSchema,
    onSubmit(values, { resetForm }) {
      if (!onSubmit) return;
      onSubmit(values, resetForm);
    },
  });

  const { loading } = useServices();
  const { severity } = useSnackbar();
  const { data } = useSubclinicals();

  const imageRef = useRef<UploadAvatarRefProps | null>(null);
  const dataServiceTypeOptions = useOptionServiceType();

  const { handleSubmit, errors, values, touched, getFieldProps, setFieldValue } = formik;

  const handleChangeImage = useCallback(async (file: File) => {
    await setFieldValue("photo", file);
  }, []);

  useEffect(() => {
    if (severity !== "success" || !imageRef.current) return;

    imageRef.current.clearState();
  }, [severity]);

  const onChangeCLS = useCallback((value: ISubclinical[]) => {
    setFieldValue("subclinical", value);

    if (value?.length) {
      const price = value.reduce((total, v) => (total += v.price), 0);
      setFieldValue("price", price);
    } else {
      setFieldValue("price", 0);
    }
  }, []);

  return (
    <Dialog
      open={openAdd}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" textAlign={"center"} variant="h4">
        {title}
      </DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <Grid
              container
              spacing={2}
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid item lg={12}>
                <Box sx={{ ...FlexCenter, mb: 3 }}>
                  <UploadAvatar
                    ref={imageRef}
                    defaultImage={defaultImage}
                    onChange={handleChangeImage}
                  />
                </Box>
              </Grid>
              <Grid item lg={6}>
                <TextField
                  label="Tên gói khám"
                  placeholder="VD: Gói khám tổng quát"
                  fullWidth
                  margin="none"
                  {...getFieldProps("name")}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid item lg={6}>
                <TextField
                  label="Giá gói khám"
                  placeholder="VD: 1000"
                  fullWidth
                  margin="none"
                  {...getFieldProps("price")}
                  error={Boolean(touched.price && errors.price)}
                  helperText={touched.price && errors.price}
                  InputProps={{
                    inputComponent: NumericFormatCustom as any,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography fontSize={14} fontWeight={700}>
                          VNĐ
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item lg={12}>
                {dataServiceTypeOptions?.length ? (
                  <SelectInput
                    {...getFieldProps("service_type_id")}
                    options={dataServiceTypeOptions}
                    label="Loại gói khám"
                    placeholder="Chọn gói khám"
                    error={touched.service_type_id && Boolean(errors.service_type_id)}
                    helperText={touched.service_type_id && errors.service_type_id}
                  />
                ) : null}
              </Grid>

              <Grid item lg={12}>
                <SelectInputAutoComplete
                  multiple
                  options={data}
                  keyOption={"name"}
                  label={"Cận lâm sàn"}
                  value={values.subclinical ?? []}
                  onChange={onChangeCLS}
                  error={touched.subclinical && Boolean(errors.subclinical)}
                  helperText={touched.subclinical && errors.subclinical}
                />
              </Grid>

              <Grid item lg={12}>
                <TextField
                  multiline
                  rows={3}
                  label="Mô tả gói khám"
                  placeholder="VD: Mô tả"
                  fullWidth
                  margin="none"
                  {...getFieldProps("desc")}
                  error={Boolean(touched.desc && errors.desc)}
                  helperText={touched.desc && errors.desc}
                />
              </Grid>
              <Grid item lg={12}>
                <TextField
                  multiline
                  rows={10}
                  label="Nội dung gói khám"
                  placeholder="VD: Nội dung"
                  fullWidth
                  margin="none"
                  {...getFieldProps("content")}
                  error={Boolean(touched.content && errors.content)}
                  helperText={touched.content && errors.content}
                />
              </Grid>

              <Grid item lg={12}>
                <LoadingButton
                  sx={{ mt: 2 }}
                  loading={loading === "pending"}
                  disabled={loading === "pending"}
                  variant="contained"
                  type="submit"
                >
                  {textBtn}
                </LoadingButton>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
};

export default DialogFormAddEditService;
