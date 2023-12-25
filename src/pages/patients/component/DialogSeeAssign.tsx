import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import dayjs from "dayjs";
import { FC } from "react";
import { AppbarDialog, Transition } from "~/components";
import { ExaminationCardsDetailType, GetHistoryExamination } from "~/models";
import TableSeeAssign from "./TableSeeAssign";
import { SCROLLBAR_CUSTOM } from "~/constants";

type DialogSeeAssignProps = {
  open: boolean;
  onClose?: () => void;
  history: GetHistoryExamination;
  data: ExaminationCardsDetailType[];
};

const DialogSeeAssign: FC<DialogSeeAssignProps> = ({ data, history, open, onClose }) => {
  return (
    <Dialog open={open} TransitionComponent={Transition} onClose={onClose} maxWidth="lg" fullWidth>
      <AppbarDialog
        title={`Danh sách chỉ định ngày ${dayjs(history.date).format("DD/MM/YYYY")}. Mã khám bệnh ${
          history.id
        }`}
      >
        <IconButton color="error" size="small" onClick={onClose}>
          <HighlightOffIcon />
        </IconButton>
      </AppbarDialog>

      <DialogContent sx={SCROLLBAR_CUSTOM}>
        <TableSeeAssign data={data} />
      </DialogContent>
    </Dialog>
  );
};

export default DialogSeeAssign;
