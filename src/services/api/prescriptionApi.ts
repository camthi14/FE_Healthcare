import { BaseAPIService } from "~/helpers";
import instance from "~/helpers/axios.helper";
import {
  AddPrescriptionDetailsPayload,
  PrescriptionGetByExamCardIdQuery,
  PrescriptionType,
  ReceivePrescriptionInput,
  ResponseGetExamCardAndDetails,
} from "~/models/prescriptions.model";
import { SuccessResponseProp } from "~/types";

class PrescriptionsApi extends BaseAPIService {
  getByExamCardId = async (query: PrescriptionGetByExamCardIdQuery) => {
    const response: SuccessResponseProp<PrescriptionType | null> = await instance.get(
      `${this.endPoint}/GetByExamCardId`,
      {
        params: query,
      }
    );

    return response.metadata;
  };
  addPrescriptionDetails = async (data: AddPrescriptionDetailsPayload) => {
    const response: SuccessResponseProp<boolean> = await instance.post(
      `${this.endPoint}/AddPrescriptionDetails`,
      data
    );

    return response.metadata;
  };

  getPrescriptionsAndDetails = async (examCardId: string) => {
    const response: SuccessResponseProp<ResponseGetExamCardAndDetails> = await instance.get(
      `${this.lastEndPoint}/GetByExamCardIdV2`,
      { params: { examCardId } }
    );

    return response.metadata;
  };

  receivePrescription = async (payload: ReceivePrescriptionInput) => {
    const response: SuccessResponseProp<boolean> = await instance.post(
      `${this.lastEndPoint}/ReceivePrescription`,
      payload
    );

    return response.metadata;
  };
}

export default new PrescriptionsApi("/Prescriptions");
