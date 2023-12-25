import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  Dialog,
  Grid,
  IconButton,
  Slide,
  TableCell,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { FC, forwardRef, useCallback, useEffect, useMemo } from "react";
import { TableCellOverride } from "~/components";
import { Background, Colors } from "~/constants";
import { appActions } from "~/features/app";
import { frontDeskActions, useFrontDesk } from "~/features/frontDesk";
import { MainLayout } from "~/layouts";
import { IService, ISubclinical } from "~/models";
import { useAppDispatch } from "~/stores";
import { ColumnTable } from "~/types";
import {
  calcAge,
  convertExaminationCardStatus,
  convertGender,
  convertPaymentStatus,
} from "~/utils/common";
import { fNumber } from "~/utils/formatNumber";

const { Table } = MainLayout;

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface DataList {
  code: string;
  name: string;
  typeMedicine: string;
  amount: string;
  price: string;
  pay: string;
  note: string;
}

const data = [
  {
    code: "1",
    name: "Thuốc kháng sinh",
    typeMedicine: "Kháng sinh",
    amount: "1",
    price: "15.000",
    pay: "15.000",
    note: "Uống sáng chiều 2 viên",
  },
  {
    code: "2",
    name: "Thuốc đau bụng",
    typeMedicine: "Kháng sinh",
    amount: "1",
    price: "10.000",
    pay: "10.000",
    note: "Uống sáng chiều 1 viên",
  },
];

const DialogInfoPatientConfirmed: FC = () => {
  const dispatch = useAppDispatch();
  const { detailPatient, payment } = useFrontDesk();

  useEffect(() => {
    if (!detailPatient.bookingId) return;
    dispatch(appActions.setOpenBackdrop());
    dispatch(frontDeskActions.getPatientInformationPaymentStart(detailPatient.bookingId));
  }, [detailPatient]);

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

  const onClose = useCallback(() => {
    dispatch(
      frontDeskActions.setToggleDetailPatient({ examinationCardId: "", open: false, bookingId: "" })
    );
  }, []);

  return (
    <Dialog open={detailPatient.open} fullScreen TransitionComponent={Transition} onClose={onClose}>
      <AppBar sx={{ position: "relative", background: Background.blue }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontSize={18}>Thông tin chi tiết của bệnh nhân</Typography>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box p={3}>
        <Box border={({ palette }) => `1px dashed ${palette.grey[400]}`} p={2} m={1}>
          <Typography variant="h6" sx={{ color: Colors.blue }}>
            1. Thông tin khám
          </Typography>
          <Grid container spacing={2}>
            <Grid item lg={6}>
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
                Giới tính: <b>{convertGender(payment?.data?.patient?.gender || "FEMALE")}</b>
              </Typography>
              <Typography>
                Tuổi: <b>{calcAge(payment?.data?.patient?.birth_date || "")}</b>
              </Typography>
              <Typography>
                Giờ khám:
                <b>
                  {`${payment?.data?.booking?.dataHour?.time_start} - ${payment?.data?.booking?.dataHour?.time_end}`}
                </b>
              </Typography>
              <Typography>
                Thanh toán:
                <strong style={{ color: "green" }}>
                  {convertPaymentStatus(payment?.data?.bill?.status!)}
                </strong>
              </Typography>
              <Typography>
                Trạng thái:
                <strong>
                  {convertExaminationCardStatus(payment?.data?.examinationCard?.status!)}
                </strong>
              </Typography>
            </Grid>
            <Grid item lg={6} display={"flex"} justifyContent={"end"} flexDirection={"column"}>
              <Typography>Phòng khám: HealthyCare</Typography>
              <Typography>
                Tên Bác sĩ:
                <b>{`${payment?.data?.booking?.dataDoctor?.qualificationData?.character} ${payment?.data?.booking?.dataDoctor?.display_name}`}</b>
              </Typography>
              <Typography>
                Trợ lý hỗ trợ: <b>Trợ lý</b>
              </Typography>
              <Typography>
                Chuyên khoa: <b>{payment?.data?.booking?.dataDoctor?.specialtyData?.name}</b>
              </Typography>
              <Typography>
                Giá khám:
                <strong style={{ color: "red" }}>
                  <b>{fNumber(payment?.data?.booking?.price!)}VNĐ</b>
                </strong>
              </Typography>
              <Typography>
                Thu ngân thực hiện thanh toán:
                <b>{payment?.data?.bill?.dataEmployee?.display_name}</b>
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box border={({ palette }) => `1px dashed ${palette.grey[400]}`} p={2} m={1}>
          <Typography variant="h6" sx={{ color: Colors.blue }}>
            2. Thông tin gói dv / CLS
          </Typography>
          <Box>
            <Typography>
              Tổng giá :{" "}
              <strong style={{ color: "red" }}>{fNumber(payment?.data?.bill?.total_price!)}</strong>
            </Typography>
            <Typography>
              Trạng thái:{" "}
              <strong style={{ color: "green" }}>
                {convertPaymentStatus(payment?.data?.bill?.status!)}
              </strong>
            </Typography>
            {payment?.data?.examinationCardDetails?.length ? (
              <>
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
                                {column.format ? column.format(value as string) : (value as string)}
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
                              {column.format ? column.format(value as string) : (value as string)}
                            </TableCellOverride>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </Table>
              </>
            ) : null}
          </Box>
        </Box>

        <Box border={({ palette }) => `1px dashed ${palette.grey[400]}`} p={2} m={1}>
          <Typography variant="h6" sx={{ color: Colors.blue }}>
            3. Thông tin thuốc
          </Typography>
          <Box>
            <Typography>
              Tổng tiền : <strong style={{ color: "red" }}>{fNumber(0)}VNĐ</strong>
            </Typography>
            <Typography>
              Trạng thái: <strong style={{ color: "green" }}>Chưa thanh toán</strong>
            </Typography>

            <Table columns={columns} sxTableContainer={{ mt: 2 }}>
              {data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((column) => {
                    const value = row[column.id as keyof DataList];

                    return (
                      <TableCell
                        key={column.id}
                        style={{
                          minWidth: column.minWidth,
                          maxWidth: column.maxWidth,
                          ...column.styles,
                        }}
                        component={"th"}
                        scope="row"
                        align={column.align}
                      >
                        {value as string}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </Table>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DialogInfoPatientConfirmed;
