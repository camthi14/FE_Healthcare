import {
  Box,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ChangeEvent, FC, Fragment, ReactNode, useCallback } from "react";
import { Scrollbar } from "~/components";
import { ColumnTable, SXProps } from "~/types";

export type TableCommonProps = {
  columns: ColumnTable[];
  children: ReactNode;
  page?: number;
  totalPage?: number;
  sxColumn?: SXProps;
  sxTableContainer?: SXProps;
  maxHeight?: number;
  autoHeight?: boolean;
  sxHead?: SXProps;
  onChangePage?: (page: number) => void;
};

const TableCommon: FC<TableCommonProps> = (props) => {
  const {
    children,
    columns,
    sxColumn,
    autoHeight,
    onChangePage,
    maxHeight = 440,
    totalPage,
    page,
    sxTableContainer,
    sxHead,
  } = props;

  const handleChangePage = useCallback(
    (_event: ChangeEvent<unknown>, newPage: number) => {
      if (!onChangePage) return;
      onChangePage(newPage);
    },
    [onChangePage]
  );

  const Component = autoHeight ? Fragment : Scrollbar;

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ ...sxTableContainer }}>
        <Component
          {...(!autoHeight
            ? {
                sx: {
                  width: "100%",
                  maxHeight: maxHeight,
                },
              }
            : undefined)}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead sx={sxHead}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sx={sxColumn}
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      ...column.styles,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>{children}</TableBody>
          </Table>
        </Component>
      </TableContainer>
      {totalPage! > 1 ? (
        <Box sx={{ display: "flex", justifyContent: "right", mt: 3 }}>
          <Pagination
            count={totalPage}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            color="primary"
          />
        </Box>
      ) : null}
    </Box>
  );
};

export default TableCommon;
