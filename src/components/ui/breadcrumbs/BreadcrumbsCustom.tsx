import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Iconify } from "~/components";
import { SXProps } from "~/types";

type BreadcrumbType = { label: string; to?: string };

type BreadcrumbsCustomProps = {
  data: BreadcrumbType[];
  sx?: SXProps;
};

const BreadcrumbsCustom = ({ data, sx }: BreadcrumbsCustomProps) => {
  const dataLength = useMemo(() => data.length, [data]);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={sx}>
      <Link underline="hover" component={NavLink} color={"inherit"} to="/">
        <Iconify icon="ion:home" />
      </Link>

      {dataLength === 1 ? <Typography color={"text.primary"}>{data[0].label}</Typography> : null}

      {dataLength > 1
        ? data.map((item, index) => {
            if (index === dataLength - 1) {
              return (
                <Typography color={"text.primary"} key={index}>
                  {item.label}
                </Typography>
              );
            }

            return (
              <Link
                underline="hover"
                key={index}
                component={NavLink}
                color={"inherit"}
                to={item.to!}
              >
                {item.label}
              </Link>
            );
          })
        : null}
    </Breadcrumbs>
  );
};

export default BreadcrumbsCustom;
