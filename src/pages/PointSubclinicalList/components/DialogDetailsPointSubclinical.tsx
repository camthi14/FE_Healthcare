import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Button,
  Container,
  Dialog,
  DialogContent,
  IconButton,
  TableCell,
  TableRow,
} from "@mui/material";
import { FC, useCallback, useLayoutEffect, useMemo } from "react";
import { AppbarDialog, Transition } from "~/components";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { appActions } from "~/features/app";
import { examinationCardActions, useExaminationCard } from "~/features/examinationCard";
import { MainLayout } from "~/layouts";
import { DiagnosisExaminationCardDetails, ISubclinical } from "~/models";
import { useAppDispatch } from "~/stores";
import { ColumnTable } from "~/types";
import { fDateWithMoment } from "~/utils/formatTime";
import DialogPerformSubclinical from "./PerformSubconical";
import Row from "./Row";

const { Table } = MainLayout;

type DialogDetailsPointSubclinicalProps = {};

const DialogDetailsPointSubclinical: FC<DialogDetailsPointSubclinicalProps> = () => {
  const {
    screenOfDoctorExam: {
      detailsExam,
      open,
      selected,
      examinationCardId,
      openPerFormSubclinical,
      selectedItem,
    },
  } = useExaminationCard();
  const dispatch = useAppDispatch();

  const initialValues = useMemo((): DiagnosisExaminationCardDetails => {
    return {
      detailsId: "",
      subclinicalName: "",
      results: "",
      rate: "",
      subclinicalId: 0,
      serviceName: "",
      images: [],
      removeImages: [],
      ...selectedItem,
    };
  }, [selectedItem]);

  const columns = useMemo(
    (): ColumnTable[] => [
      { id: "STT", label: "STT", minWidth: 60, maxWidth: 60, align: "center" },
      { id: "examinationCardId", label: "M.Ca khám", align: "center" },
      { id: "doctor", label: "Bác sĩ CĐ", align: "center" },
      { id: "nameSubclinical", label: "Tên CLS / DV", align: "center" },

      {
        id: "created_at",
        label: "Ngày chỉ định",
        minWidth: 100,
        maxWidth: 100,
        align: "center",
        format(value) {
          return fDateWithMoment(value, undefined, "DD/MM/YYYY HH:mm:ss");
        },
      },

      { id: "status", label: "Trạng thái", align: "center" },
      { id: "action", label: "Hành động", align: "center" },
    ],
    []
  );

  useLayoutEffect(() => {
    if (!examinationCardId) return;
    dispatch(appActions.setOpenBackdrop());
    dispatch(examinationCardActions.getDataDetailsExamStart(examinationCardId));
  }, [examinationCardId]);

  const onClose = useCallback(() => {
    dispatch(examinationCardActions.setToggleExamDialog(false));
    dispatch(examinationCardActions.setToggleExamDialogSelected(null));
    dispatch(examinationCardActions.setToggleExamCardId(""));

    dispatch(
      examinationCardActions.setToggleSelectedItem({
        detailsId: "",
        rate: "",
        results: "",
        subclinicalName: "",
        serviceName: "",
        subclinicalId: 0,
      })
    );
  }, []);

  const handleOpenPerForm = (item: ISubclinical & { detailsId: string; serviceName?: string }) => {
    dispatch(examinationCardActions.setToggleOpenPerFormSubclinical(true));
    dispatch(
      examinationCardActions.setToggleSelectedItem({
        detailsId: item.detailsId,
        rate: "",
        results: "",
        subclinicalName: item.name,
        serviceName: item.serviceName,
        subclinicalId: item.id!,
      })
    );
  };

  const handleSubmit = useCallback(
    (values: DiagnosisExaminationCardDetails, resetForm: () => void) => {
      if (!examinationCardId) return;

      dispatch(appActions.setOpenBackdrop());
      dispatch(
        examinationCardActions.addResultsExamDetailsStart({
          resetForm,
          data: {
            exam_card_details_id: values.detailsId,
            rate: values.rate,
            results: values.results,
            subclinical_id: values.subclinicalId,
            removeImages: values.removeImages,
            images: values.images,
          },
          examCardId: examinationCardId,
        })
      );
    },
    [examinationCardId]
  );

  return (
    <Dialog fullScreen TransitionComponent={Transition} open={open} onClose={onClose}>
      <AppbarDialog
        title={`Chi tiết danh sách CLS của bệnh nhân ${selected?.patient?.display_name}. Mã BN: ${selected?.patient?.id}`}
      >
        <Button variant="contained">In phiếu KQXN </Button>
        <IconButton onClick={onClose} color="error">
          <HighlightOffIcon />
        </IconButton>
      </AppbarDialog>

      <DialogPerformSubclinical
        onSubmit={handleSubmit}
        initialValues={initialValues}
        onClose={() => dispatch(examinationCardActions.setToggleOpenPerFormSubclinical(false))}
        open={openPerFormSubclinical}
      />

      <DialogContent sx={SCROLLBAR_CUSTOM}>
        <Container>
          <Table columns={columns} autoHeight>
            {!detailsExam.length ? (
              <TableRow>
                <TableCell colSpan={columns.length} component={"th"} scope="row">
                  Không có danh sách chỉ định
                </TableCell>
              </TableRow>
            ) : (
              detailsExam.map((row, i) => (
                <Row
                  onOpenPerForm={handleOpenPerForm}
                  columns={columns}
                  index={i}
                  row={row}
                  key={i}
                />
              ))
            )}
          </Table>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDetailsPointSubclinical;
