import { CSSProperties, ReactNode } from "react";

export type LoadingState = "ready" | "pending" | "completed" | "failed";

export type Filters = {
  page: number;
  limit: number;
} & Record<string, any>;

export type Pagination = {
  page: number;
  limit: number;
  totalPage: number;
  totalRows: number;
};

export type ColumnTable = {
  id: string;
  label: string | ReactNode;
  minWidth?: number;
  maxWidth?: number;
  align?: "right" | "center" | "left";
  styles?: CSSProperties;
  format?: (value: any) => string;
};

export type FcRefreshPromise = () => Promise<{
  accessToken: string;
  refreshToken: string;
}>;

export type OptionState = {
  label: string;
  value: string | number;
};
