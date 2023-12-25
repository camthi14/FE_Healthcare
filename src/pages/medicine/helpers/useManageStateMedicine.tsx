import { SelectChangeEvent } from "@mui/material";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "~/features/app";
import { medicineActions, useMedicines } from "~/features/medicine";
import { medicineTypeActions, useOptionMedicineType } from "~/features/medicineType";
import { unitActions } from "~/features/unit";
import { ModeTypes } from "~/layouts";
import { IMedicineData, IMedicineType, MedicinePayloadAdd } from "~/models";
import { useAppDispatch } from "~/stores";
import { ColumnTable } from "~/types";

type Selected = {
  type: "edit" | "delete" | null;
  data: IMedicineData | null;
};

export const useManageStateMedicine = () => {
  const { data, filters, loading, pagination } = useMedicines();
  const { severity } = useSnackbar();
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<Selected>({ data: null, type: null });
  const [name, setName] = useState<string>("");
  const [nameType, setNameType] = useState<string>("-1");
  const [openAddMedicine, setOpen] = useState(false);
  const dataMedicineTypes = useOptionMedicineType();

  const columns = useMemo(
    (): ColumnTable[] => [
      { id: "id", label: "ID", minWidth: 70, align: "center" },
      { id: "name", label: "Tên thuốc", minWidth: 70 },
      {
        id: "medicineType",
        label: "Loại thuốc",
        minWidth: 70,
        format(value: IMedicineType) {
          return value.name;
        },
      },
      {
        id: "infoData",
        label: "Thông tin chi tiết thuốc",
        minWidth: 70,
      },
      {
        id: "actions",
        label: "Hành động",
        minWidth: 70,
        maxWidth: 70,
        align: "center",
      },
    ],
    []
  );

  useEffect(() => {
    if (severity !== "success") return;
    setSelected({ data: null, type: null });
  }, [severity]);

  useEffect(() => {
    dispatch(medicineActions.getStart(filters));
  }, [filters]);

  useEffect(() => {
    dispatch(medicineTypeActions.getStart({ page: 1, limit: 100 }));
    dispatch(unitActions.getStart({ page: 1, limit: 100 }));
  }, []);

  const isEditMode = useMemo(
    () => Boolean(selected.type === "edit" && selected.data),
    [selected.type, selected.data]
  );

  const initialValues = useMemo((): MedicinePayloadAdd => {
    if (isEditMode)
      return {
        id: selected?.data?.id,
        name: selected?.data?.name!,
        medictine_type_id: `${selected?.data?.medictine_type_id!}`,
        unit_id: `${selected?.data?.unit_id!}`,
        quantity: `${selected?.data?.infoData?.quantity!}`,
        price: `${selected?.data?.infoData?.price!}`,
        production_date: moment(new Date(selected?.data?.infoData?.production_date!)).format(
          "YYYY-MM-DD"
        ),
        drug_concentration: `${selected?.data?.infoData?.drug_concentration!}`,
        price_sell: `${selected?.data?.infoData?.price_sell!}`,
        ingredients: selected?.data?.infoData?.ingredients!,
        expired_at: moment(new Date(selected?.data?.infoData?.expired_at!)).format("YYYY-MM-DD"),
      };

    return {
      name: "",
      medictine_type_id: "",
      unit_id: "",
      price: "",
      quantity: "",
      production_date: "",
      drug_concentration: "",
      price_sell: "",
      ingredients: "",
      expired_at: "",
    };
  }, [isEditMode, selected]);

  const texts = useMemo(() => {
    if (isEditMode) return { title: `Cập nhật thuốc`, textBtn: "Lưu thay đổi" };
    return { title: `Thêm thuốc`, textBtn: "Thêm mới" };
  }, [isEditMode]);

  const handleSubmit = useCallback(
    (values: MedicinePayloadAdd, resetForm: () => void) => {
      if (isEditMode) {
        setOpen(false);
        return dispatch(
          medicineActions.addEditStart({ type: "edit", data: values, resetData: resetForm })
        );
      }

      dispatch(medicineActions.addEditStart({ type: "add", data: values, resetData: resetForm }));
      setOpen(false);
    },
    [isEditMode]
  );

  const handleSelected = useCallback((mode: ModeTypes, item: MedicinePayloadAdd) => {
    if (mode === "edit") {
      handleOpenAddMedicine();
    }
    // @ts-ignore
    setSelected({ type: mode, data: item });
  }, []);

  const openDialogRemove = useMemo(
    () => Boolean(selected.type === "delete" && selected.data),
    [selected.type, selected.data]
  );

  const onCloseDialogRemove = useCallback(() => setSelected({ data: null, type: null }), []);

  const textRemove = useMemo(() => {
    if (selected.type !== "delete") return { title: "", contentText: "" };
    return {
      title: "Bạn có muốn xoá thuốc này hay không?",
      contentText: `Tên thuốc: \`${selected.data?.name}\``,
    };
  }, [selected.type, selected.data]);

  const onAgreeRemove = useCallback(() => {
    if (selected.type !== "delete" || !selected.data) return;

    dispatch(medicineActions.deleteStart(`${selected.data.id}`));
  }, [selected.data, selected.type]);

  const handleOnChangePage = useCallback(
    (newPage: number) => {
      dispatch(medicineActions.setFilter({ ...filters, page: newPage }));
    },
    [filters]
  );

  const handleChangeName = useCallback(
    (value: string) => {
      setName(value);
      dispatch(
        medicineActions.setDebounceSearch({
          limit: filters.limit,
          page: filters.page,
          name_like: value,
        })
      );
    },
    [filters]
  );

  const handleChangeNameType = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      const {
        target: { value },
      } = event;

      setNameType(value as string);

      dispatch(
        medicineActions.setDebounceSearch({
          limit: filters.limit,
          page: filters.page,
          ...(+(value as string) !== -1 ? { medictine_type_id: value } : {}),
        })
      );
    },
    [filters]
  );

  const handleOpenAddMedicine = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return {
    columns,
    data,
    loading,
    pagination,
    textRemove,
    openDialogRemove,
    selected,
    texts,
    initialValues,
    name,
    nameType,
    openAddMedicine,
    dataMedicineTypes,
    handleSelected,
    handleChangeName,
    handleOnChangePage,
    onAgreeRemove,
    handleOpenAddMedicine,
    handleClose,
    handleChangeNameType,
    onCloseDialogRemove,
    handleSubmit,
  };
};
