import { AxiosError } from "axios";
import { ErrorCommon } from "~/types";

export const isErrorAxios = (error: any) => {
  return Boolean(error?.response?.data?.message);
};

export const msgErrorAxios = (error: any): string => error.response.data.message;

export const messageErrorSaga = (error: any): string => {
  let message = error?.message;

  if (isErrorAxios(error)) {
    message = msgErrorAxios(error);
  }

  return message;
};

export const isInstanceAxios = (error: any) => {
  if (error instanceof AxiosError) {
    return error as ErrorCommon;
  }

  return false;
};
