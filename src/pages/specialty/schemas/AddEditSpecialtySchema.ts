import * as yup from "yup";

export const addEditSpecialtySchema = (isEditMode: boolean) => {
  if (isEditMode)
    return yup.object({
      name: yup
        .string()
        .max(255, "Nhiều nhất 255 kí tự")
        .required("Tên bộ phận là trường bắt buộc!"),
      time_chekup_avg: yup
        .string()
        .required("Thời gian khám trung bình 1 ca khám là trường bắt buộc"),
      price: yup.string().required("Giá khám là trường bắt buộc"),
      desc: yup.string().max(255, "Nhiều nhất 255 kí tự").notRequired(),
    });

  return yup.object({
    name: yup.string().max(255, "Nhiều nhất 255 kí tự").required("Tên bộ phận là trường bắt buộc!"),
    photo: yup.string().notRequired(),
    time_chekup_avg: yup
      .string()
      .required("Thời gian khám trung bình 1 ca khám là trường bắt buộc"),
    price: yup.string().required("Giá khám là trường bắt buộc"),
    desc: yup.string().max(255, "Nhiều nhất 255 kí tự").notRequired(),
  });
};
