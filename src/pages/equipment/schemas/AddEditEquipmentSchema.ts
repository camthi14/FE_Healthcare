import * as yup from "yup";

export const addEditEquipmentSchema = (isEditMode: boolean) => {
  if (isEditMode)
    return yup.object({
      name: yup
        .string()
        .max(255, "Nhiều nhất 255 kí tự")
        .required("Tên thiết bị y tế là trường bắt buộc!"),
      equipment_type_id: yup.number().required("Loại thiết bị y tế là trường bắt buộc"),
      desc: yup.string().max(255, "Nhiều nhất 255 kí tự").notRequired(),
    });

  return yup.object({
    name: yup.string().max(255, "Nhiều nhất 255 kí tự").required("Tên bộ phận là trường bắt buộc!"),
    photo: yup.string().notRequired(),
    equipment_type_id: yup.number().required("Loại thiết bị y tế là trường bắt buộc"),
    desc: yup.string().max(255, "Nhiều nhất 255 kí tự").notRequired(),
  });
};
