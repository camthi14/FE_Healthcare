import * as yup from "yup";

const addEditMedicineSchema = yup.object({
  name: yup.string().max(255, "Nhiều nhất 255 kí tự").required("Tên thuốc là trường bắt buộc!"),
  medictine_type_id: yup.number().required("Loại thuốc là trường bắt buộc"),
  unit_id: yup.number().required("Đơn vị thuốc là trường bắt buộc"),
  quantity: yup.number().required("Số lượng thuốc là trường bắt buộc"),
  price: yup.number().required("Giá thuốc là trường bắt buộc"),
  production_date: yup.string().required("Ngày sản xuất thuốc là trường bắt buộc"),
  drug_concentration: yup.number().required("Nồng độ thuốc là trường bắt buộc"),
  price_sell: yup.number().required("Giá thuốc bán là trường bắt buộc"),
  ingredients: yup.string().required("Thành phần thuốc là trường bắt buộc"),
  expired_at: yup.string().required("Hạn sử dụng thuốc là trường bắt buộc"),
});

export default addEditMedicineSchema;
