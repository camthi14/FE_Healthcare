import PropTypes from "prop-types";
// @mui
import { Grid, GridTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { ComponentProps } from "react";
import ShopProductCard from "./ProductCard";

// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
};

type ProductList = {
  products: Array<any>;
} & ComponentProps<OverridableComponent<GridTypeMap<{}, "div">>>;

export default function ProductList({ products, ...other }: ProductList) {
  return (
    <Grid container spacing={3} {...other}>
      {products.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={3}>
          <ShopProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
