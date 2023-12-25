import { Box, Paper, Radio, Stack, Typography } from "@mui/material";
import { FC, useCallback, useState } from "react";
import { LazyLoadImage } from "~/components";
import { useBooking } from "~/features/booking";
import { IDoctorAuth } from "~/models";

type DoctorItemCardProps = {
  onChecked?: (id: string) => void;
} & IDoctorAuth;

const DoctorItemCard: FC<DoctorItemCardProps> = (props) => {
  const { photo, display_name, operation, qualificationData, id, onChecked } = props;
  const [hover, setHover] = useState(false);
  const { doctorId } = useBooking();

  const handleChecked = useCallback(() => {
    if (!id || !onChecked) return;
    onChecked(id);
  }, [id]);

  return (
    <Stack
      component={Paper}
      onMouseMove={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      elevation={hover ? 10 : 2}
      p={2}
      alignItems={"center"}
      minWidth={200}
      sx={{ cursor: "pointer" }}
      position={"relative"}
      onClick={handleChecked}
    >
      <LazyLoadImage
        src={photo!}
        sxBox={{ width: 100, height: 100, borderRadius: "100%", flexShrink: 0 }}
        sxImage={{ width: 100, height: 100, borderRadius: "100%", flexShrink: 0 }}
      />

      <Box position={"absolute"} top={0} right={0}>
        <Radio checked={Boolean(id === doctorId)} onClick={handleChecked} />
      </Box>

      <Box mt={2}>
        <Typography
          fontWeight={"bold"}
        >{`${qualificationData?.character} ${display_name}`}</Typography>

        <Typography
          fontWeight={500}
          fontSize={14}
        >{`Chức vụ: ${operation?.position?.name}`}</Typography>
      </Box>
    </Stack>
  );
};

export default DoctorItemCard;
