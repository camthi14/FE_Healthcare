import * as yup from "yup";

export const addEditSubclinicalSchema = yup.object({
  name: yup.string().max(255, "Nhiều nhất 255 kí tự").required("Tên mẫu CLS là trường bắt buộc!"),
  content: yup.string().notRequired(),
  subclinical_type_id: yup.number().required("Loại CLS là trường bắt buộc"),
  room_id: yup.number().required("Phòng là trường bắt buộc"),
  price: yup.number().required("Giá CLS là trường bắt buộc"),
  desc: yup.string().notRequired(),
});
