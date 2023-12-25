import { AppBar, Box, Button, IconButton, Stack, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { HelmetData } from "react-helmet-async";
import { Iconify } from "~/components";
import { Background, Colors } from "~/constants";
import { useNav } from "~/contexts/NavContext";
import { useTitle } from "~/features/app";
import { authActions, useAuth } from "~/features/auth";
import { useAppDispatch } from "~/stores";
import { bgBlur } from "~/utils/cssStyles";
import { SPACING_HIDDEN } from "..";

const helmetData = new HelmetData({});

const { helmet } = helmetData.context;

const NAV_WIDTH = 280;

const HEIGHT = 50;
// const HEADER_MOBILE = 64;

// const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }: any) => {
  const { open } = useNav();

  return {
    ...(bgBlur({ color: theme.palette.background.default }) as any),
    boxShadow: "none",
    transition: "all 0.25s ease 0s",
    [theme.breakpoints.up("lg")]: {
      width: `calc(100% - ${!open ? SPACING_HIDDEN : NAV_WIDTH + 1}px)`,
    },
  };
});

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEIGHT,
  [theme.breakpoints.up("lg")]: {
    minHeight: HEIGHT,
    padding: theme.spacing(0, 5),
  },
}));

console.log(helmet);

interface HeaderProps {}

export default function Header({}: HeaderProps) {
  const { onToggle } = useNav();
  const title = useTitle();
  const { role } = useAuth();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    if (!role) return;
    dispatch(authActions.logoutStart(role));
    // handleClose();
  };

  return (
    <StyledRoot>
      <StyledToolbar sx={{ background: Background.blue }}>
        <Box>
          <IconButton
            onClick={onToggle}
            sx={{
              mr: 1,
              color: "text.primary",
            }}
          >
            <Iconify color={"white"} icon="eva:menu-2-fill" />
          </IconButton>

          {title}
        </Box>

        {/* <Searchbar /> */}
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          {/* <Avatar src={avt} alt="photoURL" /> */}
          <Button
            onClick={handleLogout}
            variant="outlined"
            sx={{
              color: Colors.white,
              border: "1px solid #fff",
              "&:hover": { border: "1px solid #fff" },
            }}
          >
            Đăng xuất
          </Button>
          {/* <LanguagePopover /> */}
          {/* <NotificationsPopover /> */}
          {/* <AccountPopover /> */}
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
