import * as yup from "yup";

const addEditMedicineTypeSchema = yup.object({
  name: yup
    .string()
    .max(255, "Nhiều nhất 255 kí tự")
    .required("Tên loại thuốc là trường bắt buộc!"),
  desc: yup.string().max(255, "Nhiều nhất 255 kí tự").notRequired(),
});

export default addEditMedicineTypeSchema;
