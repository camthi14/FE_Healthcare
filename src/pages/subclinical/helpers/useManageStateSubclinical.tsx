import { useCallback, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "~/features/app";
import { roomActions } from "~/features/room";
import { subclinicalActions, useSubclinicals } from "~/features/subclinical";
import { subclinicalTypeActions } from "~/features/subclinicalType";
import { ModeTypes } from "~/layouts";
import { ISubclinical, SubclinicalPayloadAdd } from "~/models";
import { useAppDispatch } from "~/stores";
import { ColumnTable } from "~/types";
import { fNumber } from "~/utils/formatNumber";

type Selected = {
  type: "edit" | "delete" | null;
  data: ISubclinical | null;
};

export const useManageStateSubclinical = () => {
  const { data, filters, loading, pagination } = useSubclinicals();
  const { severity } = useSnackbar();
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<Selected>({ data: null, type: null });
  const [name, setName] = useState<string>("");
  const [openAddSubclinical, setOpen] = useState(false);

  const columns = useMemo(
    (): ColumnTable[] => [
      { id: "id", label: "ID", minWidth: 70, align: "center" },
      { id: "name", label: "Tên mẫu cận lâm sàng", minWidth: 170 },
      {
        id: "room",
        label: "Phòng thực hiện",
        minWidth: 170,
      },
      {
        id: "price",
        label: "Giá cận lâm sàng",
        minWidth: 70,
        format(value) {
          return fNumber(value);
        },
      },
      { id: "content", label: "Nội dung khám", minWidth: 200 },
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
    dispatch(subclinicalActions.getStart(filters));
  }, [filters]);

  useEffect(() => {
    dispatch(subclinicalTypeActions.getStart({ page: 1, limit: 100 }));
    dispatch(roomActions.getStart({ page: 1, limit: 100 }));
  }, []);

  const isEditMode = useMemo(
    () => Boolean(selected.type === "edit" && selected.data),
    [selected.type, selected.data]
  );

  const initialValues = useMemo((): SubclinicalPayloadAdd => {
    if (isEditMode)
      return {
        id: selected?.data?.id,
        desc: selected?.data?.desc!,
        content: selected?.data?.content!,
        price: `${selected?.data?.price!}`,
        name: selected?.data?.name!,
        subclinical_type_id: `${selected?.data?.subclinical_type_id!}`,
        room_id: `${selected?.data?.room_id!}`,
      };

    return { desc: "", name: "", room_id: "", subclinical_type_id: "", content: "", price: "" };
  }, [isEditMode, selected]);

  const texts = useMemo(() => {
    if (isEditMode) return { title: `Cập nhật mẫu cận lâm sàng`, textBtn: "Lưu thay đổi" };
    return { title: `Thêm mẫu cận lâm sàng`, textBtn: "Thêm mới" };
  }, [isEditMode]);

  const handleSubmit = useCallback(
    (values: SubclinicalPayloadAdd, resetForm: () => void) => {
      if (isEditMode) {
        setOpen(false);
        return dispatch(
          subclinicalActions.addEditStart({ type: "edit", data: values, resetData: resetForm })
        );
      }

      dispatch(
        subclinicalActions.addEditStart({ type: "add", data: values, resetData: resetForm })
      );
      setOpen(false);
    },
    [isEditMode]
  );

  const handleSelected = useCallback((mode: ModeTypes, item: SubclinicalPayloadAdd) => {
    if (mode === "edit") {
      handleOpenAddSubclinical();
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
      title: "Bạn có muốn xoá mẫu cận lâm sàng này hay không?",
      contentText: `Tên cận lâm sàng: \`${selected.data?.name}\``,
    };
  }, [selected.type, selected.data]);

  const onAgreeRemove = useCallback(() => {
    if (selected.type !== "delete" || !selected.data) return;

    dispatch(subclinicalActions.deleteStart(`${selected.data.id}`));
  }, [selected.data, selected.type]);

  const handleOnChangePage = useCallback(
    (newPage: number) => {
      dispatch(subclinicalActions.setFilter({ ...filters, page: newPage }));
    },
    [filters]
  );

  const handleChangeName = useCallback(
    (value: string) => {
      setName(value);
      dispatch(
        subclinicalActions.setDebounceSearch({
          limit: filters.limit,
          page: filters.page,
          name_like: value,
        })
      );
    },
    [filters]
  );

  const handleOpenAddSubclinical = () => {
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
    texts,
    initialValues,
    name,
    openAddSubclinical,
    isEditMode,
    handleSelected,
    handleChangeName,
    handleOnChangePage,
    onAgreeRemove,
    handleOpenAddSubclinical,
    handleClose,
    onCloseDialogRemove,
    handleSubmit,
  };
};
