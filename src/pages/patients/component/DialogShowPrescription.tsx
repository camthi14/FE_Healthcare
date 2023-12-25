import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Box, Dialog, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { FC, useMemo } from "react";
import { AppbarDialog, Transition } from "~/components";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { GetHistoryExamination } from "~/models";
import { ResponseGetExamCardAndDetails } from "~/models/prescriptions.model";
import PrescriptionsCollapse from "~/pages/checkHealthy/components/main/PrescribeMedicine/PrescriptionsCollapse";
import { fNumber } from "~/utils/formatNumber";

type DialogShowPrescriptionProps = {
  open: boolean;
  onClose?: () => void;
  history: GetHistoryExamination;
  data: ResponseGetExamCardAndDetails | null;
};

const DialogShowPrescription: FC<DialogShowPrescriptionProps> = ({
  open,
  onClose,
  history,
  data,
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
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth TransitionComponent={Transition}>
      <AppbarDialog
        title={`Toa thuốc ngày ${dayjs(history.date).format("DD/MM/YYYY")}. Mã khám bệnh ${
          history.id
        }`}
      >
        <IconButton color="error" size="small" onClick={onClose}>
          <HighlightOffIcon />
        </IconButton>
      </AppbarDialog>

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

        {total > 0 ? (
          <Box mt={1} textAlign={"end"}>
            <Box display={"flex"} flexDirection={"row"} justifyContent={"end"}>
              Tổng tiền:{" "}
              <strong style={{ color: "red", paddingLeft: "10px" }}>{fNumber(total)} VND</strong>
            </Box>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default DialogShowPrescription;
