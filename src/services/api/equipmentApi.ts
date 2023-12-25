import { BaseAPIService } from "~/helpers";
import instance from "~/helpers/axios.helper";
import { IEquipment } from "~/models";
import { SuccessResponseProp } from "~/types";

class EquipmentApi extends BaseAPIService {
  postFormData = async (data: IEquipment) => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof IEquipment;

      if (key === "photo") {
        formData.append(key, data[key]!)!;
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
  patchFormData = async (data: IEquipment, paramsId: string | number) => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof IEquipment;

      if (key === "photo") {
        formData.append(key, data[key]!)!;
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

export default new EquipmentApi("/Equipments");
