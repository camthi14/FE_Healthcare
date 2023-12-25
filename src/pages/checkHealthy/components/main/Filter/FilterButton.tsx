import { Button } from "@mui/material";
import { FC } from "react";
import { Background, Colors } from "~/constants";
import { ExaminationCardStatus } from "~/models";

type FilterButtonProps = {
  value: ExaminationCardStatus;
  label: string;
  active?: boolean;
  onClick?: (value: ExaminationCardStatus) => void;
};

const FilterButton: FC<FilterButtonProps> = ({ label, onClick, active, value }) => {
  return (
    <Button
      variant="outlined"
      size="small"
      onClick={() => onClick?.(value)}
      sx={{
        fontSize: 12,
        p: "4px 4px",
        mr: "4px",
        color: active ? Colors.white : Colors.blue,
        background: active ? Background.blue : Background.white,
        "&:hover": { color: Colors.white, background: Background.blue },
      }}
    >
      {label}
    </Button>
  );
};

export default FilterButton;
