import SendIcon from "@mui/icons-material/Send";
import { Button, Container, Typography } from "@mui/material";
import { keyframes, styled } from "@mui/material/styles";
import { FC, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { HeadSeo, Logo, ScrollToTop } from "~/components";
import { appActions } from "~/features/app";
import { authActions } from "~/features/auth";
import useResponsive from "~/hooks/useResponsive";
import { useAppDispatch } from "~/stores";
import { AuthRoles, DashboardPaths, LoginPayload } from "~/types";
import { LoginForm } from "./form";

const StyledRoot = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const StyledSection = styled("div")(({ theme }: { theme: any }) => ({
  width: "100%",
  maxWidth: 480,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

const StyledTitle = keyframes`
    0% {
      margin-bottom: -40px;
      margin-top: -40px;
    }
`;

type Props = {
  type: AuthRoles;
};

const LoginPage: FC<Props> = ({ type }) => {
  const mdUp = useResponsive("up", "md");
  const dispatch = useAppDispatch();

  const onSubmit = useCallback(
    (values: LoginPayload) => {
      dispatch(appActions.setOpenBackdrop());

      if (type === "employee") {
        dispatch(authActions.loginEmployeeStart(values));
        return;
      }

      if (type === "doctor") {
        dispatch(authActions.loginDoctorStart(values));
        return;
      }

      dispatch(authActions.loginOwnerStart(values));
    },
    [type]
  );

  const title = useMemo(
    (): string =>
      ({
        doctor: "Đăng nhập dành cho Bác sĩ",
        employee: "Đăng nhập dành cho Nhân viên",
        owner: "Đăng nhập dành cho Chủ quản lý",
      }[type]),
    [type]
  );

  return (
    <>
      <ScrollToTop />

      <HeadSeo title={title} />

      <StyledRoot>
        <Container sx={{ width: "600px" }}>
          <StyledContent>
            <Typography variant="h5" gutterBottom sx={{ textTransform: "uppercase" }}>
              {title}
            </Typography>

            <Typography variant="body2" sx={{ mb: 3, display: "flex", alignItems: "center" }}>
              {title}
            </Typography>

            <LoginForm
              initialValues={{
                username: "",
                password: "",
              }}
              onSubmit={onSubmit}
            />
          </StyledContent>
        </Container>

        <Logo
          sx={{
            position: "fixed",
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection sx={{ px: 5 }}>
            <Typography sx={{ fontSize: 20 }}>WELCOME MANEGER</Typography>
            <Typography
              data-text="HEALTHYCARE"
              className="text-title"
              sx={{
                fontSize: 30,
                lineHeight: 1.2,
                fontWeight: 500,
                letterSpacing: 8,
                color: "#0b52cb",
                textShadow: "1px 1px 2px #fff, 0 0 25px #0b52cb, 0 0 5px #0b52cb",
                position: "relative",
                animation: `${StyledTitle} 2s 1`,
                mb: 2,
                mt: 2,
              }}
            >
              HEALTHYCARE
            </Typography>
            <Typography sx={{ fontSize: 20 }}>Nền tảng y tế chăm sóc sức khoẻ toàn diện</Typography>

            <Typography variant="overline" gutterBottom sx={{ mb: 0, mt: 2 }}>
              <Button
                component={Link}
                to={DashboardPaths.DashboardApp}
                variant="outlined"
                endIcon={<SendIcon />}
              >
                Khám phá
              </Button>
            </Typography>
          </StyledSection>
        )}
      </StyledRoot>
    </>
  );
};

export default LoginPage;
