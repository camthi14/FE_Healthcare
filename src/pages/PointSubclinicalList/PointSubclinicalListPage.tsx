import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Box, IconButton, TableCell, TableRow } from "@mui/material";
import dayjs from "dayjs";
import { FC, useCallback, useEffect, useMemo } from "react";
import { TableCellOverride, TableRowOverride } from "~/components";
import { appActions } from "~/features/app";
import { examinationCardActions, useExaminationCard } from "~/features/examinationCard";
import { MainLayout } from "~/layouts";
import { GetPatientForDateResponse } from "~/models";
import { useAppDispatch } from "~/stores";
import { ColumnTable } from "~/types";
import { convertExaminationCardOptions } from "~/utils/common";
import { fDateWithMoment } from "~/utils/formatTime";
import DialogDetailsPointSubclinical from "./components/DialogDetailsPointSubclinical";

const { Head, Container, Table, Relative } = MainLayout;

const PointSubclinicalListPage: FC = () => {
  const {
    examinationForDate,
    screenOfDoctorExam: { open },
  } = useExaminationCard();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(appActions.setOpenBackdrop());
    dispatch(
      examinationCardActions.getExaminationForDateStart({
        bookingStatus: "in_progress",
        // bookingStatus: "completed",
        date: examinationForDate.date.format("YYYY-MM-DD"),
      })
    );
  }, [examinationForDate.date]);

  const columns = useMemo(
    (): ColumnTable[] => [
      { id: "STT", label: "STT", minWidth: 60, maxWidth: 60, align: "center" },
      { id: "examinationCardId", label: "M.Ca khám", align: "center" },
      { id: "patientId", label: "M.BN", align: "center" },
      { id: "birth_date", label: "Ngày sinh BN", align: "center" },
      { id: "namePatient", label: "Tên BN", align: "center" },

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
      { id: "action", label: "Hành động", align: "center" },
    ],
    []
  );

  const handleSeeDetails = useCallback((examCard: GetPatientForDateResponse) => {
    dispatch(examinationCardActions.setToggleExamDialog(true));
    dispatch(examinationCardActions.setToggleExamDialogSelected(examCard));
    dispatch(examinationCardActions.setToggleExamCardId(examCard.examinationData.id!));
  }, []);

  return (
    <Box>
      <Head title="Danh sách chỉ định" />

      {open ? <DialogDetailsPointSubclinical /> : null}

      <Container maxWidth="xl">
        <Relative>
          <Table columns={columns} sxTableContainer={{ minHeight: 418 }}>
            {!examinationForDate.data.length ? (
              <TableRow>
                <TableCell colSpan={columns.length} component={"th"} scope="row">
                  Không có danh sách chỉ định
                </TableCell>
              </TableRow>
            ) : (
              examinationForDate.data.map((row, i) => (
                <TableRowOverride key={i}>
                  {columns.map((column) => {
                    const value = row[column.id as keyof GetPatientForDateResponse];

                    if (column.id === "STT") {
                      return (
                        <TableCellOverride key={column.id} {...column}>
                          {i + 1}
                        </TableCellOverride>
                      );
                    }

                    if (column.id === "examinationCardId") {
                      return (
                        <TableCellOverride key={column.id} {...column}>
                          {row.examinationData?.id}
                        </TableCellOverride>
                      );
                    }

                    if (column.id === "patientId") {
                      return (
                        <TableCellOverride key={column.id} {...column}>
                          {row.patient?.id}
                        </TableCellOverride>
                      );
                    }

                    if (column.id === "birth_date") {
                      return (
                        <TableCellOverride key={column.id} {...column}>
                          {row.patient.infoData?.birth_date
                            ? dayjs(new Date(row.patient.infoData?.birth_date)).format("DD/MM/YYYY")
                            : ""}
                        </TableCellOverride>
                      );
                    }

                    if (column.id === "namePatient") {
                      return (
                        <TableCellOverride key={column.id} {...column}>
                          {row.patient.display_name}
                        </TableCellOverride>
                      );
                    }

                    if (column.id === "status") {
                      return (
                        <TableCellOverride key={column.id} {...column}>
                          {convertExaminationCardOptions(row.examinationData.options!)}
                        </TableCellOverride>
                      );
                    }

                    if (column.id === "action") {
                      return (
                        <TableCellOverride key={column.id} {...column}>
                          <IconButton onClick={() => handleSeeDetails(row)} size="small">
                            <RemoveRedEyeIcon fontSize="inherit" />
                          </IconButton>
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
              ))
            )}
          </Table>
        </Relative>
      </Container>
    </Box>
  );
};

export default PointSubclinicalListPage;
