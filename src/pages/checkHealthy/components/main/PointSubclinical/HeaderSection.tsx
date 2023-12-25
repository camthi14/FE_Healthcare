import { Stack, Typography } from "@mui/material";
import { FC } from "react";

type HeaderSectionProps = {
  title: string;
};

const HeaderSection: FC<HeaderSectionProps> = ({ title }) => {
  return (
    <Stack
      sx={{
        background: (theme) => theme.palette.primary.main,
        color: "white",
        py: 1,
        px: 2,
        mb: 2,
        borderRadius: "10px 10px 0 0",
      }}
    >
      <Typography>{title}</Typography>
    </Stack>
  );
};

export default HeaderSection;
