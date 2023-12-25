import { BaseAPIService } from "~/helpers";
import instance from "~/helpers/axios.helper";
import { ReportDashboardState } from "~/models/report.model";
import { SuccessResponseProp } from "~/types";

class ReportApi extends BaseAPIService {
  dashboard = async () => {
    const response: SuccessResponseProp<ReportDashboardState> = await instance.get(
      `${this.endPoint}/dashboard`
    );
    return response.metadata;
  };
}

export default new ReportApi("/Reports");
