import { SXProps } from "~/types";

export enum Colors {
  blue = "#2065d1",
  blueLight = "rgb(212,239,252)",
  white = "#fff",
  yellow = "#f7d800",
  black = "#000",
  greenLight = "#edf7ed",
  gray = "#eee",
  red = "red",
  redLight = "#fdeded",
  green = "green",
  orange = "#f1b740",
}

export enum Background {
  blue = "#2065d1",
  blueLight = "rgb(212,239,252)",
  // blueLight = "#e8fffc",
  white = "#fff",
  yellow = "#f7d800",
  gray = "#eee",
  black = "#000",
  greenLight = "#edf7ed",
  red = "red",
  redLight = "#fdeded",
  orange = "#f1b740",
  orangeLight = "#ffecb2",
}

export enum ImageFilters {
  filter = "brightness(120%) contrast(80%) saturate(200%) sepia(10%)",
}

export enum Shadows {
  boxShadow = "1px 1px 4px 0 rgba(0,0,0,0.2)",
  boxShadowCart = " 0px 3px 5px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 0px 5px 8px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 0px 1px 14px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12)) !important",
  boxShadow2 = " 0px 0px 10px rgba(0, 0, 0, 0.2)",
}

export enum Transform {
  translateY = "translateY(0)",
}

export const FlexCenter: SXProps = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const FlexSpaceBetween: SXProps = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

type ClampProps = {
  line: number;
  height: string;
  lineHeight?: string;
  minHeight: string;
  fontSize?: number;
  width?: string | number;
};

export const clamp = ({
  line,
  height,
  minHeight,
  lineHeight = "16px",
  fontSize = 16,
  width = "100%",
}: ClampProps) => ({
  width: width,
  lineHeight: lineHeight,
  height: height,
  minHeight: minHeight,
  fontSize: fontSize,
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: line,
  WebkitBoxOrient: "vertical",
});

export const Icon: SXProps = {
  mr: 1,
  width: "30px",
  height: "30px",
};

export const StyleStepper = {
  "& button": {
    width: "40px",
    height: "40px",
    p: 0,
    background: Background.gray,
    color: Colors.black,
    borderRadius: "50%",
    "& span.MuiStepLabel-iconContainer.Mui-active.css-vnkopk-MuiStepLabel-iconContainer": {
      color: Colors.white,
      background: Background.yellow,
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      ...FlexCenter,
    },
    "& span.MuiStepLabel-iconContainer.Mui-completed.css-vnkopk-MuiStepLabel-iconContainer": {
      color: Colors.white,
      background: Background.blue,
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      ...FlexCenter,
    },
    "& span.MuiStepLabel-iconContainer.css-vnkopk-MuiStepLabel-iconContainer": {
      pr: 0,
    },
  },
};

export const SCROLLBAR_CUSTOM = {
  "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
  "&::-webkit-scrollbar-thumb": { background: "#888" },
  "&::-webkit-scrollbar": { width: "5px" },
  "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
};
