import * as yup from "yup";

const DialogServiceSchema = yup.object({
  name: yup.string().max(255, "Nhiều nhất 255 kí tự").required("Tên bộ phận là trường bắt buộc!"),
  desc: yup.string().max(255, "Nhiều nhất 255 kí tự").notRequired(),
});

export const DialogServicePackSchema = yup.object({
  options: yup
    .string()
    .max(255, "Nhiều nhất 255 kí tự")
    .required("Lựa chọn dịch vụ khám là bắt buộc"),
  service_id: yup.number().when("options", {
    is: "service",
    then(schema) {
      return schema.required("Vui lòng chọn gói khám.");
    },
    otherwise(schema) {
      return schema.required("Vui lòng chọn mẫu CLS.");
    },
  }),
  quantity_perform: yup.number().notRequired(),
  note: yup.string().notRequired(),
  data: yup.array().notRequired(),
});

export default DialogServiceSchema;
