import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FC } from "react";
import { Transition } from "~/components";
import { GetPatientForDateResponse } from "~/models";

type DialogConfirmExaminationProps = {
  text: string;
  textConfirm: string;
  open: boolean;
  data?: GetPatientForDateResponse;
  onClose?: () => void;
  onAgree?: (data?: GetPatientForDateResponse) => void;
};

const DialogConfirmExamination: FC<DialogConfirmExaminationProps> = ({
  text,
  textConfirm,
  open,
  onAgree,
  data,
  onClose,
}) => {
  return (
    <Dialog
      sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Xác nhận"}</DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">{text}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="error" onClick={onClose}>
          Đóng
        </Button>
        <Button variant="contained" onClick={() => onAgree?.(data)}>
          {textConfirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogConfirmExamination;
