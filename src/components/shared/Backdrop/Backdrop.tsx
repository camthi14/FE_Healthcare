import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { FC } from "react";
import { useBackdrop } from "~/features/app";

const BackdropCommon: FC = () => {
  const { open } = useBackdrop();

  return (
    <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default BackdropCommon;
