import * as yup from "yup";

const addEditDepartmentSchema = yup.object({
  name: yup.string().max(255, "Nhiều nhất 255 kí tự").required("Tên bộ phận là trường bắt buộc!"),
  desc: yup.string().max(255, "Nhiều nhất 255 kí tự").notRequired(),
});

export default addEditDepartmentSchema;
