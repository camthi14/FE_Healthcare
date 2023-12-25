import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Alert, DialogContent, Stack } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FC, ReactElement, Ref, forwardRef, useCallback, useMemo } from "react";
import { AppbarDialog } from "~/components";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { appActions } from "~/features/app";
import { examinationCardActions, useExaminationCard } from "~/features/examinationCard";
import { patientActions, usePatients } from "~/features/patient";
import { GetHistoryExamination } from "~/models";
import { useAppDispatch } from "~/stores";
import CardExaminationItem from "./CardExaminationItem";
import DialogSeeAssign from "./DialogSeeAssign";
import DialogShowPrescription from "./DialogShowPrescription";
import { frontDeskActions, useFrontDesk } from "~/features/frontDesk";
import DialogSeeBill from "./DialogSeeBill";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type DialogHistoryBookingProps = {
  onOpen: boolean;
  onClose: () => void;
};

const DialogHistoryBooking: FC<DialogHistoryBookingProps> = ({ onOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const {
    historyExamination: { selectedPatient, data, actions, prescriptions },
  } = usePatients();
  const {
    screenPatientList: { data: seeAssignData },
  } = useExaminationCard();
  const {
    bill: { data: dataBill },
  } = useFrontDesk();

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
    <>
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

      <Dialog fullScreen open={onOpen} onClose={onClose} TransitionComponent={Transition}>
        <AppbarDialog
          title={`Lịch sử khám bệnh của bệnh nhân ${
            selectedPatient?.display_name
          }. Mã bệnh nhân: ${selectedPatient?.id!}`}
        >
          <IconButton color="error" size="small" onClick={onClose}>
            <HighlightOffIcon />
          </IconButton>
        </AppbarDialog>

        <DialogContent dividers sx={SCROLLBAR_CUSTOM}>
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogHistoryBooking;
