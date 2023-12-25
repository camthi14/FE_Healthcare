import { Alert, Box, Stack } from "@mui/material";
import { useCallback, useEffect, useMemo } from "react";
import { appActions } from "~/features/app";
import { useDoctors } from "~/features/doctor";
import { examinationCardActions, useExaminationCard } from "~/features/examinationCard";
import { frontDeskActions, useFrontDesk } from "~/features/frontDesk";
import { patientActions, usePatients } from "~/features/patient";
import { MainLayout } from "~/layouts";
import { GetHistoryExamination } from "~/models";
import CardExaminationItem from "~/pages/patients/component/CardExaminationItem";
import DialogSeeAssign from "~/pages/patients/component/DialogSeeAssign";
import DialogSeeBill from "~/pages/patients/component/DialogSeeBill";
import DialogShowPrescription from "~/pages/patients/component/DialogShowPrescription";
import { useAppDispatch } from "~/stores";

const { Head, Container } = MainLayout;

const HistoryCheckup = () => {
  const {
    screenExamination: { patientActive },
  } = useDoctors();
  const {
    historyExamination: { data, actions, prescriptions },
  } = usePatients();
  const {
    screenPatientList: { data: seeAssignData },
  } = useExaminationCard();
  const {
    bill: { data: dataBill },
  } = useFrontDesk();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!patientActive?.patient?.id) {
      return;
    }

    dispatch(appActions.setOpenBackdrop());
    dispatch(patientActions.getHistoryExaminationStart({ patientId: patientActive?.patient.id }));
  }, []);

  const getActionsOpen = useMemo(
    () => (mode: "seeBill" | "seePrescription" | "seeAssign") => {
      return Boolean(actions.open === mode);
    },
    [actions]
  );

  const handleClickActions = useCallback(
    (mode: "seeBill" | "seePrescription" | "seeAssign", item: GetHistoryExamination) => {
      if (mode === "seePrescription") {
        dispatch(appActions.setOpenBackdrop());
        dispatch(patientActions.getExaminationCardAndDetailsStart(String(item.id)));
      }

      if (mode === "seeAssign") {
        dispatch(appActions.setOpenBackdrop());
        dispatch(examinationCardActions.getExaminationCardDetailsStart(String(item.id)));
      }

      if (mode === "seeBill") {
        dispatch(appActions.setOpenBackdrop());
        dispatch(frontDeskActions.getBillStart({ limit: 9999, examination_card_id: item.id }));
      }

      dispatch(patientActions.setToggleActions({ data: item, open: mode }));
    },
    []
  );

  const handleCloseActions = useCallback(() => {
    dispatch(patientActions.setToggleActions({ data: null, open: null }));
  }, []);

  const openPrescription = getActionsOpen("seePrescription");
  const openSeeAssign = getActionsOpen("seeAssign");
  const openSeeBill = getActionsOpen("seeBill");

  return (
    <Box>
      {openPrescription ? (
        <DialogShowPrescription
          data={prescriptions}
          onClose={handleCloseActions}
          open={openPrescription}
          history={actions.data!}
        />
      ) : null}

      {openSeeAssign ? (
        <DialogSeeAssign
          data={seeAssignData}
          onClose={handleCloseActions}
          open={openSeeAssign}
          history={actions.data!}
        />
      ) : null}

      {openSeeBill ? (
        <DialogSeeBill
          data={dataBill}
          onClose={handleCloseActions}
          open={openSeeBill}
          history={actions.data!}
        />
      ) : null}

      <Head title="Lịch sử khám bệnh" />

      <Container maxWidth="xl">
        <Stack flexDirection={"row"} gap={2} flexWrap={"wrap"}>
          {data.length ? (
            data.map((row) => {
              return (
                <CardExaminationItem row={row} key={row.id} onClickActions={handleClickActions} />
              );
            })
          ) : (
            <Stack width={"100%"}>
              <Alert color="info">Chưa có lịch sử khám bệnh</Alert>
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default HistoryCheckup;
