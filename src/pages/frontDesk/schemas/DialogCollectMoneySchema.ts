import * as yup from "yup";
import { fNumber } from "~/utils/formatNumber";

export const dialogCollectMoneySchema = () => {
  return yup.object({
    change: yup.number(),
    price_received: yup
      .number()
      .min(1000, `Vui lòng nhập số tiền lớn hơn ${fNumber(1000)} đ`)
      .required("Đây là trường bắt buộc"),
  });
};
