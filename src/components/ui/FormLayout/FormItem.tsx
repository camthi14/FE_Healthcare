import { Grid, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

type FormItemProps = {
  columnLeft: {
    title: string;
    subTitle: string;
  };
  columnRight: ReactNode;
};

const FormItem: FC<FormItemProps> = ({ columnLeft: { subTitle, title }, columnRight }) => {
  return (
    <Grid item md={12} xs={12}>
      <Grid container spacing={2} justifyContent="flex-end" direction="row">
        <Grid item md={8} xs={12}></Grid>

        <Grid item md={4} xs={12}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color={"text.secondary"}>
            {subTitle}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FormItem;
