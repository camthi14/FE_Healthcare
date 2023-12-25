import { AxiosError } from "axios";

export interface SuccessResponseProp<Metadata, Options = unknown> {
  message: string;
  statusCode?: number;
  reasonStatusCode?: string;
  metadata: Metadata;
  options?: Options;
}

export interface ErrorResponse {
  status: string;
  code: string;
  message: string;
  others_message: null | Record<string, any>;
  exception: null | string;
}

export type ErrorCommon = AxiosError<ErrorResponse>;
