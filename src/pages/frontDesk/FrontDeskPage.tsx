import { Box, Tab, Tabs } from "@mui/material";
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
import { patientActions } from "~/features/patient";
import { MainLayout } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { DashboardPaths } from "~/types";

const { Container, Card } = MainLayout;

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
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
    </Box>
  );
}

const TabAboutFrontDesk = [
  { title: "Đăng ký khám", mode: "" },
  { title: "Danh sách tiếp nhận", mode: "receive" },
  { title: "Danh sách nhận thuốc", mode: "list-patient" },
  { title: "Danh sách hóa đơn chỉ định", mode: "bill-subclinical" },
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
    0: Loadable(lazy(() => import("./PatientBookPage")))(),
    1: Loadable(lazy(() => import("./ReceiveRecordPage")))(),
    2: Loadable(lazy(() => import("./ListPatientConfirmedPage")))(),
    3: Loadable(lazy(() => import("./ListBillSubclinical")))(),
  }[index]);

const FrontDeskPage: FC<Props> = () => {
  const dataLoader = useLoaderData() as number;
  const [value, setValue] = useState(0);
  const navigation = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(patientActions.getPatientTypeStart());
  }, []);

  useLayoutEffect(() => {
    setValue(dataLoader);
  }, [dataLoader]);

  const handleChange = useCallback((_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const tab = TabAboutFrontDesk[newValue];
    navigation(DashboardPaths.FrontDesk + tab.mode && tab.mode !== "" ? `?tab=${tab.mode}` : "");
  }, []);

  return (
    <MainLayout>
      <Container maxWidth="xl">
        <Card sx={{ p: 0, pb: 3 }}>
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
            {TabAboutFrontDesk.map((item, index) => (
              <Tab
                key={index}
                sx={{
                  color: Colors.blue,
                  textTransform: "uppercase",
                  fontWeight: 500,
                  fontSize: "16px",
                  p: "12px 20px",
                }}
                label={item.title}
                {...a11yProps(0)}
              />
            ))}
          </Tabs>

          <Box sx={{ background: Background.white, m: 2, minHeight: "60vh" }}>
            {TabAboutFrontDesk.map((_, index) => (
              <CustomTabPanel value={value} key={index} index={index}>
                {components(index)}
              </CustomTabPanel>
            ))}
          </Box>
        </Card>
      </Container>
    </MainLayout>
  );
};

export default FrontDeskPage;
