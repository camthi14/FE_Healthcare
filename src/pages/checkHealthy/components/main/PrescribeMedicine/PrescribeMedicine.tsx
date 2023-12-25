import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { Form, FormikProvider, useFormik } from "formik";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { Iconify } from "~/components";
import { appActions } from "~/features/app";
import { useAccount } from "~/features/auth";
import { useDoctors } from "~/features/doctor";
import { examinationCardActions, usePrescription } from "~/features/examinationCard";
import { medicineTypeActions, useMedicineTypes } from "~/features/medicineType";
import { patientActions, usePatients } from "~/features/patient";
import { MainLayout } from "~/layouts";
import { GetHistoryExamination } from "~/models";
import {
  AddPrescriptionDetailsPayload,
  MedicineOptionsInPrescription,
  MedicineOptionsInPrescriptionPayload,
} from "~/models/prescriptions.model";
import { fNumber } from "~/utils/formatNumber";
import DialogPrescribeMedicine from "../../form/DialogPrescribeMedicine";
import GroupAutoCompleteMedicine from "./GroupAutoCompleteMedicine";
import PrescriptionsCollapse from "./PrescriptionsCollapse";

const { Head, Container } = MainLayout;

export interface DataList {
  code: string;
  name: string;
  typeMedicine: string;
  amount: string;
  price: string;
  pay: string;
  note: string;
}

const PrescribeMedicine = () => {
  const dispatch = useDispatch();

  const [openPrescribe, setOpenPrescribe] = useState(false);
  const { data } = useMedicineTypes();
  const lastCurrentValues = useRef<MedicineOptionsInPrescriptionPayload | null>(null);

  const {
    screenExamination: { selectedExaminationId, patientActive },
  } = useDoctors();

  const {
    historyExamination: { data: dataHistory, prescriptions },
  } = usePatients();

  const doctor = useAccount();

  const { selected } = usePrescription();

  const initialValues = useMemo((): MedicineOptionsInPrescriptionPayload => {
    if (!doctor || !selectedExaminationId)
      return { doctorId: "", examCardId: "", medicines: [], quantityReExam: 7 };

    let medicines: MedicineOptionsInPrescription[] = [];
    let quantityReExam = 7;

    if (prescriptions && prescriptions?.details?.length) {
      medicines = prescriptions.details;
      quantityReExam = Number(prescriptions.quantity_re_exam);
    }

    return {
      doctorId: String(doctor.id),
      examCardId: selectedExaminationId,
      medicines: medicines,
      quantityReExam: quantityReExam,
    };
  }, [doctor, selectedExaminationId, prescriptions, dataHistory]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (!selected) {
        dispatch(
          appActions.setSnackbar({
            open: true,
            severity: "error",
            text: "Vui lòng chẩn đoán bệnh trước khi thêm toa thuốc.",
          })
        );

        return;
      }

      if (!values.examCardId) {
        dispatch(
          appActions.setSnackbar({ open: true, severity: "error", text: "Vui lòng chọn bệnh nhân" })
        );

        return;
      }

      if (!values?.medicines?.length) {
        dispatch(
          appActions.setSnackbar({ open: true, severity: "error", text: "Vui lòng kê toa thuốc" })
        );

        return;
      }

      const data: AddPrescriptionDetailsPayload = {
        exam_card_id: values.examCardId,
        medicines: values.medicines.map((t) => ({
          id: t.prescription_details_id,
          amount_of_medication_per_session: Number(t.amount_of_medication_per_session),
          medicine_id: t.id,
          quantity_ordered: Number(t.quantity_ordered),
          note: t.note,
          amount_use_in_day: t.amount_use_in_day,
          session: t.session,
        })),
        prescriptions_id: selected.id!,
        quantityReExam: Number(values.quantityReExam),
        totalCost: values.medicines.reduce(
          (total, value) =>
            (total += Number(value?.infoData?.price_sell) * Number(value.quantity_ordered) || 0),
          0
        ),
      };

      dispatch(appActions.setOpenBackdrop());
      dispatch(examinationCardActions.prescriptionAddDetailsStart({ data, resetForm }));
    },
  });

  const { values, setFieldValue, getFieldProps, handleChange, handleSubmit } = formik;

  useLayoutEffect(() => {
    lastCurrentValues.current = values;
  }, [values]);

  useEffect(() => {
    dispatch(medicineTypeActions.getStart({ limit: 9999 }));
  }, []);

  useEffect(() => {
    if (!patientActive?.patient?.id) {
      return;
    }

    dispatch(appActions.setOpenBackdrop());
    dispatch(patientActions.getHistoryExaminationStart({ patientId: patientActive?.patient.id }));
  }, [patientActive]);

  useEffect(() => {
    if (!selectedExaminationId || !doctor) return;

    dispatch(appActions.setOpenBackdrop());
    dispatch(patientActions.getExaminationCardAndDetailsSuccess(null));

    dispatch(
      examinationCardActions.prescriptionGetByExamCardIdStart({
        doctorId: String(doctor.id),
        examCardId: selectedExaminationId,
      })
    );
  }, [selectedExaminationId, doctor]);

  const handleClose = () => {
    setOpenPrescribe(false);
  };

  const total = useMemo(() => {
    return values.medicines.reduce(
      (total, value) =>
        (total += Number(value?.infoData?.price_sell) * Number(value.quantity_ordered) || 0),
      0
    );
  }, [values]);

  const handleSelectMedicine = useCallback(
    (value: MedicineOptionsInPrescription[], details?: MedicineOptionsInPrescription) => {
      if (details) {
        const index = value.findIndex((t) => t.id! === details.id!);

        if (index !== -1) {
          value[index] = {
            ...value[index],
            quantity_ordered:
              Number(value[index].amount_use_in_day) *
              Number(value[index].amount_of_medication_per_session) *
              Number(values.quantityReExam),
          };
        }
      }

      setFieldValue("medicines", value);
    },
    [values]
  );

  const handleChangeValue = useCallback(
    (key: keyof MedicineOptionsInPrescription, value: string | number, index: number) => {
      if (!lastCurrentValues.current) return;

      const lastValue: MedicineOptionsInPrescription[] = [...lastCurrentValues.current.medicines];

      lastValue[index] = {
        ...lastValue[index],
        [key]: value,
      };

      if (key === "amount_of_medication_per_session") {
        lastValue[index].quantity_ordered =
          Number(lastValue[index].amount_use_in_day) *
          Number(value) *
          Number(values.quantityReExam);
      }

      if (key === "amount_use_in_day") {
        lastValue[index].quantity_ordered =
          Number(lastValue[index].amount_of_medication_per_session) *
          Number(value) *
          Number(values.quantityReExam);

        let message = "sáng";

        if (Number(value) === 2) {
          message = "sáng, chiều";
        }

        if (Number(value) === 3) {
          message = "sáng, chiều, tối";
        }

        lastValue[index].session = message;
      }

      setFieldValue("medicines", lastValue);
    },
    [lastCurrentValues.current]
  );

  const handleRemoveItem = useCallback(
    (id: string) => {
      const lastValue = [...values.medicines];

      setFieldValue("medicines", [...lastValue.filter((t) => t.id !== id)]);
    },
    [values]
  );

  const handleChangeReExam = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      handleChange("quantityReExam")(value);
      let lastValues = [...values.medicines];

      lastValues = lastValues.map((v) => {
        return {
          ...v,
          quantity_ordered:
            Number(v.amount_use_in_day) *
            Number(v.amount_of_medication_per_session) *
            Number(value),
        };
      });

      setFieldValue("medicines", lastValues);
    },
    [values]
  );

  const handleSelectedPrescription = useCallback((item: GetHistoryExamination) => {
    dispatch(appActions.setOpenBackdrop());
    dispatch(patientActions.getExaminationCardAndDetailsStart(String(item.id)));
  }, []);

  return (
    <FormikProvider value={formik}>
      <Box>
        <Head title="Thông tin kê thuốc" />

        <DialogPrescribeMedicine
          onClose={handleClose}
          open={openPrescribe}
          // onSubmit={handleSubmit}
        />

        <Container maxWidth="xl">
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            {/* <Box justifyContent={"space-between"} display={"flex"} mt={3} mb={2}>
              <Typography>Đơn thuốc tự nguyện</Typography>
              <Button
                variant="contained"
                onClick={handleOpenPrescribe}
                color="success"
                sx={{ color: Colors.white }}
              >
                <Iconify mr={1} icon="ic:baseline-plus" /> Kê đơn thuốc
              </Button>
            </Box> */}

            <Box>
              <Box border={({ palette }) => `1px dashed ${palette.grey[400]}`} p={2}>
                <Stack gap={1}>
                  <Typography>Bác sĩ kê đơn: {doctor?.display_name}</Typography>
                  <Typography>Thời gian y lệnh: {dayjs().format("HH:mm DD/MM/YYYY")}</Typography>
                  <Typography>
                    Chẩn đoán: <b>{selected?.diagnosis || "Chưa có chẩn đoán"}</b>
                  </Typography>

                  <Alert severity="error">
                    Lời dặn của bác sĩ: <b>{selected?.note || "Không có dặn dò"}</b>
                  </Alert>

                  {dataHistory?.length ? (
                    <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
                      <Typography>Toa thuốc cũ:</Typography>
                      <Stack flexDirection={"row"} gap={1}>
                        {dataHistory.map((history) => (
                          <Stack key={history.id}>
                            <Chip
                              label={history.reason}
                              onClick={() => handleSelectedPrescription(history)}
                            />
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  ) : null}
                </Stack>
              </Box>

              <Stack mt={2} justifyContent={"space-between"} flexDirection={"row"}>
                <GroupAutoCompleteMedicine
                  onChange={handleSelectMedicine}
                  options={data}
                  value={values.medicines}
                />

                <FormControl>
                  <TextField
                    label="Tái khám sau"
                    size="small"
                    {...getFieldProps("quantityReExam")}
                    onChange={handleChangeReExam}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography fontSize={14} fontWeight={700}>
                            Ngày
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    helperText={`${dayjs()
                      .add(values.quantityReExam, "days")
                      .format("DD/MM/YYYY")}`}
                  />
                </FormControl>
              </Stack>

              <PrescriptionsCollapse
                onRemove={handleRemoveItem}
                onChangeValue={handleChangeValue}
                data={values.medicines}
              />

              {total > 0 ? (
                <Box mt={1} textAlign={"end"}>
                  <Box display={"flex"} flexDirection={"row"} justifyContent={"end"}>
                    Tổng tiền:{" "}
                    <strong style={{ color: "red", paddingLeft: "10px" }}>
                      {fNumber(total)} VND
                    </strong>
                  </Box>
                </Box>
              ) : null}
            </Box>

            <Box textAlign={"end"} my={3}>
              {/* <Button variant="outlined" sx={{ mr: "4px" }} color="error">
                Huỷ đơn
              </Button>
              <Button variant="contained" color="success" sx={{ color: Colors.white, mr: "4px" }}>
                Chỉnh sửa
              </Button> */}
              {/* <Button variant="contained" sx={{ mr: "4px" }}>
                In đơn thuốc
              </Button> */}
              <Button type="submit" variant="contained" sx={{ mr: "4px" }}>
                <Iconify mr={1} width={23} height={23} icon={"bx:save"} />
                Lưu
              </Button>
            </Box>
          </Form>
        </Container>
      </Box>
    </FormikProvider>
  );
};

export default PrescribeMedicine;
