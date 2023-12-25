import { TableCell } from "@mui/material";
import { FC, ReactNode } from "react";
import { ColumnTable } from "~/types";

type TableCellOverrideProps = {
  children: ReactNode;
} & ColumnTable;

const TableCellOverride: FC<TableCellOverrideProps> = (props) => {
  return (
    <TableCell
      style={{
        minWidth: props.minWidth,
        maxWidth: props.maxWidth,
        ...props.styles,
      }}
      key={props.id}
      component="th"
      scope="row"
      align={props.align}
    >
      {props.children}
    </TableCell>
  );
};

export default TableCellOverride;
