import { Alert, Box, Button, TableCell, TableRow, Typography } from "@mui/material";
import { Dayjs } from "dayjs";
import { FC, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { DatePicker, Loadable, TableCellOverride } from "~/components";
import { Colors } from "~/constants";
import { appActions } from "~/features/app";
import { useAccount } from "~/features/auth";
import { frontDeskActions, useFrontDesk } from "~/features/frontDesk";
import { patientActions, usePatients } from "~/features/patient";
import { MainLayout } from "~/layouts";
import { GetPatientForDateResponse } from "~/models";
import { ReceivePrescriptionInput } from "~/models/prescriptions.model";
import { useAppDispatch } from "~/stores";
import { ColumnTable } from "~/types";
import {
  convertExaminationCardStatus,
  convertPaymentStatus,
  convertTypePatientStatus,
} from "~/utils/common";
import { fDateWithMoment } from "~/utils/formatTime";
import DialogReceiveMedicine from "./form/DialogReceiveMedicine";

const { Head, Container, Table, Relative, LinearProgress } = MainLayout;

const DialogInfoPatient = Loadable(lazy(() => import("./form/DialogInfoPatient")));

const ListPatientConfirmedPage: FC = () => {
  const dispatch = useAppDispatch();
  const { patients, detailPatient, dialogReceivePrescription } = useFrontDesk();
  const {
    historyExamination: { prescriptions },
  } = usePatients();
  const employee = useAccount();
  const [type, setType] = useState<"receive" | "see" | null>(null);

  // console.log("prescriptions", prescriptions);

  useEffect(() => {
    dispatch(appActions.setOpenBackdrop());
    dispatch(
      frontDeskActions.getPatientForDateStart({
        bookingStatus: "completed",
        date: patients.date.format("YYYY-MM-DD"),
        examinationStatus: "complete",
      })
    );
  }, [patients.date]);

  const columns = useMemo(
    (): ColumnTable[] => [
      { id: "STT", label: "STT", minWidth: 60, maxWidth: 60, align: "center" },
      { id: "display_name", label: "Họ và tên" },
      { id: "doctor", label: "Bác sĩ khám", align: "center" },
      { id: "hour", label: "Thời gian khám", align: "center" },
      { id: "payment", label: "Thanh toán", minWidth: 110, align: "center" },
      // chờ khám -> đang khám -> đã khám
      { id: "status", label: "Trạng thái", minWidth: 110, align: "center" },
      {
        id: "created_at",
        label: "Ngày tạo",
        minWidth: 110,
        align: "center",
        format(value) {
          return fDateWithMoment(value, undefined, "DD/MM/YYYY");
        },
      },
      { id: "receiveMedicine", label: "Nhận thuốc", minWidth: 110, align: "center" },
    ],
    []
  );

  const handleChangeDate = useCallback((date: Dayjs | null) => {
    dispatch(frontDeskActions.setDataSelectListPatient(date!));
  }, []);

  const handleReceiveMedicine = (row: GetPatientForDateResponse, type: "receive" | "see") => {
    dispatch(frontDeskActions.setToggleDialogReceivePrescription({ open: true, selected: row }));
    dispatch(appActions.setOpenBackdrop());
    dispatch(patientActions.getExaminationCardAndDetailsStart(String(row.examinationData.id)));
    setType(type);
  };

  const onClose = useCallback(() => {
    dispatch(frontDeskActions.setToggleDialogReceivePrescription({ open: false, selected: null }));
    dispatch(
      frontDeskActions.getPatientForDateStart({
        bookingStatus: "completed",
        date: patients.date.format("YYYY-MM-DD"),
        examinationStatus: "complete",
      })
    );
  }, [patients.date]);

  const handleOnReceive = useCallback(
    (cardExamId: string) => {
      if (!employee || !employee?.id) return;

      const data: ReceivePrescriptionInput = {
        employeeId: String(employee.id),
        examCardId: cardExamId,
      };

      dispatch(appActions.setOpenBackdrop());
      dispatch(frontDeskActions.ReceivePrescriptionStart(data));
    },
    [employee]
  );

  return (
    <Box>
      <Head title="Danh sách nhận thuốc" />

      {detailPatient ? <DialogInfoPatient /> : null}

      {dialogReceivePrescription && prescriptions ? (
        <DialogReceiveMedicine
          data={prescriptions}
          onClose={onClose}
          onReceive={handleOnReceive}
          open={dialogReceivePrescription}
        />
      ) : null}

      {dialogReceivePrescription && prescriptions ? (
        <DialogReceiveMedicine
          data={prescriptions}
          onClose={onClose}
          onReceive={handleOnReceive}
          open={dialogReceivePrescription}
          detail={type === "see"}
        />
      ) : null}

      <Container maxWidth="xl">
        <Box border={({ palette }) => `1px dashed ${palette.grey[400]}`} my={3} p={3}>
          <Typography fontSize={18} fontWeight={600} my={1}>
            Danh sách nhận thuốc của bệnh nhân
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Vui lòng xác nhận nhận thuốc cho bệnh nhân ngày
            <b>{fDateWithMoment(new Date(), undefined, "DD/MM/YYYY")}</b>
          </Alert>

          <Box alignItems={"center"}>
            <DatePicker
              label="Ngày khám"
              value={patients.date}
              hideMinDate
              onChangeDate={handleChangeDate}
            />
          </Box>
        </Box>

        <Relative>
          <LinearProgress isOnTable loading={Boolean(patients.isLoading === "pending")} />

          <Table columns={columns} sxTableContainer={{ minHeight: 418 }}>
            {!patients.data.length ? (
              <TableRow>
                <TableCell colSpan={columns.length} component={"th"} scope="row">
                  Không có bệnh nhân
                </TableCell>
              </TableRow>
            ) : (
              patients.data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((column) => {
                    // console.log(`row`, row);

                    const value = row[column.id as keyof GetPatientForDateResponse];

                    if (column.id === "STT") {
                      return (
                        <TableCellOverride key={column.id} {...column}>
                          {i + 1}
                        </TableCellOverride>
                      );
                    }
                    if (column.id === "display_name") {
                      return (
                        <TableCellOverride key={column.id} {...column}>
                          <Typography fontSize={14}>{row.patient.display_name}</Typography>
                          <Typography fontSize={14}>{row.patient.phone_number}</Typography>
                          <Typography fontSize={14}>Lý do khám: {row.reason}</Typography>
                          <Typography fontSize={14}>
                            Loại bệnh nhân : {convertTypePatientStatus(row?.type_patient!)}
                          </Typography>
                        </TableCellOverride>
                      );
                    }

                    if (column.id === "doctor") {
                      return (
                        <TableCellOverride key={column.id} {...column}>
                          {`${row.doctor.qualificationData?.character} ${row.doctor.display_name}`}
                        </TableCellOverride>
                      );
                    }

                    if (column.id === "hour") {
                      return (
                        <TableCellOverride key={column.id} {...column}>
                          {`${row?.dataHour?.time_start} - ${row?.dataHour?.time_end}`}
                        </TableCellOverride>
                      );
                    }

                    //Xem chi tiết thanh toán
                    if (column.id === "payment") {
                      return (
                        <TableCellOverride key={column.id} {...column}>
                          <Typography fontSize={14} sx={{ color: Colors.orange }}>
                            {convertPaymentStatus(row?.bill?.status!)}
                          </Typography>
                        </TableCellOverride>
                      );
                    }

                    //nhận thuốc tiến hành thanh toán phí thuốc NHẬN-->ĐÃ NHẬN
                    if (column.id === "receiveMedicine") {
                      const disabled = Boolean(
                        row?.examinationData.status !== "complete" ||
                          (row.billMedicine && row.billMedicine.status === "paid")
                      );

                      return (
                        <TableCellOverride key={column.id} {...column}>
                          <Button
                            sx={{ minWidth: "35px" }}
                            onClick={
                              disabled ? undefined : () => handleReceiveMedicine(row, "receive")
                            }
                            disabled={disabled}
                            color="success"
                          >
                            Nhận
                          </Button>
                          <Button
                            sx={{ minWidth: "35px" }}
                            onClick={() => handleReceiveMedicine(row, "see")}
                          >
                            Xem chi tiết
                          </Button>
                        </TableCellOverride>
                      );
                    }

                    // Trạng thái --> chờ khám --> đang khám --> hoàn thành
                    if (column.id === "status") {
                      return (
                        <TableCellOverride key={column.id} {...column}>
                          {row.examinationData.status === "pending" ? (
                            <Typography fontSize={14} sx={{ color: Colors.blue }}>
                              {convertExaminationCardStatus(row.examinationData.status!)}
                            </Typography>
                          ) : row.examinationData.status === "examination" ? (
                            <Typography fontSize={14} sx={{ color: Colors.blue }}>
                              {convertExaminationCardStatus(row.examinationData.status!)}
                            </Typography>
                          ) : row.examinationData.status === "complete" ? (
                            <Typography fontSize={14} sx={{ color: Colors.orange }}>
                              {convertExaminationCardStatus(row.examinationData.status!)}
                            </Typography>
                          ) : (
                            <Typography fontSize={14}>
                              {convertExaminationCardStatus(row.examinationData.status!)}
                            </Typography>
                          )}
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
            )}
          </Table>
        </Relative>
      </Container>
    </Box>
  );
};

export default ListPatientConfirmedPage;
