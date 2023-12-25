import { Alert, Box, Button, TableCell, TableRow, Typography } from "@mui/material";
import dayjs from "dayjs";
import { FC, useCallback, useEffect, useMemo } from "react";
import { TableCellOverride } from "~/components";
import { appActions } from "~/features/app";
import { bookingActions, useBooking } from "~/features/booking";
import { frontDeskActions, useFrontDesk } from "~/features/frontDesk";
import { patientActions, usePatients } from "~/features/patient";
import { MainLayout } from "~/layouts";
import { IBill, IBooking } from "~/models";
import { useAppDispatch } from "~/stores";
import { ColumnTable } from "~/types";
import { convertBookingStatus } from "~/utils/common";
import { fDateWithMoment } from "~/utils/formatTime";
import DialogConfirmExamination from "../checkHealthy/components/main/Filter/DialogConfirmExamination";
import DialogSeeBill from "../patients/component/DialogSeeBill";

const { Head, Container, Table, Relative, LinearProgress } = MainLayout;

const ListBillSubclinical: FC = () => {
  const dispatch = useAppDispatch();
  const {
    historyExamination: { actions },
  } = usePatients();
  const { isLoading, data } = useBooking();
  const {
    bill: { data: dataBill, selected },
  } = useFrontDesk();

  useEffect(() => {
    dispatch(appActions.setOpenBackdrop());
    dispatch(
      bookingActions.getStart({
        date: dayjs()?.format("YYYY-MM-DD")!,
        limit: 9999,
        page: 1,
      })
    );
  }, []);

  const dataFilter = useMemo(
    () => [
      ...data
        .filter((t) => t.status! !== "doctor_canceled")
        .filter((t) => t.status! !== "canceled"),
    ],
    [data]
  );

  const isPaid = useCallback((booking: IBooking) => {
    return (
      booking?.bill?.status === "paid" &&
      booking?.billMedicine?.status === "paid" &&
      booking?.billSubclinical?.every((t) => t?.status === "paid")
    );
  }, []);

  const columns = useMemo(
    (): ColumnTable[] => [
      { id: "id", label: "M.DL", minWidth: 70, align: "center" },
      { id: "display_name", label: "Họ và tên" },
      { id: "doctor", label: "Bác sĩ khám", align: "center" },
      { id: "reason", label: "Lý do khám", align: "center" },
      { id: "hour", label: "Thời gian khám", align: "center" },
      { id: "status", label: "Trạng thái đặt lịch", align: "center" },
      { id: "payment", label: "Trạng thái thanh toán", align: "center" },
      { id: "actions", label: "Thanh toán", align: "center" },
    ],
    []
  );

  const handleClickPayment = useCallback((row: IBooking) => {
    if (!row?.bill && !row?.bill?.examination_card_id) return;

    dispatch(appActions.setOpenBackdrop());
    dispatch(
      frontDeskActions.getBillStart({
        limit: 9999,
        examination_card_id: row?.bill?.examination_card_id,
      })
    );
    dispatch(
      patientActions.setToggleActions({
        data: {
          booking_id: row.id!,
          date: dayjs().format("YYYY-MM-DD"),
          hour: row.dataHour!,
          note: "",
          order: 1,
          reason: "",
          id: row.patient_id,
        },
        open: "seeBill",
      })
    );
  }, []);

  const openSeeBill = useMemo(() => Boolean(actions.open === "seeBill"), [actions]);

  const handleCloseActions = useCallback(() => {
    dispatch(patientActions.setToggleActions({ data: null, open: null }));
  }, []);

  const handleOnPayment = useCallback((row: IBill) => {
    dispatch(frontDeskActions.setToggleSelectedBill(row));
  }, []);

  const handleClosePayment = useCallback(() => {
    dispatch(frontDeskActions.setToggleSelectedBill(null));
  }, []);

  const handleAgreePayment = useCallback(() => {
    if (!selected) return;

    dispatch(appActions.setOpenBackdrop());
    dispatch(
      frontDeskActions.paymentBillStart({
        billId: selected.id!,
        lengthIsUnPaid: dataBill.filter((t) => t.status === "unpaid").length,
      })
    );
  }, [selected, dataBill]);

  return (
    <MainLayout>
      <Head title="Danh sách hóa đơn chỉ định" />

      <DialogConfirmExamination
        text="Xác nhận thanh toán"
        textConfirm="Xác nhận"
        open={Boolean(selected)}
        onClose={handleClosePayment}
        onAgree={handleAgreePayment}
      />

      {openSeeBill ? (
        <DialogSeeBill
          data={dataBill.filter((t) => t.status === "unpaid")}
          onClose={handleCloseActions}
          open={openSeeBill}
          history={actions.data!}
          onPayment={handleOnPayment}
        />
      ) : null}

      <Container maxWidth="xl">
        <Box my={3}>
          <Alert severity="warning">
            Vui lòng thanh toán các hóa đơn bao gồm phí thực hiện cận lâm sàng theo yêu cầu của bác
            sĩ ngày
            <b>{fDateWithMoment(new Date(), undefined, "DD/MM/YYYY")}</b>
          </Alert>
        </Box>

        <Relative>
          <LinearProgress isOnTable loading={Boolean(isLoading === "pending")} />

          <Table columns={columns} sxTableContainer={{ minHeight: 418 }}>
            {!dataFilter.length ? (
              <TableRow>
                <TableCell colSpan={columns.length} component={"th"} scope="row">
                  Không có bệnh nhân
                </TableCell>
              </TableRow>
            ) : (
              dataFilter.map((row, index2) => {
                if (row.status === "canceled" || row.status === "doctor_canceled") return null;

                return (
                  <TableRow key={index2}>
                    {columns.map((column) => {
                      const value = row[column.id as keyof IBooking];

                      if (column.id === "display_name") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            <Typography fontSize={14}> {row.dataPatient?.display_name}</Typography>
                            <Typography fontSize={14}> {row.dataPatient?.phone_number}</Typography>
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
                            {row?.status === "in_progress" ? (
                              <Typography fontSize={14} sx={{ color: "orange" }}>
                                {convertBookingStatus(row?.status!)}
                              </Typography>
                            ) : (
                              <Typography fontSize={14} sx={{ color: "green" }}>
                                {convertBookingStatus(row?.status!)}
                              </Typography>
                            )}
                          </TableCellOverride>
                        );
                      }

                      const checkIsPaid = isPaid(row);

                      if (column.id === "payment") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            {checkIsPaid ? (
                              <Typography fontSize={14} sx={{ color: "green" }}>
                                Đã thanh toán
                              </Typography>
                            ) : (
                              <Typography fontSize={14} sx={{ color: "orange" }}>
                                Chưa thanh toán
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

                      if (column.id === "actions")
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            <Button
                              onClick={() => handleClickPayment?.(row)}
                              disabled={checkIsPaid || row?.status === "in_progress"}
                              color="error"
                            >
                              Thanh toán
                            </Button>
                          </TableCellOverride>
                        );

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

export default ListBillSubclinical;
