import * as yup from "yup";

export const saveSchema = yup.object({
  diagnosis: yup.string().required("Đây là trường bắt buộc"),
  note: yup.string().notRequired(),
});
