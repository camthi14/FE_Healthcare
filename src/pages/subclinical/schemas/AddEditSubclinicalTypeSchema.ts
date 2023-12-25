import * as yup from "yup";

const addEditSubclinicalTypeSchema = yup.object({
  name: yup
    .string()
    .max(255, "Nhiều nhất 255 kí tự")
    .required("Tên loại dịch vụ là trường bắt buộc!"),
});

export default addEditSubclinicalTypeSchema;
