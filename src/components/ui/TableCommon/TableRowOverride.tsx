import { TableRow } from "@mui/material";
import { FC, ReactNode } from "react";

type TableRowOverrideProps = {
  children: ReactNode;
};

const TableRowOverride: FC<TableRowOverrideProps> = ({ children }) => {
  return (
    <TableRow sx={{ "&:hover": { background: (theme) => theme.palette.grey[100] } }}>
      {children}
    </TableRow>
  );
};

export default TableRowOverride;
