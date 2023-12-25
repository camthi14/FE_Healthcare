import { Box, Link } from "@mui/material";
import { forwardRef, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import Image from "~/assets/image/logo1.jpg";
import { useNav } from "~/contexts/NavContext";
import { DashboardPaths } from "~/types";

const Logo = forwardRef(({ disabledLink = false, sx, ...other }: any, ref) => {
  const { open } = useNav();

  const logo = useMemo(() => {
    const SAPCING = open ? 100 : 80;
    return (
      <Box
        ref={ref}
        component="img"
        src={Image}
        sx={{
          width: SAPCING,
          height: SAPCING,
          display: "inline-flex",
          transition: "all 0.25s ease 0s",
          ...sx,
        }}
        {...other}
      ></Box>
    );
  }, [open]);

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <>
      <Link to={DashboardPaths.DashboardApp} component={RouterLink} sx={{ display: "contents" }}>
        {logo}
      </Link>
    </>
  );
});

export default Logo;
