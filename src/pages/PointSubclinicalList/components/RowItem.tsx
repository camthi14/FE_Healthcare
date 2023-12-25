import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, ReactNode, useMemo, useState } from "react";
import { LazyLoadImage, TableCellOverride, TableRowOverride } from "~/components";
import { Colors } from "~/constants";
import { ExaminationCardsDetailType, ISubclinical } from "~/models";
import {
  ResultsDiagnosisSubclinical,
  ResultsImage,
} from "~/models/resultsDiagnosisSubclinical.model";
import { ColumnTable } from "~/types";
import {
  convertExaminationCardDetailStatus,
  convertExaminationCardDetailStatusColor,
} from "~/utils/common";

type RowItemProps = {
  columns: ColumnTable[];
  row: ExaminationCardsDetailType;
  index: number;
  openSub?: boolean;
  onOpenSub?: () => void;
  showCollapse?: boolean;

  showActions?: boolean;
  childrenActions?: ReactNode;
  results?: ResultsDiagnosisSubclinical | null;

  isShowSubIcon?: boolean;
};

const SPACING = 100;

const RowItem: FC<RowItemProps> = ({
  columns,
  index,
  row,
  onOpenSub,
  openSub,
  childrenActions,
  showCollapse,
  showActions,
  isShowSubIcon,
  results,
}) => {
  const [openCollapse, setOpenCollapse] = useState(false);

  const showResults = useMemo(() => Boolean(row.results || showCollapse), [row, showCollapse]);

  const result = useMemo(() => {
    if (showCollapse) return results;

    return row.results;
  }, [results, row, showCollapse]);

  return (
    <>
      <TableRowOverride>
        {columns.map((column) => {
          const value = row[column.id as keyof ExaminationCardsDetailType];

          if (column.id === "STT") {
            return (
              <TableCellOverride key={column.id} {...column}>
                {isShowSubIcon && row?.serviceData ? (
                  <IconButton aria-label="expand row" size="small" onClick={onOpenSub}>
                    {openSub ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                ) : null}

                {showResults ? (
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpenCollapse((prev) => !prev)}
                  >
                    {openCollapse ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                ) : null}

                {index + 1}
              </TableCellOverride>
            );
          }

          if (column.id === "examinationCardId") {
            return (
              <TableCellOverride key={column.id} {...column}>
                {row.examination_card_id}
              </TableCellOverride>
            );
          }

          if (column.id === "doctor") {
            return (
              <TableCellOverride key={column.id} {...column}>
                {row.doctorName || "Không có"}
              </TableCellOverride>
            );
          }

          if (column.id === "nameSubclinical") {
            return (
              <TableCellOverride key={column.id} {...column}>
                {row.subclinicalData
                  ? (row.subclinicalData as ISubclinical)?.name
                  : `Gói DV: ${row.serviceData?.name}`}
              </TableCellOverride>
            );
          }

          if (column.id === "status") {
            return (
              <TableCellOverride key={column.id} {...column}>
                <Typography
                  fontSize={14}
                  color={convertExaminationCardDetailStatusColor(row.status!)}
                >
                  {convertExaminationCardDetailStatus(row.status!)}
                </Typography>
              </TableCellOverride>
            );
          }

          if (showActions && column.id === "action") {
            return (
              <TableCellOverride key={column.id} {...column}>
                {childrenActions}
              </TableCellOverride>
            );
          }

          return (
            <TableCellOverride key={column.id} {...column}>
              {column.format ? column.format(value as string) : (value as string)}
            </TableCellOverride>
          );
        })}
      </TableRowOverride>

      {showResults && result ? (
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0, background: Colors.blueLight }}
            colSpan={columns.length}
          >
            <Collapse in={openCollapse} timeout="auto" unmountOnExit>
              <Box py={2}>
                <Typography variant="h6" gutterBottom component="div">
                  Kết quản khám:
                </Typography>

                <Stack flexDirection={"row"} gap={0.5}>
                  <Typography minWidth={80} fontSize={14}>
                    Kết quả:
                  </Typography>
                  <b>{result?.results}</b>
                </Stack>

                <Stack mt={1} flexDirection={"row"} gap={0.5}>
                  <Typography minWidth={80} fontSize={14}>
                    Đánh giá:
                  </Typography>
                  <b>{result?.rate}</b>
                </Stack>

                {result.images?.length ? (
                  <Stack mt={1} flexDirection={"row"} gap={0.5}>
                    <Typography minWidth={80} fontSize={14}>
                      Hình ảnh:
                    </Typography>

                    <Stack width={"100%"} flexWrap={"wrap"} flexDirection={"row"} gap={1}>
                      {(result.images as ResultsImage[])?.map(({ url }, index) => (
                        <Stack
                          key={index}
                          sx={{ borderRadius: 2, overflow: "hidden" }}
                          component={Paper}
                          elevation={3}
                          position={"relative"}
                        >
                          <LazyLoadImage
                            src={url}
                            sxBox={{
                              width: SPACING,
                              height: SPACING,
                              borderRadius: 2,
                              transition: "all 0.25s ease-in-out",
                              "&:hover": { transform: "scale(1.2)" },
                            }}
                            sxImage={{
                              width: SPACING,
                              height: SPACING,
                              borderRadius: 2,
                            }}
                          />
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                ) : null}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
};

export default RowItem;
