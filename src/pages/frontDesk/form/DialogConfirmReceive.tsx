import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
  InputAdornment,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, memo, useCallback } from "react";
import { Transition } from "~/components";
import { Background } from "~/constants";
import { frontDeskActions, useFrontDesk } from "~/features/frontDesk";
import { ExaminationCardType } from "~/models";
import { useAppDispatch } from "~/stores";
import { dialogConfirmSchema } from "../schemas/DialogConfirmSchema";

export type DialogConfirmReceiveProps = {
  initialValues: ExaminationCardType;
  onSubmit?: (...args: any[]) => void;
};

const DialogConfirmReceive: FC<DialogConfirmReceiveProps> = ({ onSubmit, initialValues }) => {
  const {
    confirm: { open, displayName },
  } = useFrontDesk();
  const dispatch = useAppDispatch();

  const onClose = useCallback(() => {
    dispatch(
      frontDeskActions.setToggleConfirm({ bookingId: "", open: false, order: 0, displayName: "" })
    );
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: dialogConfirmSchema,
    enableReinitialize: true,
    onSubmit(values, formikHelpers) {
      if (!onSubmit) return;
      onSubmit(values, formikHelpers.resetForm);
    },
  });

  const { handleSubmit, errors, values, touched, getFieldProps, setFieldValue } = formik;

  const handleChangeSwitch = useCallback((_: any, checked: boolean) => {
    setFieldValue("is_use_service", checked);
  }, []);

  return (
    <FormikProvider value={formik}>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", background: Background.blue }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography fontSize={14}>
              {`Xác nhận BN `}{" "}
              <i style={{ fontWeight: "bold", fontSize: 18 }}>{` ${displayName} `}</i>
              {`đã đến. Vui lòng nhập thông tin cơ bản của bệnh nhân`}
            </Typography>
            <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent dividers>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <Box border={({ palette }) => `1px dashed ${palette.grey[400]}`} p={2} m={1}>
              <Grid container spacing={2}>
                <Grid item lg={12}>
                  <Typography sx={{ my: 1 }}>Chỉ số sinh tồn</Typography>
                </Grid>
                <Grid item lg={2} md={2} xs={6}>
                  <TextField
                    size="small"
                    variant="standard"
                    label="Mạch(Lần/phút)"
                    {...getFieldProps("artery")}
                    error={touched.artery && Boolean(errors.artery)}
                    helperText={touched.artery && errors.artery}
                  />
                </Grid>
                <Grid item lg={2} md={2} xs={6}>
                  <TextField
                    size="small"
                    variant="standard"
                    label="Nhiệt độ(Độ C)"
                    {...getFieldProps("temperature")}
                    error={touched.temperature && Boolean(errors.temperature)}
                    helperText={touched.temperature && errors.temperature}
                  />
                </Grid>
                <Grid item lg={2} md={2} xs={6}>
                  <TextField
                    size="small"
                    variant="standard"
                    label="SpO2(%)"
                    {...getFieldProps("spO2")}
                    error={touched.spO2 && Boolean(errors.spO2)}
                    helperText={touched.spO2 && errors.spO2}
                  />
                </Grid>
                <Grid item lg={2} md={2} xs={6}>
                  <TextField
                    size="small"
                    variant="standard"
                    label="Nhịp thở(Nhịp/phút)"
                    {...getFieldProps("breathing_rate")}
                    error={touched.breathing_rate && Boolean(errors.breathing_rate)}
                    helperText={touched.breathing_rate && errors.breathing_rate}
                  />
                </Grid>
                <Grid item lg={2} md={2} xs={6}>
                  <TextField
                    sx={{ p: 0 }}
                    size="small"
                    variant="standard"
                    label="Huyết áp(mmHg)"
                    {...getFieldProps("blood_pressure")}
                    error={
                      (touched.blood_pressure && Boolean(errors.blood_pressure)) ||
                      (touched.under_blood_pressure && Boolean(errors.under_blood_pressure))
                    }
                    helperText={
                      (touched.blood_pressure && errors.blood_pressure) ||
                      (touched.under_blood_pressure && errors.under_blood_pressure)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <TextField
                            size="small"
                            variant="standard"
                            {...getFieldProps("under_blood_pressure")}
                            error={
                              touched.under_blood_pressure && Boolean(errors.under_blood_pressure)
                            }
                            InputProps={{
                              startAdornment: <InputAdornment position="start">/</InputAdornment>,
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Form>
        </DialogContent>
        <DialogActions>
          <Stack flexDirection={"row"}>
            <FormControlLabel
              control={
                <Switch
                  color="success"
                  onChange={handleChangeSwitch}
                  checked={values.is_use_service}
                />
              }
              labelPlacement="start"
              label={values.is_use_service ? "Sử dụng dịch vụ" : "Không sử dụng dịch vụ"}
            />
          </Stack>
          <Box>
            <Button
              type="submit"
              sx={{ minWidth: 120, color: "white" }}
              variant="contained"
              color="success"
              onClick={handleSubmit as () => void}
            >
              Xác nhận
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </FormikProvider>
  );
};

export default memo(DialogConfirmReceive);
