import { Paper, Skeleton, Stack } from "@mui/material";
import { FC } from "react";

const SkeletonPatient: FC = () => {
  return (
    <Stack component={Paper} spacing={1} minWidth={284} p={2} elevation={3}>
      <Stack alignItems={"center"}>
        <Skeleton variant="circular" width={100} height={100} />
      </Stack>

      <Stack gap={0.8} mt={2}>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
      </Stack>
    </Stack>
  );
};

export default SkeletonPatient;
