import * as yup from "yup";

const patientBookSchema = yup.object({
  name: yup.string().max(255, "Nhiều nhất 255 kí tự").required("Tên bộ phận là trường bắt buộc!"),
  desc: yup.string().max(255, "Nhiều nhất 255 kí tự").notRequired(),
});

export const StepOnBasicSchema = yup.object({
  reason: yup.string().required("Triệu trứng là trường bắt buộc"),
  specialty: yup
    .object({
      id: yup.number().required(),
      name: yup.string().required(),
    })
    .required("Chuyên khoa là trường bắt buộc"),
  patient: yup
    .object({
      id: yup.string().required(),
      displayName: yup.string().required(),
    })
    .required("Bệnh nhân là trường bắt buộc"),
});

export default patientBookSchema;
