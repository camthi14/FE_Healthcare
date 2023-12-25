import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Stack, TableCell, TableRow } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, memo, useCallback, useEffect, useMemo } from "react";
import { TableCellOverride, TableRowOverride } from "~/components";
import { appActions } from "~/features/app";
import { useAccount } from "~/features/auth";
import { useDoctors } from "~/features/doctor";
import { examinationCardActions, useExaminationCard } from "~/features/examinationCard";
import { subclinicalTypeActions, useSubclinicalTypes } from "~/features/subclinicalType";
import { MainLayout } from "~/layouts";
import {
  RequiredExaminationSubclinical,
  RequiredExaminationSubclinicalInitialValues,
  ResultsOptionsGroup,
} from "~/models";
import { useAppDispatch } from "~/stores";
import { ColumnTable } from "~/types";
import { fNumber } from "~/utils/formatNumber";
import GroupAutoComplete from "./GroupAutoComplete";
import HeaderSection from "./HeaderSection";
import SubTotal from "./SubTotal";
import TableRequired from "./TableRequired";
import TableSeeAssign from "~/pages/patients/component/TableSeeAssign";

const { Head, Container, Table } = MainLayout;

const PointSubclinical: FC = () => {
  const dispatch = useAppDispatch();
  const { data } = useSubclinicalTypes();
  const {
    screensOfDoctor: { dataFinished, dataRequired },
  } = useExaminationCard();
  const {
    screenExamination: { selectedExaminationId, patientActive },
  } = useDoctors();
  const doctor = useAccount();

  useEffect(() => {
    if (!selectedExaminationId || !patientActive || !doctor) return;

    const doctorId = String(doctor.id!);
    const examinationCardId = String(patientActive.examinationData.id!);

    dispatch(appActions.setOpenBackdrop());

    dispatch(
      examinationCardActions.getDataRequiredStart({
        doctorId,
        examinationCardId,
        status: "required",
      })
    );

    dispatch(
      examinationCardActions.getDataFinishedStart({
        doctorId,
        examinationCardId,
        status: "finished",
      })
    );
  }, [selectedExaminationId, patientActive, doctor]);

  const initialValues = useMemo((): RequiredExaminationSubclinicalInitialValues => {
    if (!selectedExaminationId || !patientActive || !doctor) {
      return {
        data: [],
        doctorId: "",
        examinationCardId: "",
      };
    }

    return {
      data: [],
      doctorId: String(doctor.id!),
      examinationCardId: patientActive.examinationData.id!,
    };
  }, [selectedExaminationId, patientActive, doctor]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (!values.doctorId || !values.examinationCardId) {
        dispatch(
          appActions.setSnackbar({
            open: true,
            severity: "error",
            text: "Chưa có thông tin bệnh nhân. Vui lòng chọn tab Đang khám bệnh và chọn bệnh nhân",
          })
        );
        return;
      }

      const data: RequiredExaminationSubclinical = {
        data: values.data.map((r) => ({ id: r.id!, price: r.price! })),
        doctorId: values.doctorId,
        examinationCardId: values.examinationCardId,
      };

      dispatch(appActions.setOpenBackdrop());
      dispatch(examinationCardActions.requiredExaminationSubclinicalStart({ data, resetForm }));
    },
  });

  const { values, handleSubmit, setFieldValue } = formik;

  const columns = useMemo(
    (): ColumnTable[] => [
      { id: "stt", label: "STT", minWidth: 40, maxWidth: 40, align: "center" },
      { id: "group", label: "Loại chỉ định", minWidth: 120, maxWidth: 120 },
      { id: "name", label: "Tên dịch vụ", minWidth: 120, maxWidth: 120 },
      { id: "quantity", label: "SL", align: "center", minWidth: 40, maxWidth: 40 },
      {
        id: "price",
        label: "Thành tiền",
        align: "center",
        minWidth: 80,
        maxWidth: 80,
        format(value) {
          return fNumber(value);
        },
      },
      { id: "totalCost", label: "BN Trả", align: "center", minWidth: 80, maxWidth: 80 },
      { id: "delete", label: "Thao tác", align: "center", minWidth: 40, maxWidth: 40 },
    ],
    []
  );

  useEffect(() => {
    dispatch(subclinicalTypeActions.getStart({ limit: 9999 }));
  }, []);

  const total = useMemo(() => {
    return values.data.reduce((total, value) => (total += value.price), 0);
  }, [values]);

  const handleChangeSubclinical = useCallback((values: ResultsOptionsGroup[]) => {
    setFieldValue("data", values);
  }, []);

  return (
    <Box>
      <Head title="Thông tin CLS" />

      <Container maxWidth="xl">
        <Box>
          <Stack>
            <FormikProvider value={formik}>
              <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                <HeaderSection title={"Tạo chỉ định"} />

                <GroupAutoComplete
                  options={data}
                  value={values.data}
                  onChange={handleChangeSubclinical}
                />

                <Table columns={columns} sxTableContainer={{ mt: 2 }}>
                  {values.data.length ? (
                    values.data.map((row, i) => (
                      <TableRowOverride key={i}>
                        {columns.map((column) => {
                          const value = row[column.id as keyof ResultsOptionsGroup];

                          if (column.id === "stt") {
                            return (
                              <TableCellOverride key={column.id} {...column}>
                                {i + 1}
                              </TableCellOverride>
                            );
                          }

                          if (column.id === "totalCost") {
                            return (
                              <TableCellOverride key={column.id} {...column}>
                                {fNumber(row.price)}
                              </TableCellOverride>
                            );
                          }

                          if (column.id === "delete") {
                            return (
                              <TableCellOverride key={column.id} {...column}>
                                <IconButton size="small">
                                  <DeleteIcon fontSize="inherit" />
                                </IconButton>
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

                          return (
                            <TableCellOverride key={column.id} {...column}>
                              {column.format ? column.format(value as string) : (value as string)}
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

                {total > 0 ? (
                  <SubTotal onClick={handleSubmit as () => void} options="create" total={total} />
                ) : null}
              </Form>
            </FormikProvider>
          </Stack>

          <Stack my={3}>
            <HeaderSection title={"Đã yêu cầu"} />

            <TableRequired columns={columns} data={dataRequired} />

            {dataRequired.length ? <SubTotal options="required" /> : null}
          </Stack>

          <Stack my={2}>
            <HeaderSection title={"Đã hoàn thành"} />

            <TableSeeAssign data={dataFinished} />

            {dataFinished.length ? <SubTotal options="finished" /> : null}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default memo(PointSubclinical);
