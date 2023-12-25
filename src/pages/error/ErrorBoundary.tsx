import { Helmet } from "react-helmet-async";
import { Link as RouterLink, isRouteErrorResponse, useRouteError } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
import { Button, Typography, Container, Box } from "@mui/material";
import { isError } from "lodash";

// ----------------------------------------------------------------------

const StyledContent = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <Helmet>
          <title> {`${error.status} - ${error.statusText}`} | Manager </title>
        </Helmet>

        <Container>
          <StyledContent sx={{ textAlign: "center", alignItems: "center" }}>
            <Typography variant="h3" paragraph>
              Đã có lỗi xảy ra!
            </Typography>

            <Typography sx={{ color: "text.secondary" }}>
              {`${error.status} - ${error.statusText}`}
            </Typography>

            {error.data?.message && (
              <Typography sx={{ color: "text.secondary" }}>{error.data.message}</Typography>
            )}

            <Box
              component="img"
              src="/assets/illustrations/illustration_404.svg"
              sx={{ height: 260, mx: "auto", my: { xs: 5, sm: 10 } }}
            />

            <Button to="/" size="large" variant="contained" component={RouterLink}>
              Go to Home
            </Button>
          </StyledContent>
        </Container>
      </>
    );
  }

  console.log(error);

  return (
    <>
      <Helmet>
        <title> Oops | Manager </title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: "center", alignItems: "center" }}>
          <Typography variant="h3" paragraph>
            Đã có lỗi xảy ra!
          </Typography>

          {isError(error) && <Typography sx={{ color: "red", mb: 3 }}>{error.message}</Typography>}

          {/* <Box
            component="img"
            src="/assets/illustrations/illustration_404.svg"
            sx={{ height: 260, mx: "auto", my: { xs: 5, sm: 10 } }}
          /> */}

          <Button to="/" size="large" variant="contained" component={RouterLink}>
            Go to Home
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}
