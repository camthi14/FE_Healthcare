import { AppBar, Stack, Toolbar, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

type AppbarDialogProps = {
  children: ReactNode;
  title?: string;
};

export const AppbarDialog: FC<AppbarDialogProps> = ({ children, title }) => {
  return (
    <AppBar sx={{ position: "relative" }} color="inherit">
      <Toolbar>
        {title ? (
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
        ) : null}
        <Stack flexDirection={"row"} gap={1}>
          {children}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
