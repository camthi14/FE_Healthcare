import { Grid } from "@mui/material";
import { FC } from "react";
import { GridTypeProps } from "~/types";

type FormLayoutProps = {} & GridTypeProps;

const FormLayout: FC<FormLayoutProps> = (props) => {
  return <Grid container {...props} />;
};

export default FormLayout;
