import { Container, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { Colors, FlexCenter } from "~/constants";
import { appActions, useReport } from "~/features/app";
import { MainLayout } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { AppWidgetSummary } from "../sections/@dashboard/app";

const { Head } = MainLayout;

export default function DashboardAppPage() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {
    dashboard: { doctor, employee, isBooked, isCanceled, patient, examinationCard },
  } = useReport();

  useEffect(() => {
    dispatch(appActions.setOpenBackdrop());
    dispatch(appActions.getReportDashboardStart());
  }, []);

  return (
    <MainLayout>
      <Head title="Thống kê" />

      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item lg={12} display={"flex"} flexDirection={"column"}>
            <Grid item lg={12} display={"flex"} flexDirection={"row"}>
              <AppWidgetSummary
                title="Bệnh nhân"
                total={patient}
                icon={"mdi:account"}
                sx={{
                  borderRadius: "0%",
                  ...FlexCenter,
                  width: "100%",
                  height: "100px",
                  border: "none",
                  boxShadow: "0",
                  color: "tomato",
                }}
                colorIcon={"tomato"}
              />
              <AppWidgetSummary
                title="Bác sĩ"
                total={doctor}
                icon={"fontisto:doctor"}
                sx={{
                  borderRadius: "0%",
                  ...FlexCenter,
                  width: "100%",
                  height: "100px",
                  border: "none",
                  boxShadow: "0",
                  color: Colors.blue,
                }}
                colorIcon={Colors.blue}
              />
              <AppWidgetSummary
                title="Nhân viên"
                total={employee}
                icon={"healthicons:health-worker-outline"}
                sx={{
                  borderRadius: "0%",
                  ...FlexCenter,
                  width: "100%",
                  height: "100px",
                  border: "none",
                  boxShadow: "0",
                  color: "brown",
                }}
                colorIcon={"brown"}
              />
              <AppWidgetSummary
                title="Lịch đặt khám"
                total={isBooked}
                icon={"vaadin:health-card"}
                sx={{
                  borderRadius: "0%",
                  ...FlexCenter,
                  width: "100%",
                  height: "100px",
                  border: "none",
                  boxShadow: "0",
                  color: "purple",
                }}
                colorIcon={"purple"}
              />
            </Grid>
            <Grid item lg={12} display={"flex"} flexDirection={"row"}>
              <AppWidgetSummary
                title="Hoàn thành khám"
                total={examinationCard}
                icon={"icon-park-outline:success"}
                sx={{
                  borderRadius: "0%",
                  ...FlexCenter,
                  width: "100%",
                  height: "100px",
                  border: "none",
                  boxShadow: "0",
                  color: Colors.green,
                }}
                colorIcon={Colors.green}
              />
              <AppWidgetSummary
                title="Lịch bệnh nhân đã hủy"
                total={isCanceled}
                icon={"material-symbols-light:free-cancellation-sharp"}
                sx={{
                  borderRadius: "0%",
                  ...FlexCenter,
                  width: "100%",
                  height: "100px",
                  border: "none",
                  boxShadow: "0",
                  color: Colors.red,
                }}
                colorIcon={Colors.red}
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}
