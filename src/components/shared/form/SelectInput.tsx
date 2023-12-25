import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import React, { ReactNode } from "react";
import { OptionState } from "~/types";

type SelectInputProps = {
  options: OptionState[];
  helperText?: ReactNode;
} & SelectProps;

const SelectInput: React.FC<SelectInputProps> = ({ options, helperText, ...props }) => {
  return (
    <FormControl fullWidth error={props.error} margin={props.margin ?? "normal"} size={props.size}>
      <InputLabel>{props.label}</InputLabel>

      <Select {...props}>
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export default SelectInput;
