import { useCallback, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "~/features/app";
import { serviceActions, useServices } from "~/features/servicePack";
import { serviceTypeActions } from "~/features/serviceType";
import { subclinicalActions } from "~/features/subclinical";
import { ModeTypes } from "~/layouts";
import { IService, ServicePayloadAdd } from "~/models";
import { useAppDispatch } from "~/stores";
import { ColumnTable } from "~/types";
import { fNumber } from "~/utils/formatNumber";

type Selected = {
  type: "edit" | "delete" | null;
  data: IService | null;
};

export const useManageStateService = () => {
  const { severity } = useSnackbar();
  const { data, filters, loading, pagination } = useServices();
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<Selected>({ data: null, type: null });
  const [name, setName] = useState<string>("");
  const [openAddService, setOpen] = useState(false);

  const columns = useMemo(
    (): ColumnTable[] => [
      { id: "id", label: "ID", minWidth: 70, align: "center" },
      { id: "photo", label: "Hình ảnh", minWidth: 60, align: "center" },
      { id: "name", label: "Tên gói khám", minWidth: 170 },
      {
        id: "price",
        label: "Giá gói khám",
        minWidth: 170,
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
    dispatch(serviceActions.getStart(filters));
  }, [filters]);

  useEffect(() => {
    dispatch(serviceTypeActions.getStart({ page: 1, limit: 100 }));
    dispatch(subclinicalActions.getStart({ page: 1, limit: 100 }));
  }, []);

  const isEditMode = useMemo(
    () => Boolean(selected.type === "edit" && selected.data),
    [selected.type, selected.data]
  );

  const initialValues = useMemo((): ServicePayloadAdd => {
    if (isEditMode)
      return {
        id: selected?.data?.id,
        desc: selected?.data?.desc!,
        content: selected?.data?.content!,
        price: `${selected?.data?.price!}`,
        name: selected?.data?.name!,
        photo: selected?.data?.photo!,
        service_type_id: `${selected?.data?.service_type_id!}`,
        subclinical: selected?.data?.subclinicalData?.length
          ? selected?.data?.subclinicalData
          : null,
      };

    return {
      desc: "",
      name: "",
      photo: "",
      service_type_id: "",
      content: "",
      price: "",
      subclinical: null,
    };
  }, [isEditMode, selected]);

  const defaultImage = useMemo(
    () => (selected.type === "edit" ? selected?.data?.photo! : ""),
    [selected]
  );

  const texts = useMemo(() => {
    if (isEditMode) return { title: `Cập nhật gói khám`, textBtn: "Lưu thay đổi" };
    return { title: `Thêm gói khám`, textBtn: "Thêm mới" };
  }, [isEditMode]);

  const handleSubmit = useCallback(
    (values: ServicePayloadAdd, resetForm: () => void) => {
      if (isEditMode) {
        setOpen(false);
        return dispatch(
          serviceActions.addEditStart({ type: "edit", data: values, resetData: resetForm })
        );
      }

      dispatch(serviceActions.addEditStart({ type: "add", data: values, resetData: resetForm }));
      setOpen(false);
    },
    [isEditMode]
  );

  const handleSelected = useCallback((mode: ModeTypes, item: ServicePayloadAdd) => {
    if (mode === "edit") {
      handleOpenAddService();
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
      title: "Bạn có muốn xoá gói khám này hay không?",
      contentText: `Tên gói khám: \`${selected.data?.name}\``,
    };
  }, [selected.type, selected.data]);

  const onAgreeRemove = useCallback(() => {
    if (selected.type !== "delete" || !selected.data) return;

    dispatch(serviceActions.deleteStart(`${selected.data.id}`));
  }, [selected.data, selected.type]);

  const handleOnChangePage = useCallback(
    (newPage: number) => {
      dispatch(serviceActions.setFilter({ ...filters, page: newPage }));
    },
    [filters]
  );

  const handleChangeName = useCallback(
    (value: string) => {
      setName(value);
      dispatch(
        serviceActions.setDebounceSearch({
          limit: filters.limit,
          page: filters.page,
          name_like: value,
        })
      );
    },
    [filters]
  );

  const handleOpenAddService = () => {
    onCloseDialogRemove();
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
    openAddService,
    defaultImage,
    isEditMode,
    handleSelected,
    handleChangeName,
    handleOnChangePage,
    onAgreeRemove,
    handleOpenAddService,
    handleClose,
    onCloseDialogRemove,
    handleSubmit,
  };
};
