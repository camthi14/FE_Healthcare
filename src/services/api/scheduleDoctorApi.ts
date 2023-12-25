import { BaseAPIService } from "~/helpers";
import instance from "~/helpers/axios.helper";
import {
  DoctorCancelScheduleInput,
  GetScheduleDoctorForDates,
  ScheduleDoctorPayload,
} from "~/models/scheduleDoctor";
import { SuccessResponseProp } from "~/types";

class ScheduleDoctorApi extends BaseAPIService {
  createMultiple = async (data: { data: ScheduleDoctorPayload[] }) => {
    const response: SuccessResponseProp<number> = await instance.post(
      `${this.endPoint}/Multiple`,
      data
    );
    return response.metadata;
  };

  getScheduleDoctors = async (query: { doctorId: string; dates: string }) => {
    const response: SuccessResponseProp<GetScheduleDoctorForDates[]> = await instance.get(
      `${this.endPoint}/GetByDoctorAndDates`,
      { params: query }
    );

    return response.metadata;
  };

  doctorCancel = async (payload: DoctorCancelScheduleInput) => {
    const response: SuccessResponseProp<boolean> = await instance.post(
      `${this.endPoint}/DoctorCancel`,
      payload
    );

    return response.metadata;
  };
}

export default new ScheduleDoctorApi("/ScheduleDoctors");
