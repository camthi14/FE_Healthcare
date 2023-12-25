import { LoadingButton } from "@mui/lab";
import { Dialog, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useEffect } from "react";
import { SelectInput } from "~/components";
import { useSnackbar } from "~/features/app";
import { useOptionMedicineType } from "~/features/medicineType";
import { useOptionUnit } from "~/features/unit";
import { MedicinePayloadAdd } from "~/models";
import addEditMedicineSchema from "../schemas/AddEditMedicineSchema";

type FormAddEditMedicineProps = {
  title: string;
  openAdd: boolean;
  onClose: () => void;
  initialValues: MedicinePayloadAdd;
  textBtn: string;
  defaultImage?: string;
  onSubmit?: (...args: any[]) => void;
  loading: string;
};

const DialogFormAddEditMedicine: FC<FormAddEditMedicineProps> = ({
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
    validationSchema: addEditMedicineSchema,
    onSubmit(values, { resetForm }) {
      if (!onSubmit) return;
      onSubmit(values, resetForm);
    },
  });
  const { severity } = useSnackbar();
  const dataMedicineTypes = useOptionMedicineType();
  const dataUnit = useOptionUnit();

  const { handleSubmit, errors, touched, getFieldProps } = formik;

  useEffect(() => {
    if (severity !== "success") return;
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
            >
              <Grid item lg={6}>
                <TextField
                  label="Tên thuốc"
                  placeholder="VD: Panadol"
                  fullWidth
                  margin="normal"
                  {...getFieldProps("name")}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid item lg={6}>
                <TextField
                  label="Số lượng thuốc"
                  placeholder="VD: 200"
                  fullWidth
                  margin="normal"
                  {...getFieldProps("quantity")}
                  error={Boolean(touched.quantity && errors.quantity)}
                  helperText={touched.quantity && errors.quantity}
                />
              </Grid>
              <Grid item lg={6}>
                {dataMedicineTypes.length ? (
                  <SelectInput
                    {...getFieldProps("medictine_type_id")}
                    options={dataMedicineTypes}
                    label="Loại thuốc"
                    placeholder="Chọn loại thuốc"
                    error={touched.medictine_type_id && Boolean(errors.medictine_type_id)}
                    helperText={touched.medictine_type_id && errors.medictine_type_id}
                  />
                ) : null}
              </Grid>
              <Grid item lg={6}>
                {dataUnit.length ? (
                  <SelectInput
                    {...getFieldProps("unit_id")}
                    options={dataUnit}
                    label="Đơn vị thuốc"
                    placeholder="Chọn đơn vị thuốc"
                    error={touched.unit_id && Boolean(errors.unit_id)}
                    helperText={touched.unit_id && errors.unit_id}
                  />
                ) : null}
              </Grid>
              <Grid item lg={6}>
                <TextField
                  label="Giá thuốc"
                  placeholder="VD: 200"
                  fullWidth
                  margin="normal"
                  {...getFieldProps("price")}
                  error={Boolean(touched.price && errors.price)}
                  helperText={touched.price && errors.price}
                />
              </Grid>
              <Grid item lg={6}>
                <TextField
                  label="Giá thuốc bán"
                  placeholder="VD: 200"
                  fullWidth
                  margin="normal"
                  {...getFieldProps("price_sell")}
                  error={Boolean(touched.price_sell && errors.price_sell)}
                  helperText={touched.price_sell && errors.price_sell}
                />
              </Grid>
              <Grid item lg={6}>
                <TextField
                  label="Ngày sản xuất thuốc"
                  placeholder="VD: 200"
                  fullWidth
                  margin="normal"
                  {...getFieldProps("production_date")}
                  error={Boolean(touched.production_date && errors.production_date)}
                  helperText={touched.production_date && errors.production_date}
                />
              </Grid>
              <Grid item lg={6}>
                <TextField
                  label="Nồng độ thuốc"
                  placeholder="VD: 200"
                  fullWidth
                  margin="normal"
                  {...getFieldProps("drug_concentration")}
                  error={Boolean(touched.drug_concentration && errors.drug_concentration)}
                  helperText={touched.drug_concentration && errors.drug_concentration}
                />
              </Grid>
              <Grid item lg={6}>
                <TextField
                  label="Thành phần thuốc"
                  placeholder="VD: 200"
                  fullWidth
                  margin="normal"
                  {...getFieldProps("ingredients")}
                  error={Boolean(touched.ingredients && errors.ingredients)}
                  helperText={touched.ingredients && errors.ingredients}
                />
              </Grid>
              <Grid item lg={6}>
                <TextField
                  label="Hạn sử dụng thuốc"
                  placeholder="VD: 200"
                  fullWidth
                  margin="normal"
                  {...getFieldProps("expired_at")}
                  error={Boolean(touched.expired_at && errors.expired_at)}
                  helperText={touched.expired_at && errors.expired_at}
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

export default DialogFormAddEditMedicine;
