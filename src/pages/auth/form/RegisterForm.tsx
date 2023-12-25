import { LoadingButton } from "@mui/lab";
import { Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Iconify } from "~/components";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <>
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid item lg={6} md={6} xs={12}>
          <TextField id="last" label="Họ" variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <TextField id="first" label="Tên" variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <TextField id="email" label="E-mail" variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <TextField id="phone" label="Số điện thoại" variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid item lg={12} md={12} xs={12}>
          <TextField id="address" label="Địa chỉ" variant="outlined" sx={{ width: "100%" }} />
        </Grid>
        <Grid item lg={12} md={12} xs={12}>
          <TextField
            name="password"
            label="Mật khẩu"
            variant="outlined"
            sx={{ width: "100%" }}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item lg={12} md={12} xs={12}>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            onClick={handleClick}
            sx={{ mt: 3 }}
          >
            Đăng ký
          </LoadingButton>
        </Grid>
      </Grid>
    </>
  );
}
