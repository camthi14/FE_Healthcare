import { TableCell, TableRow } from "@mui/material";
import { FC } from "react";
import { MainLayout } from "~/layouts";
import { ExaminationCardsDetailType } from "~/models";
import { ColumnTable } from "~/types";
import { fDateWithMoment } from "~/utils/formatTime";
import RowSeeAssign from "./RowSeeAssign";

type TableSeeAssignProps = {
  data: ExaminationCardsDetailType[];
};

const { Table } = MainLayout;

const TableSeeAssign: FC<TableSeeAssignProps> = ({ data }) => {
  const columns: ColumnTable[] = [
    { id: "STT", label: "STT", minWidth: 60, maxWidth: 60, align: "center" },
    { id: "examinationCardId", label: "M.Ca khám", align: "center" },
    { id: "doctor", label: "Bác sĩ CĐ", align: "center" },
    { id: "nameSubclinical", label: "Tên CLS / DV", align: "center" },

    {
      id: "created_at",
      label: "Ngày chỉ định",
      minWidth: 100,
      maxWidth: 100,
      align: "center",
      format(value) {
        return fDateWithMoment(value, undefined, "DD/MM/YYYY HH:mm:ss");
      },
    },

    { id: "status", label: "Trạng thái", align: "center" },
  ];

  return (
    <Table columns={columns} autoHeight>
      {!data.length ? (
        <TableRow>
          <TableCell colSpan={columns.length} component={"th"} scope="row">
            Không có danh sách chỉ định
          </TableCell>
        </TableRow>
      ) : (
        data.map((row, i) => <RowSeeAssign columns={columns} index={i} row={row} key={i} />)
      )}
    </Table>
  );
};

export default TableSeeAssign;
