import { Grid } from "@mui/material";
import { FC } from "react";
import { InputSecure } from "~/components";

type Props = {};

const FormProfileChangePassword: FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid item lg={12}>
        <InputSecure
          fullWidth
          label="Mật khẩu cũ"
          placeholder="Nhập mật khẩu"
          // {...getFieldProps("password")}
          // error={touched.password && Boolean(errors.password)}
          // helperText={touched.password && errors.password}
        />
      </Grid>
      <Grid item lg={12}>
        <InputSecure
          fullWidth
          label="Mật khẩu mới"
          placeholder="Nhập mật khẩu"
          // {...getFieldProps("password")}
          // error={touched.password && Boolean(errors.password)}
          // helperText={touched.password && errors.password}
        />
      </Grid>
    </Grid>
  );
};

export default FormProfileChangePassword;
