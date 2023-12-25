import { Helmet } from "react-helmet-async";
import { faker } from "@faker-js/faker";
import { useTheme } from "@mui/material/styles";
import { Grid, Container } from "@mui/material";
import { Iconify } from "~/components";
import {
  AppOrderTimeline,
  AppCurrentVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppConversionRates,
} from "../sections/@dashboard/app";
import { FlexCenter, Background, Colors } from "~/constants";

export default function DashboardAppPage() {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item lg={12} display={"flex"} flexDirection={"column"}>
            <Grid item lg={12} display={"flex"} flexDirection={"row"}>
              <AppWidgetSummary
                title="Bệnh nhân"
                total={714000}
                icon={"mdi:account"}
                sx={{
                  borderRadius: "0%",
                  ...FlexCenter,
                  width: "100%",
                  height: "100px",
                  border: "none",
                  boxShadow: "0",
                  background: Background.white,
                }}
              />
              <AppWidgetSummary
                title="Bác sĩ"
                total={714000}
                icon={"fontisto:doctor"}
                sx={{
                  borderRadius: "0%",
                  ...FlexCenter,
                  width: "100%",
                  height: "100px",
                  border: "none",
                  boxShadow: "0",
                  background: Background.white,
                }}
              />
              <AppWidgetSummary
                title="Nhân viên"
                total={714000}
                icon={"ant-design:android-filled"}
                sx={{
                  borderRadius: "0%",
                  ...FlexCenter,
                  width: "100%",
                  height: "100px",
                  border: "none",
                  boxShadow: "0",
                  background: Background.white,
                }}
              />
              <AppWidgetSummary
                title="Lịch đặt khám"
                total={714000}
                icon={"tabler:brand-booking"}
                sx={{
                  borderRadius: "0%",
                  ...FlexCenter,
                  width: "100%",
                  height: "100px",
                  border: "none",
                  boxShadow: "0",
                  background: Background.white,
                }}
              />
            </Grid>
            <Grid item lg={12} display={"flex"} flexDirection={"row"}>
              <AppWidgetSummary
                title="Chờ bệnh nhân đến"
                total={714000}
                icon={"tabler:brand-booking"}
                sx={{
                  borderRadius: "0%",
                  ...FlexCenter,
                  width: "100%",
                  height: "100px",
                  border: "none",
                  boxShadow: "0",
                  background: Background.white,
                }}
              />
              <AppWidgetSummary
                title="Chờ khám"
                total={714000}
                icon={"tabler:brand-booking"}
                sx={{
                  borderRadius: "0%",
                  ...FlexCenter,
                  width: "100%",
                  height: "100px",
                  border: "none",
                  boxShadow: "0",
                  background: Background.white,
                }}
              />
              <AppWidgetSummary
                title="Hoàn thành khám"
                total={714000}
                icon={"icon-park-outline:success"}
                sx={{
                  borderRadius: "0%",
                  ...FlexCenter,
                  width: "100%",
                  height: "100px",
                  border: "none",
                  boxShadow: "0",
                  color: Colors.green,
                  background: Background.white,
                }}
              />
              <AppWidgetSummary
                title="Lịch hủy"
                total={714000}
                icon={"tabler:brand-booking"}
                sx={{
                  borderRadius: "0%",
                  ...FlexCenter,
                  width: "100%",
                  height: "100px",
                  border: "none",
                  boxShadow: "0",
                  background: Background.white,
                }}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: "Italy", value: 400 },
                { label: "Japan", value: 430 },
                { label: "China", value: 448 },
                { label: "Canada", value: 470 },
                { label: "France", value: 540 },
                { label: "Germany", value: 580 },
                { label: "South Korea", value: 690 },
                { label: "Netherlands", value: 1100 },
                { label: "United States", value: 1200 },
                { label: "United Kingdom", value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: "America", value: 4344 },
                { label: "Asia", value: 5435 },
                { label: "Europe", value: 1443 },
                { label: "Africa", value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  "1983, orders, $4220",
                  "12 Invoices have been paid",
                  "Order #37745 from September",
                  "New order placed #XF-2356",
                  "New order placed #XF-2346",
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: "FaceBook",
                  value: 323234,
                  icon: <Iconify icon={"eva:facebook-fill"} color="#1877F2" width={32} />,
                },
                {
                  name: "Google",
                  value: 341212,
                  icon: <Iconify icon={"eva:google-fill"} color="#DF3E30" width={32} />,
                },
                {
                  name: "Linkedin",
                  value: 411213,
                  icon: <Iconify icon={"eva:linkedin-fill"} color="#006097" width={32} />,
                },
                {
                  name: "Twitter",
                  value: 443232,
                  icon: <Iconify icon={"eva:twitter-fill"} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
