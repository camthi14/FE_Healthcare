// @mui
import { Box, Checkbox } from "@mui/material";
//
import { SXProps } from "~/types";
import Icon from "./Icon";

// ----------------------------------------------------------------------

type ColorMultiPickerProps = {
  sx: SXProps;
  colors: Array<string>;
  onChangeColor: (color: string) => void;
  selected: Array<string>;
};

export default function ColorMultiPicker({
  colors,
  selected,
  onChangeColor,
  sx,
  ...other
}: ColorMultiPickerProps) {
  return (
    <Box sx={sx}>
      {colors.map((color) => {
        const whiteColor = color === "#FFFFFF" || color === "white";

        return (
          <Checkbox
            key={color}
            size="small"
            value={color}
            color="default"
            checked={selected.includes(color)}
            onChange={() => onChangeColor(color)}
            icon={<Icon whiteColor={whiteColor} />}
            checkedIcon={<Icon checked whiteColor={whiteColor} />}
            sx={{
              color,
              "&:hover": { opacity: 0.72 },
              "& svg": { width: 12, height: 12 },
            }}
            {...other}
          />
        );
      })}
    </Box>
  );
}
