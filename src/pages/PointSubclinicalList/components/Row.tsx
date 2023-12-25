import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Alert } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { FC, useState } from "react";
import { MainLayout } from "~/layouts";
import { ExaminationCardsDetailType, ISubclinical } from "~/models";
import { ColumnTable } from "~/types";
import RowItem from "./RowItem";

const { Table } = MainLayout;

type RowProps = {
  columns: ColumnTable[];
  row: ExaminationCardsDetailType;
  index: number;
  onOpenPerForm?: (item: ISubclinical & { detailsId: string; serviceName?: string }) => void;
};

const Row: FC<RowProps> = ({ columns, row, index, onOpenPerForm }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <RowItem
        columns={columns}
        index={index}
        key={index}
        isShowSubIcon
        row={row}
        onOpenSub={() => setOpen((prev) => !prev)}
        openSub={open}
        showActions
        childrenActions={
          <>
            <IconButton
              disabled={Boolean(row.serviceData) || row.status === "finished"}
              onClick={() =>
                onOpenPerForm?.({
                  detailsId: row.id!,
                  ...(row.subclinicalData as ISubclinical),
                  serviceName: "",
                })
              }
              size="small"
              color="info"
            >
              <EditNoteIcon sx={{ width: 25, height: 25 }} />
            </IconButton>
            <IconButton size="small">
              <AssignmentTurnedInIcon sx={{ width: 25, height: 25 }} />
            </IconButton>
          </>
        }
      />

      {row?.serviceData && row?.serviceData?.subclinicalData?.length ? (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box py={2}>
                <Typography variant="h6" gutterBottom component="div">
                  Chi tiết gói dịch vụ: {row.serviceData.name}
                </Typography>
                <Alert color="warning">
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
                        index={index}
                        row={row}
                        key={i}
                        showActions
                        childrenActions={
                          <>
                            <IconButton
                              onClick={() =>
                                onOpenPerForm?.({
                                  detailsId: row.id!,
                                  ...service,
                                  serviceName: row.serviceData?.name,
                                })
                              }
                              size="small"
                              color="info"
                            >
                              <EditNoteIcon sx={{ width: 25, height: 25 }} />
                            </IconButton>
                            <IconButton size="small">
                              <AssignmentTurnedInIcon sx={{ width: 25, height: 25 }} />
                            </IconButton>
                          </>
                        }
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

export default Row;
