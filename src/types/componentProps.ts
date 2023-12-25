import { CardTypeMap, GridTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { Theme as MaterialTheme, SxProps } from "@mui/material/styles";
import { BoxTypeMap } from "@mui/system";
import { ComponentProps } from "react";
import { Theme } from "@mui/system/createTheme";
import { ExtendButtonBase } from "@mui/material/ButtonBase";
import { ListItemButtonTypeMap } from "@mui/material/ListItemButton";

export type CardType = ComponentProps<OverridableComponent<CardTypeMap<{}, "div">>>;
export type BoxTypeProps = ComponentProps<
  OverridableComponent<BoxTypeMap<{}, "div", MaterialTheme>>
>;
export type GridTypeProps = ComponentProps<OverridableComponent<GridTypeMap<{}, "div">>>;
export type SXProps = SxProps<Theme>;

export type Variants = "filled" | "outlined" | "ghost" | "soft";
export type Colors = "default" | "primary" | "secondary" | "info" | "success" | "warning" | "error";
export type ListItemButtonProps = ComponentProps<ExtendButtonBase<ListItemButtonTypeMap>>;
