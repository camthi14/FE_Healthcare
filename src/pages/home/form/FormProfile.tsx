import { Grid, TextField } from "@mui/material";
import { FC } from "react";
import { SelectInput } from "~/components";
import { useAccount } from "~/features/auth";

type Props = {};

const dataRadio = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
];

const FormProfile: FC = () => {
  const user = useAccount();

  return (
    <Grid container spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
      <Grid item lg={6}>
        <TextField
          fullWidth
          label="Họ và chữ lót"
          placeholder="VD: Nguyễn Văn"
          value={user?.infoData.last_name}
        />
      </Grid>

      <Grid item lg={6}>
        <TextField fullWidth label="Tên " placeholder="VD: A" value={user?.infoData.first_name} />
      </Grid>

      <Grid item lg={6}>
        <TextField
          fullWidth
          label="Số điện thoại"
          placeholder="VD: 0123456789"
          value={user?.phone_number}
        />
      </Grid>
      <Grid item lg={6}>
        <TextField
          fullWidth
          autoComplete="none"
          aria-autocomplete="none"
          label="Email"
          placeholder="VD: nhanvienA@gmail.com"
          value={user?.email}
        />
      </Grid>

      <Grid item lg={6}>
        <TextField fullWidth label="Tài khoản" placeholder="VD: nhanvienA" value={user?.username} />
      </Grid>

      <Grid item lg={6}>
        <SelectInput
          margin="none"
          options={dataRadio}
          label="Giới tính"
          placeholder="Chọn giới tính"
          value={user?.infoData.gender}
        />
      </Grid>
      <Grid item lg={12}>
        <TextField
          fullWidth
          label="Địa chỉ"
          placeholder="VD:vĩnh long"
          value={user?.infoData.address}
        />
      </Grid>
    </Grid>
  );
};

export default FormProfile;
