import { Stack, TableCell, Typography } from "@mui/material";
import { upperFirst } from "lodash";
import { FC } from "react";
import { Colors } from "~/constants";
import { SelectWeekResponse } from "~/utils/common";

type CellHeaderTimeProps = {
  date: SelectWeekResponse;
};

const CellHeaderTime: FC<CellHeaderTimeProps> = ({ date }) => {
  return (
    <TableCell key={date.day} style={{ minWidth: 130, padding: 0 }}>
      <Stack
        sx={{
          background: date.active ? Colors.blueLight : date.disabled ? Colors.gray : Colors.white,
          p: 2,
          cursor: date.disabled ? "no-drop" : "default",
        }}
        alignItems={"center"}
      >
        <Typography fontSize={14} fontWeight={700} textAlign={"center"}>{`${upperFirst(
          date.dayjs.format("dddd, DD/MM/YYYY")
        )}`}</Typography>
      </Stack>
    </TableCell>
  );
};

export default CellHeaderTime;
