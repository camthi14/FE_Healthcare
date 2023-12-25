import { Box, Typography } from "@mui/material";
import { FC, memo } from "react";

type LabelCartItemProps = {
  labelLeft: string;
  labelRight: string;
};

const LabelCartItem: FC<LabelCartItemProps> = ({ labelLeft, labelRight }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        textTransform: "uppercase",
        pt: 1,
      }}
    >
      <Typography fontSize={13}>{labelLeft}</Typography>
      <Typography fontSize={13}>{labelRight}</Typography>
    </Box>
  );
};

export default memo(LabelCartItem);
