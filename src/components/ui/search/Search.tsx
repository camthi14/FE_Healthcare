import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, InputBase } from "@mui/material";
import { ChangeEvent, useCallback } from "react";
import { FlexCenter } from "~/constants";
import { SXProps } from "~/types";

type SearchProps = {
  placeholder: string;
  width: string | number;
  value?: string;
  onChangeValue?: (value: string) => void;
  xs?: SXProps;
};

const Search = ({ placeholder, width, value, onChangeValue, ...xs }: SearchProps) => {
  const handleChangeInput = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      if (!onChangeValue) return;
      onChangeValue(value);
    },
    [onChangeValue]
  );

  return (
    <Box
      sx={{
        border: "1px solid #eee",
        width: { width },
        margin: "0 auto",
        borderRadius: 1,
        px: 1,
        ...FlexCenter,
        ...xs,
      }}
    >
      <InputBase
        value={value}
        onChange={handleChangeInput}
        fullWidth
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        inputProps={{ "aria-label": "Tìm kiếm chuyên khoa" }}
      />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default Search;
