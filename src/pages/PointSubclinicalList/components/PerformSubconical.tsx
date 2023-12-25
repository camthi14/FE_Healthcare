import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { AppbarDialog, Transition, UploadMultipleImage } from "~/components";
import { UploadMultipleImagePropsRef } from "~/components/shared/form/UploadMultipleImage";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { useSnackbar } from "~/features/app";
import { DiagnosisExaminationCardDetails, ResultsImage } from "~/models";
import DialogConfirmExamination from "~/pages/checkHealthy/components/main/Filter/DialogConfirmExamination";
import { DiagnosisExaminationCardDetailsSchema } from "../schemas/schema";

type DialogPerformSubclinicalProp = {
  open: boolean;
  onClose?: () => void;
  initialValues: DiagnosisExaminationCardDetails;
  onSubmit?: (data: DiagnosisExaminationCardDetails, resetForm: () => void) => void;
};

const DialogPerformSubclinical: FC<DialogPerformSubclinicalProp> = ({
  open,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const lastRef = useRef<any[]>([]);
  const lastRemoveRef = useRef<ResultsImage[]>([]);
  const refImage = useRef<UploadMultipleImagePropsRef | null>(null);
  const { severity } = useSnackbar();

  useEffect(() => {
    if (severity !== "success" || !refImage.current) return;
    refImage.current.resetImages();
    lastRef.current = [];
  }, [severity, refImage.current]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: DiagnosisExaminationCardDetailsSchema,
    onSubmit(values, { resetForm }) {
      // resetForm();
      if (!onSubmit) return;
      onSubmit(values, resetForm);
    },
  });

  const { handleSubmit, errors, touched, values, getFieldProps, setFieldValue } = formik;

  const handleClose = useCallback(() => {
    setOpenConfirm(true);
  }, []);

  useEffect(() => {
    if (values.images?.length) lastRef.current = values.images;
  }, [values]);

  const handleOnAgree = useCallback(() => {
    setOpenConfirm(false);
    onClose?.();
  }, [onClose]);

  const handleOnChangeUpload = useCallback(
    (files: FileList) => {
      const lastValues = [...lastRef.current];
      const newValues = [...lastValues, ...files];

      lastRef.current = newValues;

      setFieldValue("images", newValues);
    },
    [lastRef.current]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const lastValues = [...lastRef.current];

      if (!(lastValues[index] instanceof File)) {
        lastRemoveRef.current = [...lastRemoveRef.current, lastValues[index]];
        setFieldValue(
          "removeImages",
          lastRemoveRef.current.map((v) => ({ id: v.id }))
        );
      }

      const newValues = [...lastValues.filter((_, i) => i !== index)];

      lastRef.current = newValues;

      setFieldValue("images", newValues);
    },
    [lastRef.current, lastRemoveRef.current]
  );

  const handleRemoveAll = useCallback(() => {
    const length = lastRef.current.length;

    for (let index = 0; index < length; index++) {
      const element = lastRef.current[index];

      if (!(element instanceof File)) {
        lastRemoveRef.current = [...lastRemoveRef.current, element];
        setFieldValue(
          "removeImages",
          lastRemoveRef.current.map((v) => ({ id: v.id }))
        );
      }
    }

    setFieldValue("images", []);
    lastRef.current = [];
  }, [lastRemoveRef.current, lastRef.current]);

  return (
    <FormikProvider value={formik}>
      <DialogConfirmExamination
        open={openConfirm}
        text="Bạn có chắc muốn đóng hay không?"
        textConfirm="Xác nhận"
        onAgree={handleOnAgree}
        onClose={() => setOpenConfirm(false)}
      />

      <Dialog
        fullWidth
        maxWidth="lg"
        onClose={handleClose}
        TransitionComponent={Transition}
        open={open}
      >
        <AppbarDialog
          title={`Kết quả CLS. Mã khám chi tiết: ${initialValues.detailsId}. ${
            initialValues.serviceName || ""
          }`}
        >
          <IconButton onClick={handleClose} color="error">
            <HighlightOffIcon />
          </IconButton>
        </AppbarDialog>

        <DialogContent sx={SCROLLBAR_CUSTOM}>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <Stack gap={3}>
              <Stack flexDirection={"row"} alignItems={"flex-end"}>
                <Box width={200}>
                  <Typography>Tên chỉ định</Typography>
                </Box>
                <TextField
                  {...getFieldProps("subclinicalName")}
                  fullWidth
                  variant="standard"
                  disabled
                  sx={{
                    "& input": {
                      fontSize: 14,
                      color: (theme) => theme.palette.success.main,
                      WebkitTextFillColor: "unset !important",
                      fontWeight: 700,
                    },
                  }}
                />
              </Stack>

              <Stack flexDirection={"row"} alignItems={"flex-start"}>
                <Box width={200}>
                  <Typography>
                    Kết quả <b style={{ color: "red" }}>(*)</b>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  {...getFieldProps("results")}
                  error={touched.results && Boolean(errors.results)}
                  helperText={touched.results && errors.results}
                  multiline
                  rows={10}
                  variant="outlined"
                />
              </Stack>

              <Stack flexDirection={"row"} alignItems={"flex-end"}>
                <Box width={200}>
                  <Typography>
                    Đánh giá <b style={{ color: "red" }}>(*)</b>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  {...getFieldProps("rate")}
                  error={touched.rate && Boolean(errors.rate)}
                  helperText={touched.rate && errors.rate}
                  variant="standard"
                  multiline
                />
              </Stack>

              <Stack flexDirection={"row"} alignItems={"flex-start"}>
                <Box width={200}>
                  <Typography>Hình ảnh chẩn đoán</Typography>
                </Box>
                <UploadMultipleImage
                  ref={refImage}
                  defaultImages={initialValues?.images?.map(({ url }) => url) || []}
                  onChange={handleOnChangeUpload}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </Stack>
            </Stack>
          </Form>
        </DialogContent>

        <DialogActions>
          <Stack alignItems={"end"} justifyContent={"end"} gap={5}>
            <Button variant="contained" type="submit" onClick={handleSubmit as () => void}>
              Hoàn thành
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </FormikProvider>
  );
};

export default DialogPerformSubclinical;
