import {
  Alert,
  Box,
  Button,
  Grid,
  SelectChangeEvent,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { isToday } from "date-fns/esm";
import { Dayjs } from "dayjs";
import { FC, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { DatePicker, Loadable, SelectInput, TableCellOverride } from "~/components";
import { Background, Colors } from "~/constants";
import { appActions } from "~/features/app";
import { useAccount } from "~/features/auth";
import { bookingActions, useBooking } from "~/features/booking";
import { examinationCardActions } from "~/features/examinationCard";
import { frontDeskActions, useFrontDesk } from "~/features/frontDesk";
import { patientActions, useOptionPatient } from "~/features/patient";
import { serviceActions } from "~/features/servicePack";
import { subclinicalActions } from "~/features/subclinical";
import { MainLayout } from "~/layouts";
import {
  BookingTypePatient,
  ExaminationCardType,
  IBooking,
  PaymentServicePayload,
  ServicePatientPayload,
} from "~/models";
import { useAppDispatch } from "~/stores";
import { ColumnTable } from "~/types";
import {
  convertBookingStatus,
  convertPaymentStatus,
  handleCompareTimeWithCurrentTime,
} from "~/utils/common";
import { convertStatusBookingAtReceiveTab } from "~/utils/convert";
import { fDateWithMoment } from "~/utils/formatTime";

const { Head, Container, Table, Relative, LinearProgress } = MainLayout;

const DialogConfirmReceive = Loadable(lazy(() => import("./form/DialogConfirmReceive")));
const DialogServicePack = Loadable(lazy(() => import("./form/DialogServicePack")));
const DialogCollectMoney = Loadable(lazy(() => import("./form/DialogCollectMoney")));

const ReceiveRecordPage: FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, data, filters } = useBooking();
  const { confirm, service, payment, dataSelectReceive } = useFrontDesk();
  const user = useAccount();
  const dataOptionPatient = useOptionPatient();
  const [nameType, setNameType] = useState<string>("-1");

  useEffect(() => {
    dispatch(
      bookingActions.getStart({
        ...filters,
        date: dataSelectReceive?.format("YYYY-MM-DD")!,
        limit: 9999,
        page: 1,
      })
    );
  }, [dataSelectReceive, filters]);

  useEffect(() => {
    dispatch(serviceActions.getStart({ limit: 100, page: 1 }));
    dispatch(subclinicalActions.getStart({ limit: 100, page: 1 }));
    dispatch(patientActions.getStart({ page: 1, limit: 100 }));
  }, []);

  const columns = useMemo(
    (): ColumnTable[] => [
      { id: "stt", label: "STT", minWidth: 20, align: "center" },
      { id: "id", label: "M.DL", minWidth: 70, align: "center" },
      { id: "display_name", label: "Họ và tên" },
      { id: "doctor", label: "Bác sĩ khám", align: "center" },
      { id: "reason", label: "Lý do khám", align: "center" },
      { id: "hour", label: "Thời gian khám", align: "center" },
      { id: "status", label: "Trạng thái đặt lịch", align: "center" },
      { id: "payment", label: "Trạng thái thanh toán", align: "center" },
      { id: "confirm", label: "Xác nhận BN đã đến", minWidth: 110, align: "center" },
    ],
    []
  );

  const handleChangeDate = useCallback(
    (date: Dayjs | null) => {
      dispatch(frontDeskActions.setDataSelectReceive(date!));
      delete filters.patient_id;
      setNameType("");
      dispatch(bookingActions.setFilter(filters));
    },
    [filters]
  );

  const handleOpenConfirm = useCallback(
    (id: string, order: number, displayName: string, typePatient: BookingTypePatient) => {
      dispatch(
        frontDeskActions.setToggleConfirm({
          bookingId: id,
          open: true,
          order,
          displayName,
          typePatient: typePatient,
        })
      );
    },
    []
  );

  const initialValuesConfirm = useMemo((): ExaminationCardType => {
    return {
      order: confirm.order,
      booking_id: confirm.bookingId,
      note: "",
      // @ts-ignore
      artery: "",
      // @ts-ignore
      temperature: "",
      // @ts-ignore
      spO2: "",
      // @ts-ignore
      breathing_rate: "",
      // @ts-ignore
      blood_pressure: "",
      // @ts-ignore
      under_blood_pressure: "",
      is_use_service: confirm.typePatient === "new",
    };
  }, [confirm]);

  const handleSubmitConfirm = useCallback(
    (value: ExaminationCardType, resetForm: () => void) => {
      dispatch(appActions.setOpenBackdrop());
      dispatch(
        examinationCardActions.addExaminationStart({
          data: {
            ...value,
            artery: +value?.artery!,
            blood_pressure: +value?.blood_pressure!,
            breathing_rate: +value?.breathing_rate!,
            spO2: +value?.spO2!,
            temperature: +value?.temperature!,
            under_blood_pressure: +value?.under_blood_pressure!,
            order: value?.order ? value.order : 0,
            employee_id: `${user?.id!}`,
          },
          resetForm,
        })
      );
    },
    [user]
  );

  const initialValuesServicePack = useMemo((): ServicePatientPayload => {
    return {
      options: "service",
      // @ts-ignore
      service_id: "",
      data: [],
      note: "",
      quantity_perform: 1,
    };
  }, []);

  const handleSubmitServiceConfirm = useCallback(
    (values: ServicePatientPayload, resetForm: () => void) => {
      dispatch(appActions.setOpenBackdrop());
      dispatch(
        examinationCardActions.addExaminationDetailStart({
          data: {
            bill_id: service.billId,
            booking_id: confirm.bookingId,
            data: values.data?.map((t) => ({ id: t.id!, price: t.price }))!,
            employee_id: `${user?.id!}`,
            examination_card_id: service.examinationCardId,
            options: values.options,
            service_id: +values.service_id,
          },
          resetForm,
        })
      );
    },
    [user, service, confirm]
  );

  const handlePayment = useCallback((bookingId: string, order: number, displayName: string) => {
    dispatch(frontDeskActions.setToggleConfirm({ bookingId, displayName, order }));
    dispatch(frontDeskActions.setTogglePayment({ open: true }));
  }, []);

  const handleSubmitPayment = useCallback(
    (values: PaymentServicePayload, resetForm?: () => void) => {
      dispatch(appActions.setOpenBackdrop());
      dispatch(examinationCardActions.paymentServiceStart({ data: values, resetForm: resetForm! }));
    },
    []
  );

  const handleChangeNameType = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      const {
        target: { value },
      } = event;

      setNameType(value as string);

      let lastFilter = { ...filters };

      if (Number(value) === -1) {
        if (lastFilter.patient_id) delete lastFilter.patient_id;
      } else {
        lastFilter = {
          ...lastFilter,
          patient_id: value,
        };
      }

      dispatch(
        bookingActions.setDebounceSearch({
          ...lastFilter,
        })
      );
    },
    [filters]
  );

  const onClose = useCallback(() => {
    dispatch(frontDeskActions.setToggleConfirm({ bookingId: "", displayName: "", order: 0 }));
    dispatch(
      frontDeskActions.setTogglePayment({ data: null, error: "", isLoading: "ready", open: false })
    );
    dispatch(
      bookingActions.getStart({
        ...filters,
        date: dataSelectReceive?.format("YYYY-MM-DD")!,
        limit: 9999,
        page: 1,
      })
    );
  }, [dataSelectReceive]);

  const isOverTimeOfSchedule = useMemo(
    () => handleCompareTimeWithCurrentTime("20:00", "20:00"),
    []
  );

  console.log(`isOverTimeOfSchedule`, isOverTimeOfSchedule);

  return (
    <MainLayout>
      <Head title="Tiếp nhận hồ sơ bệnh nhân" />

      {confirm.open ? (
        <DialogConfirmReceive initialValues={initialValuesConfirm} onSubmit={handleSubmitConfirm} />
      ) : null}

      {service.open ? (
        <DialogServicePack
          openAdd={service.open}
          initialValues={initialValuesServicePack}
          onSubmit={handleSubmitServiceConfirm}
        />
      ) : null}

      {payment.open ? (
        <DialogCollectMoney onClose={onClose} onSubmit={handleSubmitPayment} />
      ) : null}

      <Container maxWidth="xl">
        <Box border={({ palette }) => `1px dashed ${palette.grey[400]}`} my={3} p={3}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Vui lòng xác nhận hồ sơ và chọn gói dịch vụ khám cho bệnh nhân ngày{" "}
            <b>{fDateWithMoment(new Date(), undefined, "DD/MM/YYYY")}</b>
          </Alert>
          {dataSelectReceive ? (
            <Grid container alignItems={"center"} spacing={1}>
              <Grid item lg={3}>
                <DatePicker
                  label="Ngày khám"
                  value={dataSelectReceive}
                  hideMinDate
                  onChangeDate={handleChangeDate}
                />
              </Grid>
              <Grid item lg={3}>
                {dataOptionPatient.length ? (
                  <SelectInput
                    value={nameType}
                    onChange={handleChangeNameType}
                    size="small"
                    margin="none"
                    options={[{ label: "Tất cả", value: "-1" }, ...dataOptionPatient]}
                    label="Chọn BN"
                  />
                ) : null}
              </Grid>
            </Grid>
          ) : (
            <></>
          )}

          <Box mt={2}>
            <Typography fontSize={15} fontWeight={600}>
              Trạng thái đặt lịch:
            </Typography>
            <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
              <Typography sx={{ fontSize: 14 }}> Chờ bệnh nhân đến khám</Typography>
              <Box sx={{ width: 20, height: 2, background: "black" }} />
              <Typography sx={{ fontSize: 14 }} color={Colors.blue}>
                Chờ gọi khám
              </Typography>
              <Box sx={{ width: 20, height: 2, background: "black" }} />
              <Typography sx={{ fontSize: 14 }} color={Colors.green}>
                Đang khám
              </Typography>
              <Box sx={{ width: 20, height: 2, background: "black" }} />
              <Typography sx={{ fontSize: 14 }} color={Colors.orange}>
                Hoàn thành khám
              </Typography>
              <Typography sx={{ fontSize: 14 }} color={Colors.red}>
                | Hủy lịch | Bác sĩ hủy lịch
              </Typography>
            </Stack>
          </Box>
        </Box>

        <Relative>
          <LinearProgress isOnTable loading={Boolean(isLoading === "pending")} />

          <Table columns={columns} sxTableContainer={{ minHeight: 418 }} maxHeight={600}>
            {!data.length ? (
              <TableRow>
                <TableCell colSpan={columns.length} component={"th"} scope="row">
                  Không có lịch đặt khám trong ngày này!
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index2) => {
                const bg = convertStatusBookingAtReceiveTab({
                  dataHour: row.dataHour!,
                  date: row.date,
                  status: row?.examCard ? row?.examCard?.status! : null,
                });

                return (
                  <TableRow
                    key={index2}
                    sx={{
                      background:
                        row.status === "canceled" || row.status === "doctor_canceled"
                          ? Background.redLight
                          : bg,
                      //   : row.status === "in_progress"
                      //   ? bg
                      //   : "red",
                    }}
                  >
                    {columns.map((column) => {
                      const value = row[column.id as keyof IBooking];

                      // console.log(`row`, row);

                      if (column.id === "display_name") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            <Typography fontSize={14}> {row.dataPatient?.display_name}</Typography>
                            <Typography fontSize={14}> {row.dataPatient?.phone_number}</Typography>
                          </TableCellOverride>
                        );
                      }

                      if (column.id === "stt") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            {index2 + 1}
                          </TableCellOverride>
                        );
                      }
                      if (column.id === "doctor") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            {`${row.dataDoctor?.qualificationData?.character} ${row?.dataDoctor?.display_name}`}
                          </TableCellOverride>
                        );
                      }

                      if (column.id === "status") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            {row.status === "canceled" || row.status === "doctor_canceled" ? (
                              <Typography fontSize={14} sx={{ color: "red" }}>
                                {convertBookingStatus(row?.status!)}
                              </Typography>
                            ) : row.status === "in_progress" ? (
                              <Typography fontSize={14} sx={{ color: Colors.blue }}>
                                {convertBookingStatus(row?.status!)}
                              </Typography>
                            ) : row.status === "completed" ? (
                              <Typography fontSize={14} sx={{ color: Colors.orange }}>
                                {convertBookingStatus(row?.status!)}
                              </Typography>
                            ) : (
                              <Typography fontSize={14}>
                                {convertBookingStatus(row?.status!)}
                              </Typography>
                            )}
                          </TableCellOverride>
                        );
                      }

                      if (column.id === "payment") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            {row?.bill && row.bill.status === "paid" ? (
                              <Typography fontSize={14} sx={{ color: "orange" }}>
                                {convertPaymentStatus(row?.bill ? row.bill.status : "unpaid")}
                              </Typography>
                            ) : row?.bill && row.bill.status === "partially_paid" ? (
                              <Typography fontSize={14} sx={{ color: "blue" }}>
                                {convertPaymentStatus(row?.bill ? row.bill.status : "unpaid")}
                              </Typography>
                            ) : (
                              <Typography fontSize={14}>
                                {convertPaymentStatus(row?.bill ? row.bill.status : "unpaid")}
                              </Typography>
                            )}
                          </TableCellOverride>
                        );
                      }

                      if (column.id === "hour") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            {`${row.dataHour?.time_start} - ${row.dataHour?.time_end}`}
                          </TableCellOverride>
                        );
                      }

                      if (column.id === "confirm") {
                        if (
                          row?.bill &&
                          (row?.bill.status === "unpaid" || row?.bill.status === "partially_paid")
                        ) {
                          return (
                            <TableCellOverride key={column.id} {...column}>
                              <Button
                                color="error"
                                onClick={() =>
                                  handlePayment(row.id!, row.order, row?.dataPatient?.display_name!)
                                }
                              >
                                Thanh toán
                              </Button>
                            </TableCellOverride>
                          );
                        }

                        // Nếu khác ngày hiện tại thì disabled ngược lại check theo trạng thái
                        const disabled =
                          isOverTimeOfSchedule ||
                          (!isToday(new Date(row.date))
                            ? true
                            : Boolean(
                                (row.status === "in_progress" &&
                                  row?.bill &&
                                  row?.bill?.status === "paid") ||
                                  row.status === "completed" ||
                                  row?.status === "canceled" ||
                                  row.status === "doctor_canceled"
                              ));

                        return (
                          <TableCellOverride key={column.id} {...column}>
                            <Button
                              disabled={disabled}
                              color="success"
                              onClick={
                                disabled
                                  ? undefined
                                  : () =>
                                      handleOpenConfirm(
                                        row.id!,
                                        row.order,
                                        row?.dataPatient?.display_name!,
                                        row.type_patient
                                      )
                              }
                            >
                              Xác nhận
                            </Button>
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
                );
              })
            )}
          </Table>
        </Relative>
      </Container>
    </MainLayout>
  );
};

export default ReceiveRecordPage;
