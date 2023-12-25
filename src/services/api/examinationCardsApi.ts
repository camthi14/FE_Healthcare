import { BaseAPIService } from "~/helpers";
import instance from "~/helpers/axios.helper";
import {
  ConfirmExaminationType,
  ExaminationCardsDetailType,
  GetPatientForDateQuery,
  GetPatientForDateResponse,
  GetPatientInformationPatient,
  GetRequiredByDoctor,
  PaymentServicePayload,
  RequiredExaminationSubclinical,
} from "~/models";
import { SuccessResponseProp } from "~/types";

class ExaminationCardsApi extends BaseAPIService {
  getPatientInformation = async (bookingId: string) => {
    const response: SuccessResponseProp<GetPatientInformationPatient> = await instance.get(
      `${this.lastEndPoint}/GetPatientInformation?bookingId=${bookingId}`
    );

    return response.metadata;
  };

  getPatientForDate = async (query: GetPatientForDateQuery) => {
    const response: SuccessResponseProp<GetPatientForDateResponse[]> = await instance.get(
      `${this.lastEndPoint}/GetPatientForDate`,
      { params: query }
    );

    return response.metadata;
  };

  getExaminationForDate = async (query: GetPatientForDateQuery) => {
    const response: SuccessResponseProp<GetPatientForDateResponse[]> = await instance.get(
      `${this.lastEndPoint}/GetExaminationForDate`,
      { params: query }
    );

    return response.metadata;
  };

  getExaminationCardDetails = async (examinationCardId: string) => {
    const response: SuccessResponseProp<GetPatientForDateResponse[]> = await instance.get(
      `${this.lastEndPoint}/GetExaminationCardDetails`,
      { params: { examinationCardId } }
    );

    return response.metadata;
  };

  paymentService = async (data: PaymentServicePayload) => {
    const response: SuccessResponseProp<boolean> = await instance.post(
      `${this.lastEndPoint}/Payment`,
      data
    );

    return response.metadata;
  };

  confirmExamination = async (data: ConfirmExaminationType) => {
    const response: SuccessResponseProp<boolean> = await instance.post(
      `${this.lastEndPoint}/ConfirmExamination`,
      data
    );

    return response.metadata;
  };

  requiredExaminationSubclinical = async (data: RequiredExaminationSubclinical) => {
    const response: SuccessResponseProp<ExaminationCardsDetailType[]> = await instance.post(
      `${this.lastEndPoint}/RequiredExaminationSubclinical`,
      data
    );

    return response.metadata;
  };

  getRequiredByDoctor = async (query: GetRequiredByDoctor) => {
    const response: SuccessResponseProp<ExaminationCardsDetailType[]> = await instance.get(
      `${this.lastEndPoint}/GetRequired`,
      { params: query }
    );

    return response.metadata;
  };
}

export default new ExaminationCardsApi("/ExaminationCards");
