import { Paper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { FC, MouseEvent, useCallback, useState } from "react";
import { Colors } from "~/constants";
import { GetHistoryExamination } from "~/models";
import ActionHistory from "./ActionHistory";

type CardExaminationItemProps = {
  row: GetHistoryExamination;
  onClickActions: (
    mode: "seeBill" | "seePrescription" | "seeAssign",
    item: GetHistoryExamination
  ) => void;
};

const CardExaminationItem: FC<CardExaminationItemProps> = ({ row, onClickActions }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickActions = useCallback(
    (mode: "seeBill" | "seePrescription" | "seeAssign", item: GetHistoryExamination) => {
      handleClose();
      onClickActions(mode, item);
    },
    [onClickActions]
  );

  return (
    <div>
      <Stack
        onClick={handleClick}
        sx={{
          transition: "all 0.25s ease-in-out",
          "&:hover": {
            background: Colors.blueLight,
          },
        }}
        component={Paper}
        elevation={3}
        minWidth={320}
        p={2}
        gap={1.5}
      >
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          fontSize={14}
          justifyContent={"space-between"}
        >
          <Typography fontSize={14}>Mã khám bệnh:</Typography>
          <b>{row.id}</b>
        </Stack>

        <Stack flexDirection={"row"} justifyContent={"space-between"}>
          <Typography fontSize={14}>Ngày khám: </Typography>
          <b>{dayjs(row.date).format("DD/MM/YYYY")}</b>
        </Stack>

        <Stack flexDirection={"row"} justifyContent={"space-between"}>
          <Typography fontSize={14}>Ca Khám: </Typography>
          <b>{`${row.hour.time_start} - ${row.hour.time_end}`}</b>
        </Stack>

        <Stack flexDirection={"row"} justifyContent={"space-between"}>
          <Typography fontSize={14}>STT: </Typography>
          <b>{`${row.order}`}</b>
        </Stack>

        <Stack flexDirection={"row"} justifyContent={"space-between"}>
          <Typography>Lý do khám: </Typography>
          <b>{`${row.reason}`}</b>
        </Stack>
      </Stack>

      <ActionHistory
        key={row.id}
        onSeePrescription={(item) => handleClickActions("seePrescription", item)}
        onSeeAssign={(item) => handleClickActions("seeAssign", item)}
        onSeeBill={(item) => handleClickActions("seeBill", item)}
        item={row}
        anchorEl={anchorEl}
        onClose={handleClose}
      />
    </div>
  );
};

export default CardExaminationItem;
