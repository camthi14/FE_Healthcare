import { Queries } from "~/features/specialty";
import { BaseAPIService } from "~/helpers";
import instance from "~/helpers/axios.helper";
import { GetDoctorSpecialist, ISpecialty } from "~/models";
import { SuccessResponseProp } from "~/types";

class SpecialtyApi extends BaseAPIService {
  postFormData = async (data: ISpecialty) => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof ISpecialty;

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
  patchFormData = async (data: ISpecialty, paramsId: string | number) => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof ISpecialty;

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

  getDoctor = async (queries: Queries) => {
    const response: SuccessResponseProp<GetDoctorSpecialist[]> = await instance.get(
      `${this.endPoint}/GetDoctor`,
      { params: queries }
    );

    return response.metadata;
  };
}

export default new SpecialtyApi("/Specialists");
