import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { Checkbox, FormControl, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FC, memo, useCallback, useMemo } from "react";
import { IMedicineType } from "~/models";
import { MedicineOptionsInPrescription } from "~/models/prescriptions.model";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type GroupAutoCompleteMedicineProps = {
  value: MedicineOptionsInPrescription[];
  options: IMedicineType[];
  onChange?: (
    value: MedicineOptionsInPrescription[],
    details?: MedicineOptionsInPrescription
  ) => void;
};

const GroupAutoCompleteMedicine: FC<GroupAutoCompleteMedicineProps> = ({
  onChange,
  value,
  options,
}) => {
  const dataOptions = useMemo((): MedicineOptionsInPrescription[] => {
    if (!options.length) return [];

    let results: MedicineOptionsInPrescription[] = [];

    const length = options.length;

    for (let i = 0; i < length; i++) {
      const type = options[i];
      const lengthSub = type.medicines?.length || 0;

      for (let j = 0; j < lengthSub; j++) {
        const subclinical = type.medicines![j];
        results.push({
          ...subclinical,
          amount_of_medication_per_session: 1,
          amount_use_in_day: "1",
          note: "",
          quantity_ordered: 0,
          session: "sáng",
        });
      }
    }

    return results;
  }, [options]);

  const handleChange = useCallback(
    (_: any, value: MedicineOptionsInPrescription[], __: any, details: any) => {
      if (!onChange) return;
      onChange?.(value, details?.option);
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
        groupBy={(option) => option.typeName!}
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
        renderInput={(params) => <TextField {...params} fullWidth label="Tên thuốc" />}
      />
    </FormControl>
  );
};

export default memo(GroupAutoCompleteMedicine);
