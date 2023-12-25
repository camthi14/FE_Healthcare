import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import MedicationIcon from "@mui/icons-material/Medication";
import { Button, Popover, Stack } from "@mui/material";
import { FC, useMemo } from "react";
import { GetHistoryExamination } from "~/models";

type ActionHistoryProps = {
  anchorEl: HTMLDivElement | null;
  onClose?: () => void;
  item: GetHistoryExamination;

  onSeePrescription?: (item: GetHistoryExamination) => void;
  onSeeAssign?: (item: GetHistoryExamination) => void;
  onSeeBill?: (item: GetHistoryExamination) => void;
};

const ActionHistory: FC<ActionHistoryProps> = ({
  anchorEl,
  item,
  onClose,
  onSeeAssign,
  onSeeBill,
  onSeePrescription,
}) => {
  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  return (
    <Popover
      id={"active-history"}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Stack p={2}>
        <Button
          sx={{ justifyContent: "flex-start" }}
          startIcon={<MedicationIcon />}
          onClick={() => onSeePrescription?.(item)}
        >
          Xem Toa thuốc
        </Button>
        <Button
          color="info"
          sx={{ justifyContent: "flex-start" }}
          startIcon={<HowToRegIcon />}
          onClick={() => onSeeAssign?.(item)}
        >
          Xem chỉ định
        </Button>
        <Button
          color="error"
          sx={{ justifyContent: "flex-start" }}
          startIcon={<AccountBalanceWalletIcon />}
          onClick={() => onSeeBill?.(item)}
        >
          Xem hóa đơn
        </Button>
      </Stack>
    </Popover>
  );
};

export default ActionHistory;
