import { Box, CardContent, Grid, Tab, Tabs } from "@mui/material";
import { FC, ReactNode, SyntheticEvent, lazy, useCallback, useLayoutEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Loadable, UploadAvatar } from "~/components";
import { Background, Colors } from "~/constants";
import { useAccount } from "~/features/auth";
import { MainLayout } from "~/layouts";
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

const TabAboutProfile = [
  { title: "Thông tin Người dùng", mode: "" },
  { title: "Thay đổi mật khẩu", mode: "chang-password" },
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
    0: Loadable(lazy(() => import("./form/FormProfile")))(),
    1: Loadable(lazy(() => import("./form/FormProfileChangePassword")))(),
  }[index]);

const ProfilePage: FC = (props: Props) => {
  const dataLoader = useLoaderData() as number;
  const [value, setValue] = useState(0);
  const navigation = useNavigate();
  const user = useAccount();

  useLayoutEffect(() => {
    setValue(dataLoader);
  }, [dataLoader]);

  const handleChange = useCallback((_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const tab = TabAboutProfile[newValue];
    navigation(DashboardPaths.FrontDesk + tab.mode && tab.mode !== "" ? `?tab=${tab.mode}` : "");
  }, []);

  return (
    <MainLayout>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item lg={3} md={3}>
            <Card
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: 0,
              }}
            >
              <CardContent
                sx={{
                  height: "inherit",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                {/* <UploadAvatar defaultImage={defaultImage} onChange={handleChangeAvatar} /> */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={9} md={9}>
            <Card sx={{ p: 0, borderRadius: 0 }}>
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
                {TabAboutProfile.map((item, index) => (
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
                {TabAboutProfile.map((_, index1) => (
                  <CustomTabPanel value={value} index={index1}>
                    {components(index1)}
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

export default ProfilePage;
