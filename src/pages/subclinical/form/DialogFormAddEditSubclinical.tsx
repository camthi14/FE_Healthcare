import { LoadingButton } from "@mui/lab";
import { Dialog, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useEffect, useRef } from "react";
import { SelectInput } from "~/components";
import { UploadAvatarRefProps } from "~/components/shared/form/UploadAvatar";
import { useSnackbar } from "~/features/app";
import { useOptionRoom } from "~/features/room";
import { useOptionSubclinicalType } from "~/features/subclinicalType";
import { SubclinicalPayloadAdd } from "~/models";
import { addEditSubclinicalSchema } from "../schemas/AddEditSubclinicalSchema";

type FormAddEditSubclinicalProps = {
  title: string;
  openAdd: boolean;
  onClose: () => void;
  initialValues: SubclinicalPayloadAdd;
  textBtn: string;
  onSubmit?: (...args: any[]) => void;
  loading?: string;
};

const DialogFormAddEditSubclinical: FC<FormAddEditSubclinicalProps> = ({
  initialValues,
  textBtn,
  onSubmit,
  openAdd,
  onClose,
  title,
  loading,
}) => {
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: addEditSubclinicalSchema,
    onSubmit(values, { resetForm }) {
      if (!onSubmit) return;
      onSubmit(values, resetForm);
    },
  });
  const { severity } = useSnackbar();
  const imageRef = useRef<UploadAvatarRefProps | null>(null);
  const dataSubclinicalTypeOptions = useOptionSubclinicalType();
  const dataRoom = useOptionRoom();

  const { handleSubmit, errors, touched, getFieldProps } = formik;

  useEffect(() => {
    if (severity !== "success" || !imageRef.current) return;

    imageRef.current.clearState();
  }, [severity]);

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
              mt={2}
            >
              <Grid item lg={6}>
                <TextField
                  label="Tên mẫu cận lâm sàng"
                  placeholder="VD: mẫu cận lâm sàng tổng quát"
                  fullWidth
                  margin="none"
                  {...getFieldProps("name")}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid item lg={6}>
                <TextField
                  label="Giá mẫu cận lâm sàng"
                  placeholder="VD: 1000"
                  fullWidth
                  margin="none"
                  {...getFieldProps("price")}
                  error={Boolean(touched.price && errors.price)}
                  helperText={touched.price && errors.price}
                />
              </Grid>
              <Grid item lg={12}>
                {dataSubclinicalTypeOptions.length ? (
                  <SelectInput
                    {...getFieldProps("subclinical_type_id")}
                    options={dataSubclinicalTypeOptions}
                    label="Loại mẫu cận lâm sàng"
                    placeholder="Chọn mẫu cận lâm sàng"
                    error={touched.subclinical_type_id && Boolean(errors.subclinical_type_id)}
                    helperText={touched.subclinical_type_id && errors.subclinical_type_id}
                  />
                ) : null}
              </Grid>
              <Grid item lg={12}>
                {dataRoom.length ? (
                  <SelectInput
                    {...getFieldProps("room_id")}
                    options={dataRoom}
                    label="Chọn phòng thực hiện"
                    placeholder="Chọn phòng thực hiện"
                    error={touched.room_id && Boolean(errors.room_id)}
                    helperText={touched.room_id && errors.room_id}
                  />
                ) : null}
              </Grid>

              <Grid item lg={12}>
                <TextField
                  multiline
                  rows={3}
                  label="Mô tả mẫu cận lâm sàng"
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
                  label="Nội dung mẫu cận lâm sàng"
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

export default DialogFormAddEditSubclinical;
