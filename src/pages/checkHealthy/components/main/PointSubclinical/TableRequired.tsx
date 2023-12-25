import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, TableCell, TableRow } from "@mui/material";
import { FC } from "react";
import { TableCellOverride, TableRowOverride } from "~/components";
import { MainLayout } from "~/layouts";
import { ExaminationCardsDetailType, ISubclinical } from "~/models";
import { ColumnTable } from "~/types";
import { fNumber } from "~/utils/formatNumber";

type TableRequiredProps = {
  data: ExaminationCardsDetailType[];
  columns: ColumnTable[];
};

const { Table } = MainLayout;

const TableRequired: FC<TableRequiredProps> = ({ columns, data }) => {
  return (
    <Table columns={columns} sxTableContainer={{ mt: 2 }}>
      {data.length ? (
        data.map((row, i) => (
          <TableRowOverride key={i}>
            {columns.map((column) => {
              const subclinical = row.subclinicalData as ISubclinical;

              if (column.id === "stt") {
                return (
                  <TableCellOverride key={column.id} {...column}>
                    {i + 1}
                  </TableCellOverride>
                );
              }

              if (column.id === "group") {
                return (
                  <TableCellOverride key={column.id} {...column}>
                    {subclinical?.dataSubclinicalType?.name}
                  </TableCellOverride>
                );
              }

              if (column.id === "name") {
                return (
                  <TableCellOverride key={column.id} {...column}>
                    {subclinical.name}
                  </TableCellOverride>
                );
              }

              if (column.id === "quantity") {
                return (
                  <TableCellOverride key={column.id} {...column}>
                    1
                  </TableCellOverride>
                );
              }

              if (column.id === "totalCost" || column.id === "price") {
                return (
                  <TableCellOverride key={column.id} {...column}>
                    {fNumber(subclinical.price)}
                  </TableCellOverride>
                );
              }

              return (
                <TableCellOverride key={column.id} {...column}>
                  <IconButton size="small">
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </TableCellOverride>
              );
            })}
          </TableRowOverride>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} align="center">
            Chưa có chỉ định cận lâm sàng
          </TableCell>
        </TableRow>
      )}
    </Table>
  );
};

export default TableRequired;
