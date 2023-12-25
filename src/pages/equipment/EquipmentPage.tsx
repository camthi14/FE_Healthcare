import { Button, TableCell, TableRow } from "@mui/material";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { LazyLoadImage, Search } from "~/components";
import { Colors, Shadows } from "~/constants";
import { useSnackbar } from "~/features/app";
import { equipmentActions, useEquipments } from "~/features/equipment";
import { MainLayout, MenuType, ModeTypes } from "~/layouts";
import { IEquipment } from "~/models";
import { useAppDispatch } from "~/stores";
import { ColumnTable } from "~/types";
import FormAddEditEquipment from "./form/FormAddEditEquipment";
import { equipmentTypeActions } from "~/features/equipmentType";

const {
  Card,
  Container,
  CardTitleError,
  Relative,
  CardTitle,
  Grid,
  Head,
  LinearProgress,
  Table,
  Title,
  MenuActions,
  Dialog,
} = MainLayout;

export const menus: MenuType[] = [
  {
    divider: false,
    label: "Chỉnh sửa thiết bị y tế",
    color: Colors.blue,
    icon: "ic:baseline-plus",
    mode: "edit",
  },
  {
    divider: false,
    label: "Xoá thiết bị y tế",
    color: Colors.red,
    icon: "material-symbols:delete-outline",
    mode: "delete",
  },
];

type Selected = {
  type: "edit" | "delete" | null;
  data: IEquipment | null;
};

const AmenityPage: FC = () => {
  const {
    data,
    filters,
    loading,
    pagination,
    errors: { addEdit },
  } = useEquipments();
  const { severity } = useSnackbar();

  const [selected, setSelected] = useState<Selected>({ data: null, type: null });
  const [name, setName] = useState<string>("");

  const dispatch = useAppDispatch();

  const columns = useMemo(
    (): ColumnTable[] => [
      { id: "id", label: "ID", minWidth: 70, align: "center" },
      { id: "photo", label: "Hình ảnh", minWidth: 60, align: "center" },
      { id: "name", label: "Tên thiết bị y tế", minWidth: 170 },
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
    dispatch(equipmentActions.getStart(filters));
  }, [filters]);

  useEffect(() => {
    dispatch(equipmentTypeActions.getStart({ limit: 100, page: 1 }));
  }, []);

  const isEditMode = useMemo(
    () => Boolean(selected.type === "edit" && selected.data),
    [selected.type, selected.data]
  );

  const initialValues = useMemo((): IEquipment => {
    if (isEditMode)
      return {
        id: selected?.data?.id,
        desc: selected?.data?.desc!,
        name: selected?.data?.name!,
        photo: selected?.data?.photo!,
        equipment_type_id: selected?.data?.equipment_type_id!,
      };

    return { desc: "", name: "", photo: "", equipment_type_id: "" };
  }, [isEditMode, selected]);

  const defaultImage = useMemo(
    () => (selected.type === "edit" ? selected?.data?.photo! : ""),
    [selected]
  );

  const texts = useMemo(() => {
    if (isEditMode) return { title: `Cập nhật thiết bị y tế`, textBtn: "Lưu thay đổi" };
    return { title: `Thêm thiết bị y tế`, textBtn: "Thêm mới" };
  }, [isEditMode]);

  const handleSubmit = useCallback(
    (values: IEquipment, resetForm: () => void) => {
      if (isEditMode) {
        return dispatch(
          equipmentActions.addEditStart({ type: "edit", data: values, resetData: resetForm })
        );
      }

      dispatch(equipmentActions.addEditStart({ type: "add", data: values, resetData: resetForm }));
    },
    [isEditMode]
  );

  const handleSelected = useCallback((mode: ModeTypes, item: IEquipment) => {
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
      title: "Bạn có muốn xoá thiết bị y tế này hay không?",
      contentText: `Tên thiết bị y tế: \`${selected.data?.name}\``,
    };
  }, [selected.type, selected.data]);

  const onAgreeRemove = useCallback(() => {
    if (selected.type !== "delete" || !selected.data) return;

    dispatch(equipmentActions.deleteStart(`${selected.data.id}`));
  }, [selected.data, selected.type]);

  const handleCloseEditMode = useCallback(() => onCloseDialogRemove(), [onCloseDialogRemove]);

  const handleOnChangePage = useCallback(
    (newPage: number) => {
      dispatch(equipmentActions.setFilter({ ...filters, page: newPage }));
    },
    [filters]
  );

  const handleChangeName = useCallback(
    (value: string) => {
      setName(value);
      dispatch(
        equipmentActions.setDebounceSearch({
          limit: filters.limit,
          page: filters.page,
          name_like: value,
        })
      );
    },
    [filters]
  );

  return (
    <MainLayout>
      <Head title="Danh sách thiết bị y tế" />

      <Dialog
        title={textRemove.title}
        contentText={textRemove.contentText}
        open={openDialogRemove}
        onClose={onCloseDialogRemove}
        onAgree={onAgreeRemove}
      />

      <Container maxWidth="xl">
        {/* <Title mb={2} title="Danh sách thiết bị y tế" /> */}

        <Grid container spacing={2}>
          <Grid item xl={4} md={4} xs={12}>
            <Card sx={{ minHeight: 630 }}>
              <CardTitle>{texts.title}</CardTitle>
              <CardTitleError message={addEdit ?? ""} />
              <FormAddEditEquipment
                defaultImage={defaultImage}
                textBtn={texts.textBtn}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isEditMode={isEditMode}
              />
            </Card>
          </Grid>

          <Grid item xl={8} md={8} xs={12}>
            <Card sx={{ minHeight: 630 }}>
              <Grid container spacing={2} alignItems={"center"} mb={4}>
                <Grid item xl={6} md={6} xs={12}>
                  <Search
                    value={name}
                    onChangeValue={handleChangeName}
                    width={"100%"}
                    placeholder="Tìm kiếm tên thiết bị y tế"
                  />
                </Grid>
                <Grid item xl={6} md={6} xs={12}>
                  {isEditMode ? (
                    <Button onClick={handleCloseEditMode} variant="contained">
                      Thêm mới
                    </Button>
                  ) : null}
                </Grid>
              </Grid>

              <Relative>
                <LinearProgress loading={Boolean(loading === "pending")} isOnTable />

                <Table
                  totalPage={pagination.totalPage}
                  onChangePage={handleOnChangePage}
                  columns={columns}
                  sxTableContainer={{ minHeight: 418 }}
                >
                  {!data.length ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} component={"th"} scope="row">
                        Chưa có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row, i) => (
                      <TableRow key={i}>
                        {columns.map((column) => {
                          const value = row[column.id as keyof IEquipment];

                          if (column.id === "photo") {
                            return (
                              <TableCell
                                style={{
                                  minWidth: column.minWidth,
                                  maxWidth: column.maxWidth,
                                  ...column.styles,
                                }}
                                component={"th"}
                                scope="row"
                                align={column.align}
                              >
                                {row.photo ? (
                                  <LazyLoadImage
                                    src={row.photo}
                                    sxBox={{
                                      width: 60,
                                      height: 60,
                                      borderRadius: 50,
                                      boxShadow: Shadows.boxShadow2,
                                      margin: "auto",
                                    }}
                                    sxImage={{
                                      width: 60,
                                      height: 60,
                                      borderRadius: 50,
                                    }}
                                  />
                                ) : (
                                  <div> </div>
                                )}
                              </TableCell>
                            );
                          }

                          if (column.id === "actions") {
                            return (
                              <TableCell
                                key={column.id}
                                style={{
                                  minWidth: column.minWidth,
                                  maxWidth: column.maxWidth,
                                  ...column.styles,
                                }}
                                component={"th"}
                                scope="row"
                                align={column.align}
                              >
                                <MenuActions item={row} menus={menus} onClick={handleSelected} />
                              </TableCell>
                            );
                          }

                          return (
                            <TableCell
                              key={column.id}
                              style={{
                                minWidth: column.minWidth,
                                maxWidth: column.maxWidth,
                                ...column.styles,
                              }}
                              component={"th"}
                              scope="row"
                              align={column.align}
                            >
                              {value as string}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  )}
                </Table>
              </Relative>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default AmenityPage;
