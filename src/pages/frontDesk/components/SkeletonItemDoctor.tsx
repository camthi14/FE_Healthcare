import { Box, Paper } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { FC } from "react";

const SkeletonItemDoctor: FC = () => {
  return (
    <Stack spacing={1} component={Paper} p={2} elevation={2} minWidth={200} alignItems={"center"}>
      <Skeleton variant="circular" width={100} height={100} />
      <Box mt={2} width={"100%"}>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
      </Box>
    </Stack>
  );
};

export default SkeletonItemDoctor;
