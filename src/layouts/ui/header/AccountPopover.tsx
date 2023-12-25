import { useMemo, useState } from "react";
// @mui
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
// mocks_
import { NavLink } from "react-router-dom";
import { authActions, useAccount, useAuth } from "~/features/auth";
import { useAppDispatch } from "~/stores";
import { DashboardPaths } from "~/types";
import account from "../../../_mock/account";
import avt from "~/assets/image/avt.jpg";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: "Trang chủ",
    icon: "eva:home-fill",
    to: DashboardPaths.DashboardApp,
  },
  {
    label: "Thông tin cá nhân",
    icon: "eva:person-fill",
    to: DashboardPaths.Profile,
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const user = useAccount();
  const { role } = useAuth();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState<any>(null);

  const handleOpen = (event: any) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const handleLogout = () => {
    if (!role) return;
    dispatch(authActions.logoutStart(role));
    handleClose();
  };

  const showRole = useMemo((): string => {
    if (!role) return "";

    return {
      doctor: "Bác sĩ",
      employee: "Nhân viên",
      owner: "Chủ phòng khám",
    }[role];
  }, [role]);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={avt} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            "& .MuiMenuItem-root": {
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.display_name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user?.email}
          </Typography>
          <Typography variant="body2" fontWeight={700} sx={{ color: "text.secondary" }} noWrap>
            {showRole}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem component={NavLink} to={option.to} key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Đăng xuất
        </MenuItem>
      </Popover>
    </>
  );
}
