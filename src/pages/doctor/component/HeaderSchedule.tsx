import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import { Dayjs } from "dayjs";
import { FC } from "react";
import { DatePicker, SelectInputAutoComplete } from "~/components";
import { OptionsSearchDoctor } from "~/features/specialty";
import { ISpecialty } from "~/models";

type HeaderScheduleProps = {
  date: Dayjs;
  valueOption: ISpecialty | null;
  search: string;
  onChangeSearch?: (value: string) => void;
  options: ISpecialty[];
  optionsSearchDoctor: OptionsSearchDoctor;
  onPrevDate?: () => void;
  onNextDate?: () => void;
  onChangeDate?: (date: Dayjs | null) => void;
  onChangeOptions?: (value: ISpecialty | null) => void;
  onChangeOptionSearchDoctor?: (value: OptionsSearchDoctor) => void;
};

const HeaderSchedule: FC<HeaderScheduleProps> = ({
  date,
  options,
  valueOption,
  optionsSearchDoctor,
  search,
  onChangeSearch,
  onNextDate,
  onPrevDate,
  onChangeDate,
  onChangeOptions,
  onChangeOptionSearchDoctor,
}) => {
  const optionsSearch: { value: OptionsSearchDoctor; label: string }[] = [
    { label: "ID", value: "id" },
    { label: "Tên", value: "name" },
  ];

  return (
    <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} gap={1}>
      <Stack flexDirection={"row"} gap={1}>
        <Box minWidth={300}>
          <SelectInputAutoComplete
            margin="none"
            keyOption="name"
            label="Chuyên khoa"
            multiple={false}
            options={options}
            value={valueOption}
            size="small"
            disableCloseOnSelect={false}
            onChange={onChangeOptions}
          />
        </Box>
      </Stack>

      <Stack flexDirection={"row"} gap={1}>
        <Stack minWidth={300}>
          <TextField
            value={search}
            onChange={({ target: { value } }) => onChangeSearch?.(value)}
            size="small"
            label="Tìm kiếm bác sĩ"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Stack flexDirection={"row"}>
                    {optionsSearch.map(({ value, label }) => (
                      <Box
                        onClick={() => onChangeOptionSearchDoctor?.(value)}
                        width={30}
                        fontSize={14}
                        sx={{
                          cursor: "pointer",
                          transition: "all .25s ease-in-out",
                          color: (theme) =>
                            optionsSearchDoctor === value
                              ? theme.palette.primary.main
                              : theme.palette.grey[400],
                          fontWeight: optionsSearchDoctor === value ? 700 : 500,
                        }}
                      >
                        {label}
                      </Box>
                    ))}
                  </Stack>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack flexDirection={"row"} gap={1}>
          <Box>
            <DatePicker onChangeDate={onChangeDate} label="Ngày" value={date} hideMinDate />
          </Box>
          <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
            <Box>
              <IconButton size="small" color="primary" onClick={onPrevDate}>
                <ArrowBackIosNewIcon fontSize="inherit" />
              </IconButton>
            </Box>
            <Box>
              <IconButton size="small" color="primary" onClick={onNextDate}>
                <ArrowForwardIosIcon fontSize="inherit" />
              </IconButton>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default HeaderSchedule;
