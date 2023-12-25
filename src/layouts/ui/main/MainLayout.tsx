import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardTypeMap,
  Container,
  ContainerTypeMap,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  GridTypeMap,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Stack,
  Typography,
  TypographyTypeMap,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import _ from "lodash";
import { ComponentProps, MouseEvent, ReactNode, useCallback, useState } from "react";
import { HeadSeo, Iconify } from "~/components";
import TableCommon, { TableCommonProps } from "~/components/ui/TableCommon/TableCommon";
import { SXProps } from "~/types";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return <>{children}</>;
};

type TitleProps = {
  title: string;
  mb?: number;
};

MainLayout.Title = ({ title, mb = 5 }: TitleProps) => (
  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={mb}>
    <Typography fontSize={18}>{title}</Typography>
  </Stack>
);

type HeadProps = Pick<TitleProps, "title">;

MainLayout.Head = ({ title }: HeadProps) => <HeadSeo title={title} />;

type ContainerProps = ComponentProps<OverridableComponent<ContainerTypeMap<{}, "div">>>;

MainLayout.Container = (props: ContainerProps) => <Container {...props} />;

type LinearProgressProps = {
  loading: boolean;
  sx?: SXProps;
  isOnTable?: boolean;
};

MainLayout.LinearProgress = ({ loading, sx, isOnTable }: LinearProgressProps) => {
  if (!loading) return null;

  return (
    <Box sx={{ width: "100%", position: "absolute", ...(isOnTable ? { top: -6 } : {}), ...sx }}>
      <LinearProgress />
    </Box>
  );
};

type RelativeProps = {
  sx?: SXProps;
  children: ReactNode;
};

MainLayout.Relative = ({ sx, children }: RelativeProps) => (
  <Box sx={{ position: "relative", ...sx }}>{children} </Box>
);

type CardProps = ComponentProps<OverridableComponent<CardTypeMap<{}, "div">>>;

MainLayout.Card = ({ sx, ...props }: CardProps) => (
  <Card sx={{ position: "relative", p: 3, ...sx }} {...props} />
);

type CardTitleProps = ComponentProps<OverridableComponent<TypographyTypeMap<{}, "span">>>;

MainLayout.CardTitle = (props: CardTitleProps) => <Typography mb={2} variant="h5" {...props} />;

type CardTitleErrorProps = {
  message: string;
};

MainLayout.CardTitleError = ({ message }: CardTitleErrorProps) => {
  if (!message) return null;
  return (
    <Typography mb={2} fontWeight={700} fontStyle={"italic"} color="red">
      {message}
    </Typography>
  );
};

type CardHeadProps = ComponentProps<OverridableComponent<CardTypeMap<{}, "div">>>;

MainLayout.CardHead = (props: CardHeadProps) => (
  <Card sx={{ position: "relative", ...props.sx }} {...props} />
);

type GridProps = ComponentProps<OverridableComponent<GridTypeMap<{}, "div">>>;

MainLayout.Grid = (props: GridProps) => <Grid {...props} />;

type TableProps = TableCommonProps;

MainLayout.Table = (props: TableProps) => <TableCommon {...props} />;

export type ModeTypes = "edit" | "delete" | "seeDetails" | "dialog" | "info";

export type MenuType = {
  divider: boolean;
  label: string;
  color: string;
  icon: string;
  mode: ModeTypes;
};

type MenuActionsProps = {
  menus: MenuType[];
  item: Record<string, any>;
  onClick?: (mode: ModeTypes, item: any) => void;
};

MainLayout.MenuActions = ({ menus, item, onClick }: MenuActionsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleOnClickMenuItem = useCallback(
    (mode: ModeTypes) => {
      handleClose();
      if (_.isEmpty(item) || !onClick) return;
      onClick(mode, item);
    },
    [item, onClick]
  );

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? "action" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar sx={{ width: 28, height: 28 }}>
          <MoreVertIcon />
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="action"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 28,
                height: 28,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {menus.map((menu, index) => {
          return (
            <MenuItem
              key={index}
              onClick={() => handleOnClickMenuItem(menu.mode)}
              sx={{
                transition: "all 0.25s ease-in-out",
                color: menu.color,
                // "&.active": { color: menu.color },
                // "&:hover": { color: "red" },
              }}
            >
              <Iconify icon={menu.icon} sx={{ minWidth: "28px", minHeight: "28px", mr: 1 }} />
              {menu.label}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

type DialogProps = {
  open: boolean;
  title: string;
  contentText: string;
  onClose?: () => void;
  onAgree?: (...args: any[]) => void;
};

MainLayout.Dialog = ({ open, title, contentText, onClose, onAgree }: DialogProps) => {
  const handleOnClickAgree = useCallback(() => {
    if (!onAgree) return;
    onAgree();
  }, [onAgree]);

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontStyle: "italic" }}>{contentText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" sx={{ fontWeight: 400 }} onClick={onClose}>
          Huỷ
        </Button>
        <Button variant="contained" color="error" onClick={handleOnClickAgree} autoFocus>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainLayout;
