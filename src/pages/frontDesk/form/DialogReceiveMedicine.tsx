import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { FC, useMemo } from "react";
import { Transition } from "~/components";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { ResponseGetExamCardAndDetails } from "~/models/prescriptions.model";
import PrescriptionsCollapse from "~/pages/checkHealthy/components/main/PrescribeMedicine/PrescriptionsCollapse";
import { fNumber } from "~/utils/formatNumber";

type DialogReceiveMedicineProps = {
  open: boolean;
  detail?: boolean;
  onClose: () => void;
  data: ResponseGetExamCardAndDetails;
  onReceive?: (examCardId: string) => void;
};

const DialogReceiveMedicine: FC<DialogReceiveMedicineProps> = ({
  open,
  onClose,
  data,
  onReceive,
  detail,
}) => {
  const total = useMemo(() => {
    if (!data?.details?.length) return 0;

    return data.details.reduce(
      (total, value) =>
        (total += Number(value?.infoData?.price_sell) * Number(value.quantity_ordered) || 0),
      0
    );
  }, [data]);

  return (
    <Dialog open={open} onClose={onClose} fullScreen TransitionComponent={Transition}>
      <AppBar sx={{ position: "relative", background: "inherit", color: "black" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontSize={18}>
            {detail ? "Thông tin chi tiết thuốc" : "Thông tin thuốc cần thanh toán"}
          </Typography>

          <Stack flexDirection={"row"} gap={2}>
            {total > 0 ? (
              <Box mt={1} textAlign={"end"}>
                <Box display={"flex"} flexDirection={"row"} justifyContent={"end"}>
                  Tổng tiền:{" "}
                  <strong style={{ color: "red", paddingLeft: "10px" }}>
                    {fNumber(total)} VND
                  </strong>
                </Box>
              </Box>
            ) : null}
            {detail ? null : (
              <Button variant="contained" onClick={() => onReceive?.(data.exam_card_id)}>
                Nhận thuốc và thanh toán
              </Button>
            )}
            <IconButton edge="start" color="error" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <DialogContent sx={SCROLLBAR_CUSTOM}>
        <Stack gap={1}>
          <Typography>
            Chẩn đoán: <b>{data?.diagnosis}</b>
          </Typography>
          <Typography>
            Dặn dò: <b>{data?.note}</b>
          </Typography>
          <Typography>
            Tái khám sau: <b>{data?.quantity_re_exam}</b> ngày (
            <b>{dayjs(data?.date_re_exam).format("DD/MM/YYYY")}</b>)
          </Typography>
        </Stack>

        {data?.details?.length ? <PrescriptionsCollapse data={data?.details} disabled /> : null}
      </DialogContent>
    </Dialog>
  );
};

export default DialogReceiveMedicine;
