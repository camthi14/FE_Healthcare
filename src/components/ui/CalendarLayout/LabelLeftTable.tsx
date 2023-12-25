import { Box, Typography } from "@mui/material";
import { FC } from "react";

type LabelLeftTableProps = {
  label: string;
  color?: string;
};

const LabelLeftTable: FC<LabelLeftTableProps> = ({ label, color }) => {
  return (
    <Box
      sx={{
        color: (theme) => color || theme.palette.primary.main,
        boxShadow: `6px 0px 5px -2px rgba(0,0,0,0.1)`,
        width: "100%",
        height: "100%",
        paddingY: 2,
        paddingX: 2,
      }}
    >
      <Typography fontSize={14} fontWeight={700}>
        {label}
      </Typography>
    </Box>
  );
};

export default LabelLeftTable;
