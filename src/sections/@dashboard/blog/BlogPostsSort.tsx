import PropTypes from "prop-types";
// @mui
import { MenuItem, TextField } from "@mui/material";

// ----------------------------------------------------------------------

BlogPostsSort.propTypes = {
  options: PropTypes.array,
  onSort: PropTypes.func,
};

interface BlogPostsSortProps {
  options: Array<any>;
  onSort: any;
}

export default function BlogPostsSort({ options, onSort }: BlogPostsSortProps) {
  return (
    <TextField select size="small" value="latest" onChange={onSort}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
