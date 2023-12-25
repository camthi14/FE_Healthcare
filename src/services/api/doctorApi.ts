import { BaseAPIService } from "~/helpers";
import instance from "~/helpers/axios.helper";
import { DoctorPayloadAdd, IDoctorResponse, IPatientData } from "~/models";
import { IHourObject } from "~/models/scheduleDoctor";
import { Filters, Pagination, SuccessResponseProp } from "~/types";

class DoctorApi extends BaseAPIService {
  postFormData = async (data: DoctorPayloadAdd) => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof DoctorPayloadAdd;

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

  patchFormData = async (data: DoctorPayloadAdd, paramsId: string | number) => {
    const { id, ...dataOthers } = data;
    const formData = new FormData();

    Object.keys(dataOthers).forEach((k) => {
      const key = k as keyof DoctorPayloadAdd;

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

  getMultipleIDs = async (doctorIds: string) => {
    const response: SuccessResponseProp<IDoctorResponse> = await instance.post(
      `${this.endPoint}/getMultipleIDs`,
      { doctorIds }
    );

    return response.metadata;
  };

  getSchedule = async (params: { doctorId: string; date: string }) => {
    const response: SuccessResponseProp<IHourObject> = await instance.get(
      `${this.endPoint}/getSchedule`,
      { params: params }
    );

    return response.metadata;
  };

  getPatients = async (filters: Filters) => {
    const response: SuccessResponseProp<IPatientData[], Pagination> = await instance.get(
      `${this.endPoint}/GetPatients`,
      { params: filters }
    );

    return response;
  };
}

export default new DoctorApi("/Doctors");
