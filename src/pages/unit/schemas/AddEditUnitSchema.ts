import * as yup from "yup";

const addEditUnitSchema = yup.object({
  name: yup.string().max(255, "Nhiều nhất 255 kí tự").required("Tên đơn vị là trường bắt buộc!"),
  character: yup.string().max(255, "Nhiều nhất 255 kí tự").required("Kí tự là trường bắt buộc!"),
  desc: yup.string().max(255, "Nhiều nhất 255 kí tự").notRequired(),
});

export default addEditUnitSchema;
