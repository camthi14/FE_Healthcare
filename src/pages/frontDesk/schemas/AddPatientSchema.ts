import * as yup from "yup";

export const PHONE_REGEX = /((0[1|2|3|4|5|6|7|8|9])+([0-9]{8})\b)/g;

export const addPatientSchema = yup.object({
  first_name: yup.string().required("Tên bệnh nhân là trường bắt buộc"),
  last_name: yup.string().required("Họ bệnh nhân là trường bắt buộc"),
  birth_date: yup.string().required("Ngày sinh là trường bắt buộc"),
  address: yup.string().required("Địa chỉ là trường bắt buộc"),
  patient_type_id: yup.number().required("Loại bệnh nhân là trường bắt buộc"),
  phone_number: yup
    .string()
    .matches(PHONE_REGEX, "Số điện thoại không hợp lệ.")
    .required("Số điện thoại là trường bắt buộc"),
  gender: yup.string().required("Giới tính là trường bắt buộc"),
});
