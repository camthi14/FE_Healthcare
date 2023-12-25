import { BaseAPIService } from "~/helpers";
import instance from "~/helpers/axios.helper";
import { ResultsDiagnosisSubclinical } from "~/models";
import { SuccessResponseProp } from "~/types";

class ResultsDiagnosisSubclinicalApi extends BaseAPIService {
  postForm = async (data: ResultsDiagnosisSubclinical) => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      const key = k as keyof ResultsDiagnosisSubclinical;

      if (key === "images") {
        const length = data[key]?.length || 0;

        for (let index = 0; index < length; index++) {
          const element = data[key]![index];
          formData.append(`${key}`, element);
        }
      } else if (key === "removeImages") {
        formData.append(key, JSON.stringify(data[key]));
      } else formData.append(key, data[key] as string);
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
}

export default new ResultsDiagnosisSubclinicalApi("/ResultsDiagnosisSubclinicals");
