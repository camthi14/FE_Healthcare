import AcUnitIcon from "@mui/icons-material/AcUnit";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Button, Stack, Typography } from "@mui/material";
import { FC, ReactElement } from "react";
import { fNumber } from "~/utils/formatNumber";

type OptionsType = "required" | "create" | "finished";

type SubTotalProps = {
  total?: number;
  options: OptionsType;
  onClick?: () => void;
};

const SubTotal: FC<SubTotalProps> = ({ total, options, onClick }) => {
  const icon: Record<OptionsType, ReactElement> = {
    required: <LocalPrintshopIcon />,
    create: <AcUnitIcon />,
    finished: <LocalPrintshopIcon />,
  };

  const textButton: Record<OptionsType, string> = {
    required: "In phiếu yêu cầu",
    create: "Yêu cầu",
    finished: "In phiếu hoàn thành",
  };

  return (
    <Stack
      mt={1}
      textAlign={"end"}
      justifyContent={"flex-end"}
      alignItems={"flex-end"}
      marginTop={3}
      gap={2}
    >
      {total ? (
        <>
          <Stack width={300} flexDirection={"row"} justifyContent={"space-between"}>
            <Typography fontWeight={700}>Thành tiền</Typography>
            <Typography fontWeight={700}>{fNumber(total)}</Typography>
          </Stack>
          <Stack width={300} flexDirection={"row"} justifyContent={"space-between"}>
            <Typography fontWeight={700}>Bệnh nhân trả</Typography>
            <Typography
              color={(theme) => theme.palette.error.main}
              fontSize={18}
              fontWeight={"bold"}
            >
              {fNumber(total)}
            </Typography>
          </Stack>
        </>
      ) : null}

      <Stack>
        <Button onClick={onClick} startIcon={icon[options]} variant="contained" sx={{ px: 6 }}>
          {textButton[options]}
        </Button>
      </Stack>
    </Stack>
  );
};

export default SubTotal;
