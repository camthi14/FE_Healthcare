import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  SelectChangeEvent,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { Iconify, NumericFormatCustom, SelectInput, TableCellOverride } from "~/components";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { appActions } from "~/features/app";
import { useOptionService, useServices } from "~/features/servicePack";
import { useOptionSubclinical, useSubclinicals } from "~/features/subclinical";
import { MainLayout } from "~/layouts";
import { ISubclinical, ServicePatientPayload } from "~/models";
import { useAppDispatch } from "~/stores";
import { ColumnTable } from "~/types";
import { fNumber } from "~/utils/formatNumber";
import { DialogServicePackSchema } from "../schemas/DialogServiceSchema";

const { Table } = MainLayout;

type DialogServicePackProps = {
  openAdd: boolean;
  initialValues: ServicePatientPayload;
  onSubmit?: (...args: any[]) => void;
};

const optionService = [
  { label: "Sử dụng gói khám", value: "service" },
  { label: "Sử dụng mẫu cận lâm sàng", value: "subclinical" },
];

const DialogServicePack: FC<DialogServicePackProps> = ({ initialValues, onSubmit, openAdd }) => {
  const dataService = useOptionService();
  const dataSubclinical = useOptionSubclinical();
  const { data } = useServices();
  const { data: dataSubs } = useSubclinicals();
  const lastInitialValues = useRef<ServicePatientPayload>(initialValues);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: DialogServicePackSchema,
    onSubmit(values, { resetForm }) {
      if (!onSubmit) return;
      onSubmit(values, resetForm);
    },
  });

  const columns = useMemo(
    (): ColumnTable[] => [
      {
        id: "STT",
        label: "STT",
        minWidth: 20,
        maxWidth: 20,
        styles: { padding: 0 },
        align: "center",
      },
      { id: "name", minWidth: 80, maxWidth: 200, label: "Tên dịch vụ / CLS" },
      {
        id: "delete",
        label: "Xoá CLS",
        align: "center",
        minWidth: 20,
        maxWidth: 20,
        styles: { padding: 0 },
      },
    ],
    []
  );

  const { handleSubmit, touched, getFieldProps, errors, values, setFieldValue, handleChange } =
    formik;

  useLayoutEffect(() => {
    lastInitialValues.current = values;
  }, [values]);

  const price = useMemo(() => {
    if (values.options !== "service" && !values.service_id) return "0";
    const priceData = data.find((d) => d.id === +values.service_id);
    return priceData?.price;
  }, [values, data]);

  const response = useMemo(() => {
    if (values.options !== "subclinical" || !values.service_id) return { price: 0, room: "" };
    const priceData = dataSubs.find((d) => d.id === +values.service_id);
    return { price: priceData?.price, room: priceData?.dataRoom?.name || "" };
  }, [dataSubs, values]);

  const onChangeOptions = useCallback(({ target: { value } }: SelectChangeEvent<unknown>) => {
    handleChange("options")(`${value}`);
    setFieldValue("service_id", "");
    setFieldValue("note", "");
    setFieldValue("data", null);
  }, []);

  const onChangeService = useCallback(
    ({ target: { value } }: SelectChangeEvent<unknown>) => {
      handleChange("service_id")(`${value}`);
      const service = data.find((t) => t.id === (value as number));
      setFieldValue("data", service?.subclinicalData || []);
    },
    [dataSubs, data]
  );

  const sum = useMemo(() => {
    const data: ISubclinical[] = [...(values.data || [])];
    const length = data.length;

    if (values.options === "service") {
      return { total: price as number, length };
    }

    const total = data.reduce((t, value) => (t += value.price), 0);
    return { total, length };
  }, [values, price]);

  const handleOnRemove = useCallback(
    (id: number) => {
      let data = [...(values.data || [])];
      data = [...data.filter((t) => t.id !== id)];
      setFieldValue("data", data);
    },
    [values]
  );

  const handleChangeSubclinical = useCallback(
    ({ target: { value } }: SelectChangeEvent<unknown>) => {
      handleChange("service_id")(`${value}`);

      const { data } = values;

      const subclinical: ISubclinical[] = [...(data || [])];

      if (!subclinical.length) {
        subclinical.push(dataSubs.find((d) => d.id === (value as number))!);
      } else {
        const sub = dataSubs.find((d) => d.id === (value as number));

        if (subclinical.find((d) => d.id === (value as number))) {
          return;
        }

        subclinical.push(sub!);
      }

      setFieldValue("note", "");
      setFieldValue("data", subclinical);
      dispatch(
        appActions.setSnackbar({
          open: true,
          text: "Thêm chỉ định thành công",
          severity: "success",
        })
      );
    },
    [values, dataSubs]
  );

  return (
    <FormikProvider value={formik}>
      <Dialog
        open={openAdd}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title" variant="h4">
          Chỉ định gói dịch vụ
        </DialogTitle>
        <DialogContent dividers sx={SCROLLBAR_CUSTOM}>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <Box border={({ palette }) => `1px dashed ${palette.grey[400]}`} p={3}>
              <Box pb={1}>
                <SelectInput
                  {...getFieldProps("options")}
                  onChange={onChangeOptions}
                  options={optionService}
                  label="Lựa chọn dịch vụ khám"
                  size="small"
                />
              </Box>

              {values.options === "service" ? (
                <Box>
                  {dataService.length ? (
                    <Grid container spacing={1} display={"flex"}>
                      <Grid item lg={4}>
                        <SelectInput
                          {...getFieldProps("service_id")}
                          onChange={onChangeService}
                          options={dataService}
                          label="Chọn gói khám"
                          size="small"
                          margin="none"
                          error={touched.service_id && Boolean(errors.service_id)}
                          helperText={touched.service_id && errors.service_id}
                        />
                      </Grid>

                      <Grid item lg={4}>
                        <TextField
                          disabled
                          margin="none"
                          size="small"
                          fullWidth
                          value={price}
                          label="Đơn giá"
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

                      <Grid item lg={4}>
                        <TextField
                          {...getFieldProps("quantity_perform")}
                          margin="none"
                          size="small"
                          fullWidth
                          disabled
                          label="Số lần thực hiện"
                          error={touched.quantity_perform && Boolean(errors.quantity_perform)}
                          helperText={touched.quantity_perform && errors.quantity_perform}
                        />
                      </Grid>
                    </Grid>
                  ) : null}

                  <Box mt={2}>
                    <TextField
                      margin="none"
                      size="small"
                      multiline
                      rows={3}
                      fullWidth
                      label="Ghi chú"
                      {...getFieldProps("note")}
                      error={touched.note && Boolean(errors.note)}
                      helperText={touched.note && errors.note}
                    />
                  </Box>
                </Box>
              ) : (
                <Grid container justifyItems={"center"} spacing={1}>
                  <Grid item lg={6}>
                    {dataSubclinical.length ? (
                      <SelectInput
                        options={dataSubclinical}
                        margin="none"
                        fullWidth
                        label="Chọn mẫu CLS"
                        placeholder="Chọn mẫu CLS"
                        size="small"
                        {...getFieldProps("service_id")}
                        onChange={handleChangeSubclinical}
                        error={touched.service_id && Boolean(errors.service_id)}
                        helperText={touched.service_id && errors.service_id}
                      />
                    ) : null}
                  </Grid>
                  <Grid item lg={6}>
                    <TextField
                      margin="none"
                      size="small"
                      fullWidth
                      label="Phòng thực hiện"
                      placeholder="VD: Phòng xét nghiệm"
                      disabled
                      value={response.room}
                    />
                  </Grid>
                  <Grid item lg={6}>
                    <TextField
                      margin="none"
                      size="small"
                      fullWidth
                      label="Đơn giá"
                      disabled
                      value={response.price}
                      InputProps={{
                        inputComponent: NumericFormatCustom as any,
                      }}
                    />
                  </Grid>
                  <Grid item lg={6}>
                    <TextField
                      margin="none"
                      size="small"
                      fullWidth
                      disabled
                      label="Số lần thực hiện"
                      {...getFieldProps("quantity_perform")}
                      error={touched.quantity_perform && Boolean(errors.quantity_perform)}
                      helperText={touched.quantity_perform && errors.quantity_perform}
                    />
                  </Grid>
                  <Grid item lg={12}>
                    <TextField
                      margin="none"
                      size="small"
                      multiline
                      rows={3}
                      fullWidth
                      label="Ghi chú"
                      {...getFieldProps("note")}
                      error={touched.note && Boolean(errors.note)}
                      helperText={touched.note && errors.note}
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
            <Box p={3}>
              <Typography variant="h6">Danh sách chỉ định</Typography>

              <Table columns={columns} sxTableContainer={{ mt: 2 }}>
                {values?.data?.length ? (
                  values.data.map((row, i) => (
                    <TableRow key={i}>
                      {columns.map((column) => {
                        const value = row[column.id as keyof ISubclinical];

                        if (column.id === "STT") {
                          return (
                            <TableCellOverride key={column.id} {...column}>
                              {i + 1}
                            </TableCellOverride>
                          );
                        }

                        if (column.id === "delete") {
                          if (values.options === "service")
                            return (
                              <TableCellOverride key={column.id} {...column}>
                                <span></span>
                              </TableCellOverride>
                            );
                          return (
                            <TableCellOverride key={column.id} {...column}>
                              <IconButton
                                color="error"
                                size="medium"
                                onClick={() => handleOnRemove(row.id!)}
                              >
                                <DeleteForeverIcon fontSize="inherit" />
                              </IconButton>
                            </TableCellOverride>
                          );
                        }

                        if (column.id === "name") {
                          return (
                            <TableCellOverride key={column.id} {...column}>
                              <Typography fontSize={14}>
                                {value as string} <b>{`(${row?.dataRoom?.name})`}</b>
                              </Typography>
                            </TableCellOverride>
                          );
                        }

                        return (
                          <TableCellOverride key={column.id} {...column}>
                            {column.format ? column.format(value as string) : (value as string)}
                          </TableCellOverride>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      Chưa có danh sách chỉ định
                    </TableCell>
                  </TableRow>
                )}
              </Table>

              <Box mt={1} textAlign={"end"}>
                <Typography>{`Tổng: ${sum.length} Gói dịch vụ`}</Typography>
                <Box display={"flex"} flexDirection={"row"} justifyContent={"end"}>
                  Số tiền:
                  <Typography color={"error"} px={1}>
                    {fNumber(sum.total)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box textAlign={"end"}>
              <LoadingButton sx={{ mb: 3, mr: 3 }} variant="contained" type="submit">
                <Iconify mr={1} width={23} height={23} icon={"bx:save"} />
                Lưu
              </LoadingButton>
            </Box>
          </Form>
        </DialogContent>
      </Dialog>
    </FormikProvider>
  );
};

export default DialogServicePack;
