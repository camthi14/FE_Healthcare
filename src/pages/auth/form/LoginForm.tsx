import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Stack, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import React, { FC } from "react";
import { InputSecure } from "~/components";
import { LoginPayload } from "~/types";
import { DialogForgotPass } from "../components/DialogForgotPass";
import loginSchema from "../schema/loginSchema";
import { useAuth } from "~/features/auth";

type LoginProps = {
  initialValues: LoginPayload;
  onSubmit?: (...args: any[]) => void;
};

const LoginForm: FC<LoginProps> = ({ initialValues, onSubmit }) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      if (!onSubmit) return;
      onSubmit?.(values);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;
  const { isLoading } = useAuth();

  const handleClick = () => {};

  const [open, setOpen] = React.useState(false);

  const handleClickDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            <Grid item lg={12} md={12} xs={12}>
              <TextField
                label="Tài khoản"
                placeholder="Nhập chính xác tài khoản của bạn..."
                {...getFieldProps("username")}
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                fullWidth
              />
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              <InputSecure
                label="Mật khẩu"
                placeholder="Nhập chính xác mật khẩu của bạn..."
                {...getFieldProps("password")}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              <Stack sx={{ textAlign: "end" }}>
                <Box>
                  <Button color="error" sx={{ cursor: "pointer" }} onClick={handleClickDialog}>
                    Quên mật khẩu?
                  </Button>
                </Box>
              </Stack>
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={handleClick}
                loading={isLoading === "pending"}
                disabled={isLoading === "pending"}
              >
                Đăng nhập
              </LoadingButton>
            </Grid>
          </Grid>

          <DialogForgotPass
            openDialog={open}
            isDoctor
            isOwner
            handleCloseDialog={handleCloseDialog}
          />
        </Form>
      </FormikProvider>
    </>
  );
};
export default LoginForm;
