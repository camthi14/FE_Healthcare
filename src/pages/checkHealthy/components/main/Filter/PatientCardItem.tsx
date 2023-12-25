import { Box } from "@mui/material";
import { FC } from "react";
import { Background, Colors } from "~/constants";
import { GetPatientForDateResponse } from "~/models";
import { calcAge, convertGender } from "~/utils/common";
import LabelCartItem from "./LabelCartItem";

type PatientCardItemProps = {
  active?: boolean;
  onSelectedPatient?: (patient: GetPatientForDateResponse) => void;
} & GetPatientForDateResponse;

const PatientCardItem: FC<PatientCardItemProps> = (props) => {
  const { active, dataHour, patient, order, type_patient, onSelectedPatient } = props;

  return (
    <Box
      onClick={() => onSelectedPatient?.(props)}
      border={({ palette }) => `1px dashed ${palette.grey[active ? 200 : 400]}`}
      sx={{
        background: active ? Background.blue : Background.blueLight,
        color: active ? Colors.white : Colors.black,
        p: 1,
        mb: 2,
        fontSize: 13,
        transition: "all 0.35s ease-in-out",
      }}
    >
      <LabelCartItem
        labelLeft="Giờ khám"
        labelRight={`${dataHour.time_start} - ${dataHour.time_end}`}
      />
      <LabelCartItem labelLeft={`${patient.display_name}`} labelRight={`STT: ${order}`} />
      <LabelCartItem labelLeft="Mã BN" labelRight={patient.id!} />
      <LabelCartItem
        labelLeft={
          patient.infoData?.birth_date
            ? `Tuổi: ${calcAge(new Date(patient.infoData.birth_date))}`
            : "Tuổi: No info"
        }
        labelRight={`Giới tính: ${convertGender(patient.infoData.gender!)}`}
      />
      <LabelCartItem
        labelLeft="Địa chỉ"
        labelRight={patient.infoData?.address ? `${patient.infoData.address}` : "No info"}
      />
      <LabelCartItem
        labelLeft="Trạng thái"
        labelRight={Boolean(type_patient === "new") ? `Bệnh nhân mới` : "Tái khám"}
      />
    </Box>
  );
};

export default PatientCardItem;
