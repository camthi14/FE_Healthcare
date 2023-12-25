import { ISessionCheckup } from "~/models/sessionCheckup";

const sessionCheckup: ISessionCheckup[] = [
  {
    id: 1,
    name: "Buổi sáng",
    status: "active",
    time_end: new Date(0, 0, 0, 11, 30, 0).toString(),
    time_start: new Date(0, 0, 0, 7, 30, 0).toString(),
  },
  {
    id: 2,
    name: "Buổi chiều",
    status: "active",
    time_end: new Date(0, 0, 0, 17, 0, 0).toString(),
    time_start: new Date(0, 0, 0, 13, 30, 0).toString(),
  },
];

export default sessionCheckup;
