import * as yup from "yup";

const loginSchema = yup.object({
  username: yup.string().required("Tài khoản là trường bắt buộc!"),
  password: yup
    .string()
    .min(4, "Ít nhất 4 kí tự")
    .max(32, "Nhiều nhất 32 kí tự")
    .required("Mật khẩu là trường bắt buộc!"),
});

export default loginSchema;
