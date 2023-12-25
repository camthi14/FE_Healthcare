import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Background } from "~/constants";

type DialogFormForgotPasswordProps = {
  openDialog: boolean;
  isOwner: boolean;
  isDoctor: boolean;
  handleCloseDialog: () => void;
};

const DialogBooking = ({
  openDialog,
  isOwner,
  isDoctor,
  handleCloseDialog,
}: DialogFormForgotPasswordProps) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        sx={{ textAlign: "center", textTransform: "uppercase", pb: 1 }}
        id="alert-dialog-title"
      >
        {"Yêu cầu đổi mật khẩu"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontStyle: "italic", width: "400px", textAlign: "center" }}>
          Vui lòng nhập email để đặt lại mật khẩu!{" "}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="E-mail"
          type="email"
          fullWidth
          variant="standard"
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Username"
          type="username"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="error"
          sx={{ textTransform: "uppercase", fontWeight: 400 }}
          onClick={handleCloseDialog}
        >
          Huỷ
        </Button>
        <Button
          variant="contained"
          sx={{ background: Background.yellow, textTransform: "uppercase", fontWeight: 400 }}
          onClick={handleCloseDialog}
          autoFocus
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBooking;
