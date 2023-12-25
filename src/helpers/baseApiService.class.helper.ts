import { SuccessResponseProp } from "~/types/response.type";
import instance from "./axios.helper";
import { ForgotPasswordPayload } from "~/types";

class BaseAPIService {
  private _endPoint: string;
  private _lastEndPoint: string;

  constructor(endPoint: string) {
    this._endPoint = endPoint;
    this._lastEndPoint = endPoint;
  }

  public post = async <Data, Response = unknown>(data: Data) => {
    const response: SuccessResponseProp<Response> = await instance.post(this._endPoint, data);
    return response.metadata;
  };

  public patch = async <Data, Response = unknown>(data: Data, paramsId: string | number) => {
    const response: SuccessResponseProp<Response> = await instance.patch(
      `${this._endPoint}/${paramsId}`,
      data
    );
    return response.metadata;
  };

  public get = async <Filters, Response>(filters?: Filters) => {
    const response: SuccessResponseProp<Response, Filters> = await instance.get(this._endPoint, {
      params: { ...filters },
    });
    return response;
  };

  public getById = async <Response>(paramsId: string | number) => {
    const response: SuccessResponseProp<Response> = await instance.get(
      `${this._endPoint}/${paramsId}`
    );
    return response.metadata;
  };

  public getProfile = async <Response>() => {
    const response: SuccessResponseProp<Response> = await instance.get(
      `${this._endPoint}/getProfile`
    );
    return response.metadata;
  };

  public delete = async (paramsId: number | string) => {
    const response = await instance.delete(`${this._endPoint}/${paramsId}`);
    return response;
  };

  public refreshToken = async () => {
    const response: SuccessResponseProp<{ refreshToken: string; accessToken: string }> =
      await instance.post(`${this._endPoint}/refreshToken`);

    return response.metadata;
  };

  public forgotPassword = async (url: string, data: ForgotPasswordPayload) => {
    const response = await instance.post(`${this._endPoint}/forgotPassword`);
    return response;
  };

  public logout = async () => {
    const response: SuccessResponseProp<boolean> = await instance.post(`${this._endPoint}/logout`);
    return response.metadata;
  };

  get endPoint() {
    return this._endPoint;
  }

  get lastEndPoint() {
    return this._lastEndPoint;
  }

  set endPoint(endPoint: string) {
    this._endPoint = endPoint;
  }

  public useLastEndPoint() {
    this._endPoint = this._lastEndPoint;
    return this;
  }
}

export default BaseAPIService;
