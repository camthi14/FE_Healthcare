import { Grid } from "@mui/material";
import { FC, useCallback, useState } from "react";
import { Search } from "~/components";
import { doctorActions, useDoctors } from "~/features/doctor";
import { useFrontDesk } from "~/features/frontDesk";
import { ExaminationCardStatus, GetPatientForDateResponse } from "~/models";
import { useAppDispatch } from "~/stores";
import DialogConfirmExamination from "./DialogConfirmExamination";
import FilterButton from "./FilterButton";
import PatientCardItem from "./PatientCardItem";
import { appActions } from "~/features/app";
import { examinationCardActions } from "~/features/examinationCard";
import { useAccount } from "~/features/auth";
import { patientActions } from "~/features/patient";

type Props = {};

const TABS: { label: string; value: ExaminationCardStatus }[] = [
  { label: "Chờ khám", value: "pending" },
  { label: "Đang khám bệnh", value: "examination" },
  { label: "Hoàn thành", value: "complete" },
];

const Filter: FC<Props> = () => {
  const {
    patients: { data },
  } = useFrontDesk();
  const [selected, setSelected] = useState<GetPatientForDateResponse | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const doctor = useAccount();

  const {
    screenExamination: {
      selectedExaminationId,
      status,
      openDialogConfirmExamination,
      openDialogSwitchPatient,
    },
  } = useDoctors();

  const dispatch = useAppDispatch();

  const handleSelectedPatient = useCallback((patient: GetPatientForDateResponse) => {
    handleOpen();
    dispatch(patientActions.getHistoryExaminationSuccess([]));
    dispatch(doctorActions.setSelectedExaminationId(patient.examinationData.id!));
  }, []);

  const handleChangeTab = useCallback((value: ExaminationCardStatus) => {
    dispatch(doctorActions.setStatus(value));
    dispatch(doctorActions.setStatusBooking(value === "complete" ? "completed" : "in_progress"));
    dispatch(patientActions.getHistoryExaminationSuccess([]));
    dispatch(doctorActions.setSelectedPatientActive(null));
    dispatch(doctorActions.setSelectedExaminationId(""));
    dispatch(examinationCardActions.prescriptionGetByExamCardIdSuccess(null));
  }, []);

  const handleClose = useCallback(() => {
    dispatch(doctorActions.setSelectedExaminationId(""));
    dispatch(doctorActions.setToggleConfirmExamination(false));
  }, []);

  const handleOpen = useCallback(() => {
    dispatch(doctorActions.setToggleConfirmExamination(true));
  }, []);

  const handleOnAgree = useCallback(() => {
    if (!selectedExaminationId || !doctor) return;
    dispatch(appActions.setOpenBackdrop());
    dispatch(
      examinationCardActions.confirmExaminationStart({
        examinationId: selectedExaminationId,
        doctorId: String(doctor.id!),
      })
    );
  }, [selectedExaminationId, doctor]);

  const handleSwitchPatient = useCallback((item: GetPatientForDateResponse) => {
    setSelected(item);
    setSelectedId(item.examinationData.id!);
    dispatch(doctorActions.setToggleSwitchPatient(true));
    dispatch(patientActions.getHistoryExaminationSuccess([]));
  }, []);

  const handleCloseSwitchPatient = useCallback(() => {
    dispatch(doctorActions.setToggleSwitchPatient(false));
  }, []);

  const handleSwitchAgree = useCallback(
    (data?: GetPatientForDateResponse) => {
      if (!data || !selectedId) return;
      dispatch(doctorActions.setToggleSwitchPatient(false));
      dispatch(doctorActions.setSelectedPatientActive(data));
      dispatch(doctorActions.setSelectedExaminationId(selectedId));
    },
    [selectedId]
  );

  return (
    <Grid container spacing={2}>
      <DialogConfirmExamination
        text="Bạn có chắc muốn tiếp nhận ca khám này không?"
        textConfirm="Tiếp nhận ca khám"
        open={openDialogConfirmExamination}
        onClose={handleClose}
        onAgree={handleOnAgree}
      />

      <DialogConfirmExamination
        text="Bạn có chắc muốn chuyển đổi bệnh nhân không?"
        textConfirm="Chuyển đổi"
        open={openDialogSwitchPatient}
        data={selected || undefined}
        onClose={handleCloseSwitchPatient}
        onAgree={handleSwitchAgree}
      />

      {/* <Grid item sx={{ width: "100%" }}>
        <Search width={"100%"} placeholder="Tìm kiếm tên bệnh nhân" />
      </Grid>J

      <Grid item sx={{ width: "100%" }}>
        <Search width={"100%"} placeholder="Tìm kiếm mã bệnh nhân" />
      </Grid> */}

      <Grid item display={"flex"} flexDirection={"row"} sx={{ width: "100%" }}>
        {TABS.map((tab) => (
          <FilterButton
            {...tab}
            key={tab.value}
            active={tab.value === status}
            onClick={handleChangeTab}
          />
        ))}
      </Grid>

      <Grid item sx={{ width: "100%" }}>
        {data.length
          ? data.map((row) => (
              <PatientCardItem
                key={row.id}
                active={selectedExaminationId === row.examinationData.id}
                onSelectedPatient={
                  row.examinationData.status === "examination"
                    ? selectedExaminationId === row.examinationData.id
                      ? undefined
                      : handleSwitchPatient
                    : row.examinationData.status === "complete"
                    ? handleSwitchPatient
                    : handleSelectedPatient
                }
                {...row}
              />
            ))
          : null}
      </Grid>
    </Grid>
  );
};

export default Filter;
