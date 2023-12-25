import * as yup from "yup";

const addEditEquipmentTypeSchema = yup.object({
  name: yup
    .string()
    .max(255, "Nhiều nhất 255 kí tự")
    .required("Tên thiết bị vật tư là trường bắt buộc!"),
  desc: yup.string().max(255, "Nhiều nhất 255 kí tự").notRequired(),
});

export default addEditEquipmentTypeSchema;
