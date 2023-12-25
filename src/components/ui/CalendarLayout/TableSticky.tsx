import { Table, TableContainer } from "@mui/material";
import { FC, ReactNode, memo } from "react";
import { Colors } from "~/constants";

type TableStickyProps = {
  children: ReactNode;
};

const TableSticky: FC<TableStickyProps> = ({ children }) => {
  return (
    <TableContainer
      sx={{
        "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
        "&::-webkit-scrollbar-thumb": {
          background: (theme) => theme.palette.grey[300],
          borderRadius: 20,
        },
        "&::-webkit-scrollbar": { width: "5px", height: 8 },
        "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
      }}
    >
      <Table
        sx={{
          "& > tbody > tr > td:nth-of-type(1), & > thead > tr  > th:nth-of-type(1)": {
            position: "sticky",
            left: 0,
            width: "100%",
            background: Colors.white,
          },
          "& td, & th": {
            border: "1px dashed rgba(0, 0 ,0, 0.5)",
          },
        }}
      >
        {children}
      </Table>
    </TableContainer>
  );
};

export default memo(TableSticky);
