import { styled } from "@mui/material/styles";
import { useMemo } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { ScrollToTop, Scrollbar } from "~/components";
import { AuthRoles, INavConfig } from "~/types";
import Header from "../ui/header";
import Nav from "../ui/nav";
import initNavConfig from "../ui/nav/config";
import { useBeforeUnload } from "./helpers/useBeforeUnload";
import useCountOpenTab from "./helpers/useCountOpenTab";

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
});

const Main = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    // paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default function DashboardLayout() {
  const data = useLoaderData() as AuthRoles;
  useCountOpenTab();
  useBeforeUnload();

  const navConfig = useMemo((): INavConfig[] => {
    return initNavConfig(data);
  }, [data]);

  return (
    <Scrollbar
      sx={{
        height: 1,
        // "& .simplebar-content": { height: 1, display: "flex", flexDirection: "column" },
      }}
    >
      <StyledRoot>
        <ScrollToTop />

        <Header />

        <Nav navConfig={navConfig} />

        <Main>
          <Outlet />
        </Main>
      </StyledRoot>
    </Scrollbar>
  );
}
