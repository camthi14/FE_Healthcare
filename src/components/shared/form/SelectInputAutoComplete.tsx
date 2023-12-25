import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { AutocompleteValue, FormControl } from "@mui/material";
import Autocomplete, {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
} from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { FC, ReactNode, SyntheticEvent, useCallback } from "react";

type SelectInputAutoCompleteProps = {
  error?: boolean;
  helperText?: ReactNode;
  onChange?: (...args: any[]) => void;
  options: Record<string, any>[];
  keyOption: keyof Record<string, any>;
  value: Record<string, any>[] | Record<string, any> | null | string;
  label: string;
  placeholder?: string;
  multiple?: boolean;
  endAdornment?: ReactNode;
  disableCloseOnSelect?: boolean;
  size?: "small" | "medium";
  margin?: "normal" | "none" | "dense";
};

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const SelectInputAutoComplete: FC<SelectInputAutoCompleteProps> = ({
  error,
  helperText,
  onChange,
  options,
  keyOption,
  value,
  label,
  placeholder,
  multiple,
  endAdornment,
  size = "medium",
  margin = "normal",
  disableCloseOnSelect = true,
}) => {
  const handleChange = useCallback(
    (
      _: SyntheticEvent,
      value: AutocompleteValue<any, boolean, boolean, boolean>,
      reason: AutocompleteChangeReason,
      details?: AutocompleteChangeDetails<any>
    ) => {
      if (!onChange) return;
      onChange(value, reason, details?.option);
    },
    []
  );

  return (
    <FormControl fullWidth error={error} margin={margin}>
      <Autocomplete
        multiple={multiple}
        id="checkboxes-tags-demo"
        options={options}
        fullWidth
        value={value}
        isOptionEqualToValue={(option, value) => option[keyOption] === value[keyOption]}
        disableCloseOnSelect={disableCloseOnSelect}
        size={size}
        onChange={handleChange}
        getOptionLabel={(option) => option[keyOption]}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option[keyOption]}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            helperText={helperText}
            error={error}
            fullWidth
            label={label}
            size={size}
            placeholder={placeholder}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {endAdornment} {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default SelectInputAutoComplete;
