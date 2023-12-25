import { Button, TableCell, TableRow } from "@mui/material";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "~/components";
import { Colors } from "~/constants";
import { useSnackbar } from "~/features/app";
import { MainLayout, MenuType, ModeTypes } from "~/layouts";
import { IServiceType } from "~/models";
import { useAppDispatch } from "~/stores";
import { ColumnTable } from "~/types";
import FormAddEditServiceType from "./form/FormAddEditServiceType";
import { serviceTypeActions, useServiceTypes } from "~/features/serviceType";

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
    label: "Chỉnh sửa loại gói khám",
    color: Colors.blue,
    icon: "ic:baseline-plus",
    mode: "edit",
  },
  {
    divider: false,
    label: "Xoá loại gói khám",
    color: Colors.red,
    icon: "material-symbols:delete-outline",
    mode: "delete",
  },
];

type Selected = {
  type: "edit" | "delete" | null;
  data: IServiceType | null;
};

const ServiceTypePage: FC = () => {
  const {
    data,
    filters,
    loading,
    pagination,
    errors: { addEdit },
  } = useServiceTypes();
  const { severity } = useSnackbar();

  const [selected, setSelected] = useState<Selected>({ data: null, type: null });
  const [name, setName] = useState<string>("");

  const dispatch = useAppDispatch();

  const columns = useMemo(
    (): ColumnTable[] => [
      { id: "id", label: "ID", minWidth: 70, align: "center" },
      { id: "name", label: "Tên loại gói khám", minWidth: 170 },
      { id: "desc", label: "Mô tả", minWidth: 170 },
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
    dispatch(serviceTypeActions.getStart(filters));
  }, [filters]);

  const isEditMode = useMemo(
    () => Boolean(selected.type === "edit" && selected.data),
    [selected.type, selected.data]
  );

  const initialValues = useMemo((): IServiceType => {
    if (isEditMode) return selected.data!;

    return { desc: "", name: "" };
  }, [isEditMode, selected]);

  const texts = useMemo(() => {
    if (isEditMode) return { title: `Cập nhật loại gói khám`, textBtn: "Lưu thay đổi" };
    return { title: `Thêm loại gói khám`, textBtn: "Thêm mới" };
  }, [isEditMode]);

  const handleSubmit = useCallback(
    (values: IServiceType, resetForm: () => void) => {
      if (isEditMode) {
        return dispatch(
          serviceTypeActions.addEditStart({ type: "edit", data: values, resetData: resetForm })
        );
      }

      dispatch(
        serviceTypeActions.addEditStart({ type: "add", data: values, resetData: resetForm })
      );
    },
    [isEditMode]
  );

  const handleSelected = useCallback((mode: ModeTypes, item: IServiceType) => {
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
      title: "Bạn có muốn xoá hay không?",
      contentText: `Tên loại gói khám: \`${selected.data?.name}\``,
    };
  }, [selected.type, selected.data]);

  const onAgreeRemove = useCallback(() => {
    if (selected.type !== "delete" || !selected.data) return;

    dispatch(serviceTypeActions.deleteStart(`${selected.data.id}`));
  }, [selected.data, selected.type]);

  const handleCloseEditMode = useCallback(() => onCloseDialogRemove(), [onCloseDialogRemove]);

  const handleOnChangePage = useCallback(
    (newPage: number) => {
      dispatch(serviceTypeActions.setFilter({ ...filters, page: newPage }));
    },
    [filters]
  );

  const handleChangeName = useCallback(
    (value: string) => {
      setName(value);
      dispatch(
        serviceTypeActions.setDebounceSearch({
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
      <Head title="Danh sách loại gói khám" />

      <Dialog
        title={textRemove.title}
        contentText={textRemove.contentText}
        open={openDialogRemove}
        onClose={onCloseDialogRemove}
        onAgree={onAgreeRemove}
      />

      <Container maxWidth="xl">
        {/* <Title title="Danh sách loại gói khám" /> */}

        <Grid container spacing={2}>
          <Grid item xl={4} md={4} xs={12}>
            <Card sx={{ minHeight: 625 }}>
              <CardTitle>{texts.title}</CardTitle>
              <CardTitleError message={addEdit ?? ""} />
              <FormAddEditServiceType
                textBtn={texts.textBtn}
                initialValues={initialValues}
                onSubmit={handleSubmit}
              />
            </Card>
          </Grid>

          <Grid item xl={8} md={8} xs={12}>
            <Card sx={{ minHeight: 625 }}>
              <Grid container spacing={2} alignItems={"center"} mb={4}>
                <Grid item xl={7} md={7} xs={12}>
                  <Search
                    value={name}
                    onChangeValue={handleChangeName}
                    width={"100%"}
                    placeholder="Tìm kiếm tên loại gói khám"
                  />
                </Grid>
                <Grid item xl={5} md={5} xs={12}>
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
                          const value = row[column.id as keyof IServiceType];

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

export default ServiceTypePage;
