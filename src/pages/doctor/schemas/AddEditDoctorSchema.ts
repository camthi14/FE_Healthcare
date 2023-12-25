import * as yup from "yup";

export const PHONE_REGEX = /((0[1|2|3|4|5|6|7|8|9])+([0-9]{8})\b)/g;

export const addEditDoctorSchema = (isEditMode: boolean) => {
  if (isEditMode)
    return yup.object({
      first_name: yup.string().required("Tên bác sĩ là trường bắt buộc"),
      last_name: yup.string().required("Họ bác sĩ là trường bắt buộc"),
      phone_number: yup
        .string()
        .matches(PHONE_REGEX, "Số điện thoại không hợp lệ.")
        .required("Số điện thoại là trường bắt buộc"),
      email: yup
        .string()
        .email("Nhập địa chỉ email hợp lệ")
        .required("Email bác sĩ là trường bắt buộc"),
      gender: yup.string().required("Giới tính là trường bắt buộc"),
      //   roles: yup
      //     .array()
      //     .required("Vai trò là trường bắt buộc")
      //     .of(
      //       yup.object({
      //         id: yup.number().required("id là trường bắt buộc"),
      //       })
      //     ),
      qualified_doctor_id: yup.number().required("Trình độ bác sĩ là trường bắt buộc"),
      speciality_id: yup.number().required("Chuyên khoa là trường bắt buộc"),
      position_id: yup.number().required("Bộ phận bác sĩ là trường bắt buộc"),
      department_id: yup.number().required("Chức vụ bác sĩ là trường bắt buộc"),
    });

  return yup.object({
    first_name: yup.string().required("Tên bác sĩ là trường bắt buộc"),
    last_name: yup.string().required("Họ bác sĩ là trường bắt buộc"),
    username: yup.string().required("Họ bác sĩ là trường bắt buộc"),
    phone_number: yup
      .string()
      .matches(PHONE_REGEX, "Số điện thoại không hợp lệ.")
      .required("Số điện thoại là trường bắt buộc"),
    email: yup
      .string()
      .email("Nhập địa chỉ email hợp lệ")
      .required("Email bác sĩ là trường bắt buộc"),
    password: yup
      .string()
      .min(5, "Mật khẩu ít nhất 5 kí tự")
      .required("Mật khẩu bác sĩ là trường bắt buộc"),
    photo: yup.string().notRequired(),
    gender: yup.string().required("Giới tính là trường bắt buộc"),
    // roles: yup
    //   .array()
    //   .required("Vai trò là trường bắt buộc")
    //   .of(
    //     yup.object({
    //       id: yup.number().required("id là trường bắt buộc"),
    //     })
    //   ),
    qualified_doctor_id: yup.number().required("Trình độ bác sĩ là trường bắt buộc"),
    speciality_id: yup.number().required("Chuyên khoa là trường bắt buộc"),
    position_id: yup.number().required("Bộ phận bác sĩ là trường bắt buộc"),
    department_id: yup.number().required("Chức vụ bác sĩ là trường bắt buộc"),
  });
};
