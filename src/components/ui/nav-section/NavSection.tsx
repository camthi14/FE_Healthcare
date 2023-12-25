import { ExpandLess, ExpandMore } from "@mui/icons-material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Collapse,
  List,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
} from "@mui/material";
import { FC, memo, useState } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import { useNav } from "~/contexts/NavContext";
import { BoxTypeProps, INavConfig } from "~/types";
import { StyledNavItem, StyledNavItemIcon } from "./styles";

const WIDTH = 200;

type NavSectionProps = {
  data: Array<INavConfig>;
} & BoxTypeProps;

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    minWidth: 160,
    fontSize: 15,
    fontStyle: "italic",
    fontWeight: 300,
  },
});

const NavSection: FC<NavSectionProps> = ({ data = [], ...other }) => {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
};

interface NavItemProps {
  item: INavConfig;
}

const NavItem: FC<NavItemProps> = memo(
  ({ item }) => {
    const { open: openNav } = useNav();
    const [open, setOpen] = useState(false);
    const { title, path, icon, info, children } = item;
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: any, path: string) => {
      if (path) return;
      if (openNav) {
        setOpen(!open);
        return;
      }
      if (anchorEl !== event.currentTarget) {
        setAnchorEl(event.currentTarget);
      }
    };

    function handleClose() {
      setAnchorEl(null);
    }

    return (
      <>
        <StyledNavItem
          onClick={(event) => handleClick(event, path!)}
          component={path ? RouterLink : "nav"}
          to={path!}
          aria-owns={anchorEl ? "simple-menu" : undefined}
          aria-haspopup="true"
          sx={{
            "&.active": {
              color: "text.primary",
              bgcolor: "action.selected",
              fontWeight: "fontWeightBold",
            },
          }}
          {...(path ? { end: true } : {})}
        >
          <CustomWidthTooltip title={title} sx={{ maxWidth: 100 }} placement="right-start" arrow>
            <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
          </CustomWidthTooltip>

          {openNav ? <ListItemText disableTypography primary={title} /> : null}

          {info && info}

          {openNav ? (
            !path ? (
              open ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )
            ) : null
          ) : children?.length ? (
            <Box mr={2}>
              <KeyboardArrowRightIcon />
            </Box>
          ) : null}
        </StyledNavItem>

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          MenuListProps={{ onMouseLeave: handleClose, sx: { minWidth: WIDTH } }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {children && children.length
            ? children.map((item, index) => (
                <MenuItem
                  key={index}
                  component={RouterLink}
                  to={item.path!}
                  onClick={handleClose}
                  sx={{
                    "&.active": {
                      color: "text.primary",
                      bgcolor: "action.selected",
                      fontWeight: "fontWeightBold",
                    },
                  }}
                  end
                >
                  {item.title}
                </MenuItem>
              ))
            : null}
        </Menu>

        {!openNav
          ? null
          : children && children.length
          ? children.map((item, index) => (
              <Collapse in={open} key={index} timeout="auto" unmountOnExit>
                <StyledNavItem
                  component={RouterLink}
                  to={item.path!}
                  sx={{
                    "&.active": {
                      color: "text.primary",
                      bgcolor: "action.selected",
                      fontWeight: "fontWeightBold",
                    },
                  }}
                  // @ts-ignore
                  end
                >
                  <Box
                    sx={{ borderLeft: "2px dashed rgba(224, 224, 224, 1)", height: "100%", ml: 3 }}
                  />

                  <StyledNavItemIcon>{item.icon && item.icon}</StyledNavItemIcon>

                  <ListItemText disableTypography primary={item.title} />
                </StyledNavItem>
              </Collapse>
            ))
          : null}
      </>
    );
  },
  (prevProps, nextProps) => prevProps.item.title !== nextProps.item.title
);

export default NavSection;
