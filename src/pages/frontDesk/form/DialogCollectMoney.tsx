import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { ChangeEvent, FC, useCallback, useEffect, useMemo } from "react";
import { Iconify, NumericFormatCustom, TableCellOverride, Transition } from "~/components";
import { Background, SCROLLBAR_CUSTOM } from "~/constants";
import { appActions } from "~/features/app";
import { useAccount } from "~/features/auth";
import { frontDeskActions, useFrontDesk } from "~/features/frontDesk";
import { MainLayout } from "~/layouts";
import {
  GetPatientInformationPatient,
  IService,
  ISubclinical,
  PaymentServicePayload,
} from "~/models";
import { useAppDispatch } from "~/stores";
import { ColumnTable } from "~/types";
import { calcAge, convertGender } from "~/utils/common";
import { fNumber } from "~/utils/formatNumber";
import { fDateWithMoment } from "~/utils/formatTime";
import { dialogCollectMoneySchema } from "../schemas/DialogCollectMoneySchema";

const { Container, Table } = MainLayout;

type DialogCollectMoneyProps = {
  initialValues: GetPatientInformationPatient;
  onSubmit?: (values: PaymentServicePayload, resetForm?: () => void) => void;
  onClose?: () => void;
};

const DialogCollectMoney: FC<DialogCollectMoneyProps> = ({ onSubmit, onClose }) => {
  const { confirm, payment } = useFrontDesk();
  const dispatch = useAppDispatch();
  const user = useAccount();

  const columns = useMemo(
    (): ColumnTable[] => [
      { id: "STT", label: "STT", minWidth: 40, maxWidth: 40, align: "center" },
      { id: "name", label: "Tên gói dịch vụ / CLS", minWidth: 170 },
      {
        id: "price",
        label: "Đơn giá",
        minWidth: 100,
        maxWidth: 100,
        align: "center",
        format(value) {
          return fNumber(value);
        },
      },
      {
        id: "total",
        label: "Thành tiền",
        align: "center",
        minWidth: 100,
        maxWidth: 100,
        format(value) {
          return fNumber(value);
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (!confirm.bookingId) return;
    dispatch(appActions.setOpenBackdrop());
    dispatch(frontDeskActions.getPatientInformationPaymentStart(confirm.bookingId));
  }, [confirm]);

  const totalOld = useMemo(() => {
    if (!payment.data) return 0;

    const { booking, examinationCardDetails } = payment.data;

    const costExamTotalDetails = examinationCardDetails.reduce((t, v) => {
      if (v?.serviceData) return (t += v.serviceData.price);
      return (t += v.subclinicalData!.price);
    }, 0);

    return booking.price! + costExamTotalDetails;
  }, [payment]);

  const total = useMemo(() => {
    if (!payment.data) return 0;

    const { booking, examinationCardDetails, bill } = payment.data;

    const costExamTotalDetails = examinationCardDetails.reduce((t, v) => {
      if (v?.serviceData) return (t += v.serviceData.price);
      return (t += v.subclinicalData!.price);
    }, 0);

    return booking.price! + costExamTotalDetails - (bill.deposit || 0);
  }, [payment]);

  const tipPrices = useMemo(
    () =>
      (length: number, totalPrice: number, spacePrice: number = 50000) => {
        const results: number[] = [totalPrice];

        for (let index = 0; index < length; index++) {
          results.push((totalPrice += spacePrice));
        }

        return results;
      },
    []
  );

  const formik = useFormik({
    initialValues: { change: 0, price_received: 0 },
    enableReinitialize: true,
    validationSchema: dialogCollectMoneySchema(),
    onSubmit({ change, price_received }, { resetForm }) {
      let deposit: number = 0;

      price_received = Number(price_received);

      if (+change < 0) {
        deposit = +price_received;
      }

      if ((payment?.data?.bill?.deposit || 0) > 0) {
        const bill = payment.data?.bill;
        change = price_received + bill?.change!;
        price_received += bill?.price_received!;
      }

      const data: PaymentServicePayload = {
        bill_id: payment.data?.bill.id!,
        booking_id: payment.data?.booking.id!,
        change: Number(change),
        deposit: Number(deposit),
        price_received: Number(price_received),
        total: Number(total),
      };

      if (!onSubmit) return;
      onSubmit(data, resetForm);
    },
  });

  const { handleSubmit, touched, values, getFieldProps, errors, handleChange } = formik;

  const handleClick = useCallback(
    (value: number) => {
      handleChange("price_received")(`${value}`);
      handleChange("change")(`${value - total}`);
    },
    [total]
  );

  const handlePriceReceive = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = event;

      handleChange("price_received")(value);
      handleChange("change")(`${+value - total}`);
    },
    [total]
  );

  return (
    <FormikProvider value={formik}>
      <Dialog fullScreen open={payment.open} TransitionComponent={Transition} onClose={onClose}>
        <AppBar sx={{ position: "relative", background: "inherit" }}>
          <Toolbar>
            <Typography
              sx={{ ml: 2, flex: 1, color: "black" }}
              variant="h6"
              fontWeight={400}
              component="div"
            >
              Thu tiền bệnh nhân <strong>{`${confirm.displayName}`}</strong>
            </Typography>

            <Stack flexDirection={"row"} gap={1}>
              {/* <Button
                startIcon={
                  <Iconify mr={1} width={23} height={23} icon={"material-symbols:print"} />
                }
                variant="contained"
              >
                In bảng kê
              </Button> */}

              <Button
                startIcon={<Iconify mr={1} width={23} height={23} icon={"bx:save"} />}
                variant="contained"
                color="success"
                sx={{ color: "white" }}
                onClick={handleSubmit as () => void}
              >
                Thu tiền
              </Button>

              <IconButton onClick={onClose} edge="end" color="error" aria-label="close">
                <CloseIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>

        <DialogContent dividers sx={SCROLLBAR_CUSTOM}>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <Container maxWidth="xl">
              <Box border={({ palette }) => `1px dashed ${palette.grey[400]}`} my={3} p={3}>
                <Grid container>
                  <Grid item lg={5} md={6}>
                    <Stack gap={1}>
                      <Typography>
                        Mã BN: <b>{payment?.data?.patient?.id}</b>
                      </Typography>
                      <Typography>
                        Tên BN: <b>{payment?.data?.patient?.display_name}</b>
                      </Typography>
                      <Typography>
                        SĐT: <b>{payment?.data?.patient?.phone_number}</b>
                      </Typography>
                      <Typography>
                        Giới tính:{" "}
                        <b>{convertGender(payment?.data?.patient?.gender || "FEMALE")}</b>
                      </Typography>
                      <Typography>
                        Tuổi: <b>{calcAge(payment?.data?.patient?.birth_date || "")}</b>
                      </Typography>

                      <Typography>
                        Trạng thái:{" "}
                        <b>{confirm.typePatient === "new" ? "Bệnh nhân mới" : "Tái khám"}</b>
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item lg={7} md={6}>
                    <Box
                      border={({ palette }) => `1px dashed ${palette.grey[400]}`}
                      sx={{ background: Background.blueLight, p: 2 }}
                    >
                      <Typography sx={{ display: "flex", alignItems: "center", fontWeight: 700 }}>
                        <Iconify
                          mr={1}
                          width={23}
                          height={23}
                          icon={"streamline-emojis:hospital"}
                        />{" "}
                        Phòng khám HealthyCare
                      </Typography>
                      <Typography sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                        <Iconify
                          mr={1}
                          width={23}
                          height={23}
                          icon={
                            "streamline:money-cashier-shop-shopping-pay-payment-cashier-store-cash-register-machine"
                          }
                        />
                        Thu ngân: <b>{user?.display_name}</b>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Grid container spacing={1}>
                <Grid item lg={12}>
                  <Box border={({ palette }) => `1px dashed ${palette.grey[400]}`} p={3}>
                    <Typography variant="h6" mb={2}>
                      Thông tin phiếu thu ngày{" "}
                      {fDateWithMoment(new Date(), undefined, "DD/MM/YYYY")}
                    </Typography>

                    <Typography variant="h6">1. Phí khám</Typography>

                    <Box border={({ palette }) => `1px dashed ${palette.grey[400]}`}>
                      <Typography sx={{ background: Background.blueLight, p: 1 }}>
                        Khám tư vấn:{" "}
                        <strong style={{ color: "red", paddingLeft: "12px" }}>{`${fNumber(
                          payment?.data?.booking?.price || 0
                        )} VNĐ`}</strong>
                      </Typography>
                    </Box>
                    {payment?.data?.examinationCardDetails?.length ? (
                      <>
                        <Typography variant="h6" mt={2}>
                          2. Phí dịch vụ / CLS
                        </Typography>

                        <Table columns={columns} sxTableContainer={{ mt: 2 }}>
                          {payment?.data?.examinationCardDetails.map((row, i) => {
                            const { subclinicalData, serviceData } = row;

                            if (subclinicalData) {
                              return (
                                <TableRow key={i}>
                                  {columns.map((column) => {
                                    const value = subclinicalData[column.id as keyof ISubclinical];

                                    if (column.id === "STT") {
                                      return (
                                        <TableCellOverride {...column} key={column.id}>
                                          {i + 1}
                                        </TableCellOverride>
                                      );
                                    }

                                    if (column.id === "total") {
                                      return (
                                        <TableCellOverride {...column} key={column.id}>
                                          {column.format?.(subclinicalData.price!)}
                                        </TableCellOverride>
                                      );
                                    }

                                    return (
                                      <TableCellOverride {...column} key={column.id}>
                                        {column.format
                                          ? column.format(value as string)
                                          : (value as string)}
                                      </TableCellOverride>
                                    );
                                  })}
                                </TableRow>
                              );
                            }

                            return (
                              <TableRow key={i}>
                                {columns.map((column) => {
                                  const value = serviceData![column.id as keyof IService];

                                  if (column.id === "STT") {
                                    return (
                                      <TableCellOverride {...column} key={column.id}>
                                        {i + 1}
                                      </TableCellOverride>
                                    );
                                  }

                                  if (column.id === "total") {
                                    return (
                                      <TableCellOverride {...column} key={column.id}>
                                        {column.format?.(serviceData!.price!)}
                                      </TableCellOverride>
                                    );
                                  }

                                  return (
                                    <TableCellOverride {...column} key={column.id}>
                                      {column.format
                                        ? column.format(value as string)
                                        : (value as string)}
                                    </TableCellOverride>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                        </Table>
                      </>
                    ) : null}

                    <Stack
                      textAlign={"end"}
                      mt={2}
                      flexDirection={"column"}
                      alignItems={"flex-end"}
                    >
                      {(payment?.data?.bill?.deposit || 0) > 0 ? (
                        <Stack
                          borderBottom={(theme) => `1px solid ${theme.palette.grey[300]}`}
                          my={2}
                          pb={2}
                          gap={1}
                        >
                          <Typography>
                            Tổng tiền:
                            <strong style={{ color: "red", fontSize: 16 }}>
                              {` ${fNumber(totalOld)} VNĐ`}
                            </strong>
                          </Typography>

                          <Typography>
                            Tiền đã trả:
                            <strong style={{ color: "red", fontSize: 16 }}>
                              {` ${fNumber(payment?.data?.bill?.deposit || 0)} VNĐ`}
                            </strong>
                          </Typography>
                        </Stack>
                      ) : null}

                      <Typography>
                        Tổng tiền cần thanh toán:
                        <strong style={{ color: "red", fontSize: 20 }}>
                          {` ${fNumber(total)} VNĐ`}
                        </strong>
                      </Typography>

                      <Stack flexDirection={"row"} gap={1.6} my={1}>
                        <TextField
                          {...getFieldProps("price_received")}
                          onChange={handlePriceReceive}
                          id="outlined-basic"
                          label="Tiền BN đưa"
                          variant="outlined"
                          size="small"
                          margin="dense"
                          error={touched.price_received && Boolean(errors.price_received)}
                          helperText={touched.price_received && errors.price_received}
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

                        <TextField
                          {...getFieldProps("change")}
                          disabled
                          id="outlined-basic"
                          label={
                            values.price_received !== 0
                              ? values.price_received >= total
                                ? "Tiền thừa"
                                : "Tiền bệnh nhân nợ"
                              : ""
                          }
                          variant="outlined"
                          size="small"
                          margin="dense"
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
                      </Stack>

                      <Stack
                        mt={2}
                        direction="row"
                        justifyContent={"flex-end"}
                        spacing={1}
                        flexWrap={"wrap"}
                        gap={1}
                      >
                        {tipPrices(10, total, 4000).map((item, index) => (
                          <Chip
                            key={index}
                            label={fNumber(item)}
                            onClick={() => handleClick(item)}
                          />
                        ))}
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Form>
        </DialogContent>
      </Dialog>
    </FormikProvider>
  );
};

export default DialogCollectMoney;
