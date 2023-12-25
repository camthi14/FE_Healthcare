import * as yup from "yup";

const addEditQualificationSchema = yup.object({
  name: yup.string().max(255, "Nhiều nhất 255 kí tự").required("Tên trình độ là trường bắt buộc!"),
  character: yup
    .string()
    .max(255, "Nhiều nhất 255 kí tự")
    .required("Kí tự viết tắt trình độ là trường bắt buộc!"),
});

export default addEditQualificationSchema;
