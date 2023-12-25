import * as yup from "yup";

export const dialogConfirmSchema = yup.object({
  artery: yup
    .number()
    .min(60, "Mạch tối thiểu là 60")
    .max(80, "Mạch tối đa là 80")
    .required("Mạch là trường bắt buộc"),
  temperature: yup
    .number()
    .min(35, "Nhiệt độ nhỏ nhất 35 độ C")
    .max(42, "Nhiệt độ tối đa 42 độ C")
    .required("Nhiệt độ là trường bắt buộc"),
  spO2: yup.number().min(0, "Không được phép nhỏ hơn 0").required("SpO2 là trường bắt buộc"),
  breathing_rate: yup
    .number()
    .min(8, "Nhịp thở tối thiểu là 8")
    .max(35, "Nhịp thở tối đa là 35")
    .required("Nhịp thở là trường bắt buộc"),
  blood_pressure: yup
    .number()
    .min(90, "Huyết áp tối thiểu 90")
    .max(180, "Huyết áp tối đa 180")
    .required("Huyết áp là trường bắt buộc"),
  under_blood_pressure: yup
    .number()
    .min(60, "Huyết áp dưới tối thiểu 60")
    .max(120, "Huyết áp tối đa 120")
    .required("Huyết áp là trường bắt buộc"),
  is_use_service: yup.boolean().notRequired(),
});
