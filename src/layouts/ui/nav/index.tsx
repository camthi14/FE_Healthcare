import { Avatar, Box, Drawer, Link, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { FC, useMemo } from "react";
import account from "~/_mock/account";
import { Logo, NavSection, Scrollbar } from "~/components";
import { useNav } from "~/contexts/NavContext";
import { useAccount, useAuth } from "~/features/auth";
import useResponsive from "~/hooks/useResponsive";
import { INavConfig } from "~/types";
import avt from "~/assets/image/avt.jpg";
import { Background, Colors } from "~/constants";

const NAV_WIDTH = 280;
export const SPACING_HIDDEN = 100;

const StyledAccount = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

type NavProps = {
  navConfig: INavConfig[];
};

const Nav: FC<NavProps> = ({ navConfig }) => {
  const user = useAccount();
  const { role } = useAuth();

  const { onClose: onCloseNav, open: openNav } = useNav();

  const showRole = useMemo((): string => {
    if (!role) return "";

    return {
      doctor: "Bác sĩ",
      employee: "Nhân viên",
      owner: "Chủ phòng khám",
    }[role];
  }, [role]);

  const isDesktop = useResponsive("up", "lg");

  const renderContent = useMemo(
    () => (
      <Scrollbar
        sx={{
          height: 1,
          "& .simplebar-content": { height: 1, display: "flex", flexDirection: "column" },
        }}
      >
        <Box sx={{ display: "inline-flex", mx: "auto" }}>
          <Logo />
        </Box>

        <Box
          sx={{
            mb: 2,
            mx: openNav ? 2.5 : 4,
            background: openNav ? Background.blueLight : "",
            borderRadius: 1,
          }}
        >
          <Link underline="none">
            {openNav ? (
              <StyledAccount>
                <Avatar src={avt} alt="photoURL" />

                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                    {user?.display_name}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {showRole}
                  </Typography>
                </Box>
              </StyledAccount>
            ) : (
              <Avatar src={avt} alt="photoURL" />
            )}
          </Link>
        </Box>

        <NavSection
          sx={{
            mb: 2,
            mx: 2.5,
            background: Background.blueLight,
            borderRadius: 1,
            "& a, nav": { color: Colors.black },
            "& .MuiBox-root.css-1ay9vb9": {
              display: "none",
            },
            "& .css-121b4uz-MuiListItemIcon-root": { minWidth: "43px", textAlign: "center" },
          }}
          data={navConfig}
        />

        <Box sx={{ flexGrow: 1 }} />
      </Scrollbar>
    ),
    [account, openNav, user, showRole]
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: openNav ? NAV_WIDTH : SPACING_HIDDEN },
        transition: "all .25s  ease-in-out 0s",
      }}
    >
      {isDesktop ? (
        <Drawer
          open={openNav}
          variant="permanent"
          sx={{ transition: "all .25s  ease-in-out 0s" }}
          PaperProps={{
            sx: {
              width: openNav ? NAV_WIDTH : SPACING_HIDDEN,
              bgcolor: "background.default",
              borderRightStyle: "dashed",
              background: Background.blue,
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
};

export default Nav;
