import { BaseAPIService } from "~/helpers";
import instance from "~/helpers/axios.helper";
import { IBooking } from "~/models";
import { SuccessResponseProp } from "~/types";

class BookingApi extends BaseAPIService {
  getByHourId = async (hourID: string) => {
    const response: SuccessResponseProp<IBooking | null> = await instance.get(
      `${this.endPoint}/GetByHourId/${hourID}`
    );

    return response.metadata;
  };
}

export default new BookingApi("/Bookings");
