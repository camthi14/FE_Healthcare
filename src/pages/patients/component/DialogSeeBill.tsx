import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Alert, Dialog, DialogContent, IconButton, Paper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { FC } from "react";
import { AppbarDialog, Transition } from "~/components";
import { Colors, SCROLLBAR_CUSTOM } from "~/constants";
import { GetHistoryExamination, IBill } from "~/models";
import {
  convertOptionsBill,
  convertPaymentStatus,
  convertPaymentStatusColors,
} from "~/utils/common";
import { fNumber } from "~/utils/formatNumber";

type DialogSeeBillProps = {
  open: boolean;
  onClose?: () => void;
  history: GetHistoryExamination;
  data: IBill[];
  onPayment?: (row: IBill) => void;
};

const DialogSeeBill: FC<DialogSeeBillProps> = ({ data, history, open, onClose, onPayment }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={onClose}
      maxWidth={data.length > 2 ? "lg" : "md"}
      fullWidth
    >
      <AppbarDialog
        title={`Danh sách hóa đơn ngày ${dayjs(history.date).format("DD/MM/YYYY")}. Mã khám bệnh ${
          history.id
        }`}
      >
        <IconButton color="error" size="small" onClick={onClose}>
          <HighlightOffIcon />
        </IconButton>
      </AppbarDialog>

      <DialogContent sx={SCROLLBAR_CUSTOM}>
        <Stack flexDirection={"row"} gap={2} flexWrap={"wrap"}>
          {data.length ? (
            data.map((row) => (
              <Stack
                sx={{
                  transition: "all 0.25s ease-in-out",
                  "&:hover": {
                    background: Colors.blueLight,
                  },
                  cursor: onPayment ? "pointer" : "default",
                }}
                component={Paper}
                elevation={3}
                minWidth={320}
                p={2}
                gap={1.5}
                onClick={onPayment ? () => onPayment(row) : undefined}
              >
                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                  <Typography>Tiêu đề:</Typography>
                  <b>{convertOptionsBill(row?.payment_for!)}</b>
                </Stack>

                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                  <Typography>Tổng tiền:</Typography>
                  <b style={{ color: Colors.red }}>{fNumber(row.total_price)} VNĐ</b>
                </Stack>

                {/* <Stack flexDirection={"row"} justifyContent={"space-between"}>
                  <Typography>Tiền trả trước:</Typography>
                  <b>{fNumber(row.deposit || 0)} VNĐ</b>
                </Stack>

                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                  <Typography>Đã nhận:</Typography>
                  <b>{fNumber(row.price_received || 0)} VNĐ</b>
                </Stack>

                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                  <Typography>Tiền thừa:</Typography>
                  <b>{fNumber(row.change!)} VNĐ</b>
                </Stack> */}

                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                  <Typography>Thu ngân:</Typography>
                  <b>{row?.dataEmployee?.display_name || "Chưa có thông tin"}</b>
                </Stack>

                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                  <Typography>Trạng thái:</Typography>
                  <b style={{ color: convertPaymentStatusColors(row.status) }}>
                    {convertPaymentStatus(row.status)}
                  </b>
                </Stack>
              </Stack>
            ))
          ) : (
            <Stack width={"100%"}>
              <Alert color="info">Không có hóa đơn vào ngày này</Alert>
            </Stack>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSeeBill;
