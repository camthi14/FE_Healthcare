import * as yup from "yup";

export const addEditServiceSchema = yup.object({
  name: yup
    .string()
    .max(255, "Nhiều nhất 255 kí tự")
    .required("Tên gói dịch vụ là trường bắt buộc!"),
  photo: yup.string().notRequired(),
  content: yup.string().max(255, "Nhiều nhất 255 kí tự").notRequired(),
  service_type_id: yup.number().required("Loại dịch vụ là trường bắt buộc"),
  price: yup.number().required("Giá dịch vụ là trường bắt buộc"),
  desc: yup.string().max(255, "Nhiều nhất 255 kí tự").notRequired(),
  subclinical: yup.array().required("Vui lòng chọn cận lâm sàng"),
});
