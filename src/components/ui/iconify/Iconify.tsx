import { forwardRef } from "react";
import { Icon } from "@iconify/react";
import { Box } from "@mui/material";
import { BoxTypeProps, SXProps } from "~/types/componentProps";

type IconifyProps = {
  sx?: SXProps;
  width?: number | string;
  icon: React.JSX.Element | string;
} & BoxTypeProps;

const Iconify = forwardRef(({ icon, width = 20, sx, ...other }: IconifyProps, ref) => (
  <Box ref={ref} component={Icon} icon={icon} sx={{ width, height: width, ...sx }} {...other} />
));

export default Iconify;
