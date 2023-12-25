import { Box, Grid, Tab, Tabs } from "@mui/material";
import dayjs from "dayjs";
import {
  FC,
  ReactNode,
  SyntheticEvent,
  lazy,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Loadable } from "~/components";
import { Background, Colors } from "~/constants";
import { appActions } from "~/features/app";
import { frontDeskActions } from "~/features/frontDesk";
import { MainLayout } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { DashboardPaths } from "~/types";
import { Filter } from "./components/main";
import { useAccount } from "~/features/auth";
import { patientActions } from "~/features/patient";
import { useDoctors } from "~/features/doctor";

const { Container, Card } = MainLayout;

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

const TabAboutCheckHealthy = [
  { title: "Thông tin BN", mode: "" },
  { title: "Lịch sử khám", mode: "history-checkup" },
  { title: "Thông tin Khám", mode: "detail-checkup" },
  { title: "Chỉ định CLS", mode: "point-subclinical" },
  { title: "Kê Thuốc", mode: "prescribe-medicine" },
];

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

type Props = {};

const components = (index: number) =>
  ({
    0: Loadable(lazy(() => import("./components/main/InfoPatient")))(),
    1: Loadable(lazy(() => import("./components/main/HistoryCheckup")))(),
    2: Loadable(lazy(() => import("./components/main/CheckHealthyPatient")))(),
    3: Loadable(lazy(() => import("./components/main/PointSubclinical/PointSubclinical")))(),
    4: Loadable(lazy(() => import("./components/main/PrescribeMedicine/PrescribeMedicine")))(),
  }[index]);

const CheckHealthyPage: FC<Props> = () => {
  const dataLoader = useLoaderData() as number;
  const [value, setValue] = useState(0);
  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const doctor = useAccount();
  const {
    screenExamination: { status, statusBooking },
  } = useDoctors();

  useLayoutEffect(() => {
    setValue(dataLoader);
  }, [dataLoader]);

  useEffect(() => {
    dispatch(patientActions.getPatientTypeStart());
  }, []);

  useEffect(() => {
    if (!doctor?.id) return;

    dispatch(appActions.setOpenBackdrop());

    dispatch(
      frontDeskActions.getPatientForDateStart({
        bookingStatus: statusBooking,
        date: dayjs().format("YYYY-MM-DD"),
        examinationStatus: status,
        doctorId: String(doctor.id!),
      })
    );
  }, [doctor?.id, status, statusBooking]);

  const handleChange = useCallback((_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const tab = TabAboutCheckHealthy[newValue];
    navigation(DashboardPaths.FrontDesk + tab.mode && tab.mode !== "" ? `?tab=${tab.mode}` : "");
  }, []);

  return (
    <MainLayout>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item lg={3} md={3}>
            <Card sx={{ p: 1 }}>
              <Filter />
            </Card>
          </Grid>

          <Grid item lg={9} md={9}>
            <Card sx={{ p: 0 }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                TabIndicatorProps={{ sx: { background: Background.blue, height: 2 } }}
                sx={{
                  color: Colors.white,
                  "& button.Mui-selected": { color: Colors.blue },
                }}
              >
                {TabAboutCheckHealthy.map((item, index) => (
                  <Tab
                    key={index}
                    sx={{
                      color: Colors.blue,
                      textTransform: "uppercase",
                      fontWeight: 500,
                      fontSize: "16px",
                      p: "12px",
                    }}
                    label={item.title}
                    {...a11yProps(0)}
                  />
                ))}
              </Tabs>

              <Box sx={{ background: Background.white, m: 2, minHeight: "60vh" }}>
                {TabAboutCheckHealthy.map((_, index) => (
                  <CustomTabPanel value={value} index={index} key={index}>
                    {components(index)}
                  </CustomTabPanel>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default CheckHealthyPage;
