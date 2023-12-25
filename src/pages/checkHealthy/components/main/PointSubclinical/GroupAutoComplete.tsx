import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { Checkbox, FormControl, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FC, memo, useCallback, useMemo } from "react";
import { ISubclinicalType, ResultsOptionsGroup } from "~/models";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type GroupAutoCompleteProps = {
  value: ResultsOptionsGroup[];
  options: ISubclinicalType[];
  onChange?: (value: ResultsOptionsGroup[]) => void;
};

const GroupAutoComplete: FC<GroupAutoCompleteProps> = ({ onChange, value, options }) => {
  const dataOptions = useMemo((): ResultsOptionsGroup[] => {
    if (!options.length) return [];

    let results: ResultsOptionsGroup[] = [];

    const length = options.length;

    for (let i = 0; i < length; i++) {
      const type = options[i];
      const group = type.name;
      const lengthSub = type.subclinical!.length;

      for (let j = 0; j < lengthSub; j++) {
        const subclinical = type.subclinical![j];
        results.push({ ...subclinical, group });
      }
    }

    return results;
  }, [options]);

  const handleChange = useCallback(
    (_: any, value: ResultsOptionsGroup[]) => {
      if (!onChange) return;
      onChange?.(value);
    },
    [onChange]
  );

  return (
    <FormControl>
      <Autocomplete
        multiple
        disableCloseOnSelect
        size="small"
        options={dataOptions}
        groupBy={(option) => option.group}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        sx={{ width: 400 }}
        value={value}
        renderTags={(options) => (
          <Typography>
            {`${options[options.length - 1].name}  ${
              options.length - 1 !== 0 ? `(+${options.length - 1})` : ""
            }`}
          </Typography>
        )}
        onChange={handleChange}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        )}
        renderInput={(params) => <TextField {...params} fullWidth label="Tên dịch vụ" />}
      />
    </FormControl>
  );
};

export default memo(GroupAutoComplete);
