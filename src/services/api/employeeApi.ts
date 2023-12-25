import { BaseAPIService } from "~/helpers";
import instance from "~/helpers/axios.helper";
import { EmployeePayloadAdd } from "~/models";
import { SuccessResponseProp } from "~/types";

class EmployeeAPI extends BaseAPIService {
  postFormData = async (data: EmployeePayloadAdd) => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof EmployeePayloadAdd;

      if (key === "photo") {
        formData.append(key, data[key]);
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

  patchFormData = async (data: EmployeePayloadAdd, paramsId: string | number) => {
    const { id, ...dataOthers } = data;
    const formData = new FormData();

    Object.keys(dataOthers).forEach((k) => {
      const key = k as keyof EmployeePayloadAdd;

      if (key === "photo") {
        formData.append(key, dataOthers[key]!)!;
      } else {
        //@ts-ignore
        formData.append(key, dataOthers[key]);
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

export default new EmployeeAPI("/Employees");
