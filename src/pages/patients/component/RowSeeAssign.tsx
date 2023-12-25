import { Alert } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { FC, useMemo, useState } from "react";
import { MainLayout } from "~/layouts";
import { ExaminationCardsDetailType } from "~/models";
import RowItem from "~/pages/PointSubclinicalList/components/RowItem";
import { ColumnTable } from "~/types";

const { Table } = MainLayout;

type RowSeeAssignProps = {
  columns: ColumnTable[];
  row: ExaminationCardsDetailType;
  index: number;
};

const RowSeeAssign: FC<RowSeeAssignProps> = ({ columns, row, index }) => {
  const [open, setOpen] = useState(false);

  const showResults = useMemo(() => Boolean(row.results), [row]);

  return (
    <>
      <RowItem
        columns={columns}
        index={index}
        key={index}
        isShowSubIcon={!showResults}
        row={row}
        onOpenSub={() => setOpen((prev) => !prev)}
        openSub={open}
        showActions={false}
      />

      {row?.serviceData && row?.serviceData?.subclinicalData?.length ? (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box py={2}>
                <Typography variant="h6" gutterBottom component="div">
                  Chi tiết gói dịch vụ: {row.serviceData.name}
                </Typography>
                <Alert sx={{ mb: 2 }} color="warning">
                  Phải hoàn thành hết tất cả trong gói dịch vụ khám thì mới có thể chuyển sang trạng
                  thái hoàn thành
                </Alert>
                <Table
                  autoHeight
                  columns={columns}
                  sxColumn={{ background: (theme) => theme.palette.success.main, color: "white" }}
                >
                  {row.serviceData.subclinicalData.map((service, i) => {
                    return (
                      <RowItem
                        columns={columns}
                        showCollapse
                        results={service.results}
                        index={i}
                        row={row}
                        isShowSubIcon={false}
                        key={i}
                        showActions
                      />
                    );
                  })}
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
};

export default RowSeeAssign;
