import { BaseAPIService } from "~/helpers";
import instance from "~/helpers/axios.helper";
import {
  GetHistoryExamination,
  GetHistoryExaminationQuery,
  ISpecialty,
  PatientPayloadAdd,
  PatientTypeModel,
} from "~/models";
import { SuccessResponseProp } from "~/types";

class PatientApi extends BaseAPIService {
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

  getPatientType = async () => {
    const response: SuccessResponseProp<PatientTypeModel[]> = await instance.get(`/PatientTypes`);
    return response.metadata;
  };

  addPatientDesktop = async (data: PatientPayloadAdd) => {
    const response: SuccessResponseProp<PatientTypeModel[]> = await instance.post(
      `${this.endPoint}/patientNew`,
      data
    );
    return response.metadata;
  };

  getHistoryExaminationCard = async (query: GetHistoryExaminationQuery) => {
    const response: SuccessResponseProp<GetHistoryExamination[]> = await instance.get(
      `${this.endPoint}/GetHistoryExamination`,
      { params: query }
    );

    return response.metadata;
  };
}

export default new PatientApi("/Patients");
