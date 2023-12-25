import * as yup from "yup";

export const DiagnosisExaminationCardDetailsSchema = yup.object({
  results: yup.string().required("Đây là trường bắt buộc"),
  rate: yup.string().required("Đây là trường bắt buộc"),
});
