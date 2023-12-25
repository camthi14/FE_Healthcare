import { BaseAPIService } from "~/helpers";
import instance from "~/helpers/axios.helper";
import { ServicePayloadAdd } from "~/models";
import { SuccessResponseProp } from "~/types";

class ServiceApi extends BaseAPIService {
  postFormData = async (data: ServicePayloadAdd) => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof ServicePayloadAdd;

      if (key === "photo") {
        formData.append(key, data[key]!)!;
      } else if (key === "subclinical") {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        //@ts-ignore
        formData.append(key, data[key]);
      }
    });

    const response: SuccessResponseProp<number> = await instance.post(
      `${this.endPoint}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.metadata;
  };
  patchFormData = async (data: ServicePayloadAdd, paramsId: string | number) => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof ServicePayloadAdd;

      if (key === "photo") {
        formData.append(key, data[key]!)!;
      } else if (key === "subclinical") {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        //@ts-ignore
        formData.append(key, data[key]);
      }
    });

    const response: SuccessResponseProp<number> = await instance.patch(
      `${this.endPoint}/${paramsId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.metadata;
  };
}

export default new ServiceApi("/Services");
