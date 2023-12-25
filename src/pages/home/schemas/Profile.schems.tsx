import * as yup from "yup";

export const PHONE_REGEX = /((0[1|2|3|4|5|6|7|8|9])+([0-9]{8})\b)/g;

export const profileSchema = () => {
  return yup.object({
    first_name: yup.string().required("Tên nhân viên là trường bắt buộc"),
    last_name: yup.string().required("Họ nhân viên là trường bắt buộc"),
    phone_number: yup
      .string()
      .matches(PHONE_REGEX, "Số điện thoại không hợp lệ.")
      .required("Số điện thoại là trường bắt buộc"),
    email: yup
      .string()
      .email("Nhập địa chỉ email hợp lệ")
      .required("Email nhân viên là trường bắt buộc"),
    gender: yup.string().required("Giới tính là trường bắt buộc"),
    //   roles: yup
    //     .array()
    //     .required("Vai trò là trường bắt buộc")
    //     .of(
    //       yup.object({
    //         id: yup.number().required("id là trường bắt buộc"),
    //       })
    //     ),
    position_id: yup.string().required("Chức vụ nhân viên là trường bắt buộc"),
    department_id: yup.string().required("Bộ phận nhân viên là trường bắt buộc"),
  });
};
