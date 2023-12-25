import { IconButton, InputAdornment, TextField, TextFieldProps } from "@mui/material";
import { FC, useCallback, useState } from "react";
import { Iconify } from "~/components";

type InputSecureProps = TextFieldProps;

const InputSecure: FC<InputSecureProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = useCallback(() => setShowPassword((prev) => !prev), []);

  return (
    <TextField
      fullWidth
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleTogglePassword} edge="end">
              <Iconify icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default InputSecure;
