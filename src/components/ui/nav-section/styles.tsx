// @mui
import { ListItemButton, ListItemButtonProps, ListItemIcon } from "@mui/material";
import { styled } from "@mui/material/styles";

// ----------------------------------------------------------------------

type Props = { component?: any; to?: string; end?: boolean } & ListItemButtonProps;

export const StyledNavItem = styled((props: Props) => <ListItemButton disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.body2,
    height: 48,
    position: "relative",
    textTransform: "capitalize",
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius,
  })
);

export const StyledNavItemIcon = styled(ListItemIcon)({
  width: 22,
  height: 22,
  color: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
