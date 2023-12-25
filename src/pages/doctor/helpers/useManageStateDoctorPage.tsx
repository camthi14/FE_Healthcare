import { Checkbox, SelectChangeEvent } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appActions, useSnackbar } from "~/features/app";
import { doctorActions, useDoctors } from "~/features/doctor";
import { specialtyActions, useOptionSpecialty } from "~/features/specialty";
import { ModeTypes } from "~/layouts";
import { IDoctorAuth } from "~/models";
import { useAppDispatch } from "~/stores";
import { ColumnTable, DashboardPaths } from "~/types";

export type Selected = {
  type: "edit" | "delete" | "info" | null;
  data: IDoctorAuth | null;
};

export const useManageStateDoctorPage = () => {
  const { data, filters, loading, pagination } = useDoctors();
  const { severity } = useSnackbar();
  const dispatch = useAppDispatch();
  const navigation = useNavigate();

  const [display_name, setDisplayName] = useState<string>("");
  const [selected, setSelected] = useState<Selected>({ data: null, type: null });
  const [selectedCheckbox, setSelectedCheckbox] = useState<string[]>([]);
  const dataOptionSpecialty = useOptionSpecialty();

  const handleChangeChecked = useCallback(
    ({ target: { name: doctorId } }: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (doctorId.toLowerCase() === "all") {
        if (!data.length) return;

        if (checked) {
          setSelectedCheckbox(data.map((d) => d.id!));
        } else {
          setSelectedCheckbox([]);
        }
        return;
      }

      let _selectedCheckbox = [...selectedCheckbox];

      if (!_selectedCheckbox.length) {
        _selectedCheckbox.push(doctorId);
        setSelectedCheckbox(_selectedCheckbox);
        return;
      }

      // TODO: IF checked = true
      if (checked) {
        _selectedCheckbox.push(doctorId);
      } else {
        _selectedCheckbox = _selectedCheckbox.filter((s) => s !== doctorId);
      }

      setSelectedCheckbox(_selectedCheckbox);
    },
    [selectedCheckbox, data]
  );

  const checkedTop = useMemo(
    () => data?.length === selectedCheckbox?.length,
    [selectedCheckbox, data]
  );

  const columns = useMemo(
    (): ColumnTable[] => [
      {
        id: "index",
        label: <Checkbox checked={checkedTop} name={`all`} onChange={handleChangeChecked} />,
        minWidth: 40,
        maxWidth: 40,
        align: "center",
        styles: { padding: 0 },
      },
      { id: "id", label: "Mã bác sĩ", minWidth: 70 },
      { id: "display_name", label: "Tên bác sĩ", minWidth: 70 },
      { id: "specialty", label: "Chuyên khoa", minWidth: 70, align: "center" },
      {
        id: "checkup_time",
        label: "Thời gian khám / ca",
        minWidth: 70,
        maxWidth: 100,
        align: "center",
      },
      { id: "department", label: "Bộ phận", minWidth: 70, align: "center" },
      { id: "position", label: "Chức vụ ", minWidth: 70, maxWidth: 120, align: "center" },
      {
        id: "actions",
        label: "Hành động",
        minWidth: 70,
        maxWidth: 70,
        align: "center",
      },
    ],
    [checkedTop]
  );

  useEffect(() => {
    let mounted = false;

    const lastFilter = { ...filters };

    if (!mounted) {
      if (lastFilter?.speciality_id && Number(filters?.speciality_id) === -1) {
        delete lastFilter.speciality_id;
      }

      dispatch(doctorActions.getStart(lastFilter));
    }

    return () => {
      mounted = true;
    };
  }, [filters]);

  useEffect(() => {
    dispatch(specialtyActions.getStart({ limit: 100, page: 1 }));
  }, []);

  useEffect(() => {
    if (severity !== "success") return;
    setSelected({ data: null, type: null });
  }, [severity]);

  const handleSelected = useCallback((mode: ModeTypes, item: IDoctorAuth) => {
    if (mode === "edit") {
      navigation(DashboardPaths.DoctorEdit + `/${item.id!}`, { replace: true });
      return;
    }

    // @ts-ignore
    setSelected({ type: mode, data: item });
  }, []);

  const openDialogProfile = useMemo(
    () => Boolean(selected.type === "info" && selected.data),
    [selected.type, selected.data]
  );

  const textProfile = useMemo(() => {
    if (selected.type !== "info") return { title: "" };
    return {
      title: "Thông tin bác sĩ",
    };
  }, [selected.type, selected.data]);

  const openDialogRemove = useMemo(
    () => Boolean(selected.type === "delete" && selected.data),
    [selected.type, selected.data]
  );

  const onCloseDialog = useCallback(() => setSelected({ data: null, type: null }), []);

  const textRemove = useMemo(() => {
    if (selected.type !== "delete") return { title: "", contentText: "" };
    return {
      title: "Bạn có muốn xoá bác sĩ này hay không?",
      contentText: `bác sĩ: \`${selected.data?.display_name}\``,
    };
  }, [selected.type, selected.data]);

  const onAgreeRemove = useCallback(() => {
    if (selected.type !== "delete" || !selected.data) return;

    dispatch(doctorActions.deleteStart(`${selected.data.id}`));
  }, [selected.data, selected.type]);

  const handleOnChangePage = useCallback(
    (newPage: number) => {
      dispatch(doctorActions.setFilter({ ...filters, page: newPage }));
      setSelectedCheckbox([]);
    },
    [filters]
  );

  const handleChangeName = useCallback(
    (value: string) => {
      setDisplayName(value);
      dispatch(
        doctorActions.setDebounceSearch({
          limit: filters.limit,
          page: filters.page,
          display_name_like: value,
        })
      );
    },
    [filters]
  );

  const handleAddHours = useCallback(() => {
    if (!selectedCheckbox.length) {
      dispatch(
        appActions.setSnackbar({
          open: true,
          severity: "error",
          text: "Vui lòng check chọn bác sĩ",
        })
      );
      return;
    }

    const length = selectedCheckbox.length;

    const doctorIDParams = selectedCheckbox.reduce(
      (r, v, index) => (r += `${v}${index === length - 1 ? "" : ","}`),
      ""
    );

    const params = `?mode=multiple&doctorIds=${doctorIDParams}`;

    navigation(DashboardPaths.DoctorScheduleAdd + params, { replace: true });
  }, [selectedCheckbox]);

  const handleChangeSpecialtyType = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      const {
        target: { value },
      } = event;

      let lastFilter = { ...filters };

      lastFilter = {
        ...lastFilter,
        speciality_id: value,
      };

      dispatch(
        doctorActions.setDebounceSearch({
          ...lastFilter,
        })
      );
    },
    [filters]
  );

  return {
    columns,
    data,
    loading,
    pagination,
    display_name,
    textRemove,
    openDialogRemove,
    textProfile,
    openDialogProfile,
    filters,
    selected,
    selectedCheckbox,
    dataOptionSpecialty,
    handleSelected,
    handleChangeName,
    handleOnChangePage,
    onAgreeRemove,
    onCloseDialog,
    handleChangeChecked,
    handleAddHours,
    handleChangeSpecialtyType,
  };
};
