import { Box, Card, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { Iconify } from "~/components";
import { CardType } from "~/types/componentProps";
import { fShortenNumber } from "~/utils/formatNumber";
import { FlexCenter } from "~/constants";

const StyledIcon = styled("div")(({ theme }) => ({
  display: "flex",
  margin: "auto",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(6),
  height: theme.spacing(6),
  justifyContent: "center",
}));

type AppWidgetSummaryProps = {
  color?: string;
  icon: string;
  colorIcon: string;
  iconStyle?: string;
  title: string;
  total: number;
  sx?: object;
} & CardType;

export default function AppWidgetSummary({
  title,
  total,
  icon,
  iconStyle,
  color = "primary",
  colorIcon,
  sx,
  ...other
}: AppWidgetSummaryProps) {
  return (
    <Card
      sx={{
        py: 4,
        // textAlign: "center",
        // color: (theme: any) => theme.palette[color].darker,
        // bgcolor: (theme: any) => theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >
      {iconStyle ? (
        <StyledIcon
          sx={{
            color: (theme: any) => theme.palette[color].dark,
            backgroundImage: (theme: any) =>
              `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
                theme.palette[color].dark,
                0.24
              )} 100%)`,
          }}
        >
          <Iconify icon={icon} color={colorIcon} width={24} height={24} />
        </StyledIcon>
      ) : (
        <Box
          sx={{
            // color: (theme: any) => theme.palette[color].darker,
            // bgcolor: (theme: any) => theme.palette[color].lighter,
            // ...FlexCenter,
            p: 1,
            mr: "4px",
            borderRadius: "3px",
          }}
        >
          <Iconify icon={icon} color={colorIcon} width={30} height={30} />
        </Box>
      )}

      <Box>
        <Typography variant="subtitle2" sx={{ opacity: 0.72, fontSize: "20px" }}>
          {title}
        </Typography>
        <Typography fontSize={18}>{fShortenNumber(total)}</Typography>
      </Box>
    </Card>
  );
}
