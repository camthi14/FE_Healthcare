import { Button, TableCell, TableRow } from "@mui/material";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "~/components";
import { Colors } from "~/constants";
import { useSnackbar } from "~/features/app";
import { MainLayout, MenuType, ModeTypes } from "~/layouts";
import { IQualification } from "~/models";
import { useAppDispatch } from "~/stores";
import { ColumnTable } from "~/types";
import { qualificationActions, useQualifications } from "~/features/qualification";
import FormAddEditQualification from "./form/FormAddEditQualification";

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
    label: "Chỉnh sửa trình độ",
    color: Colors.blue,
    icon: "ic:baseline-plus",
    mode: "edit",
  },
  {
    divider: false,
    label: "Xoá trình độ",
    color: Colors.red,
    icon: "material-symbols:delete-outline",
    mode: "delete",
  },
];

type Selected = {
  type: "edit" | "delete" | null;
  data: IQualification | null;
};

const QualificationPage: FC = () => {
  const {
    data,
    filters,
    loading,
    pagination,
    errors: { addEdit },
  } = useQualifications();
  const { severity } = useSnackbar();

  const [selected, setSelected] = useState<Selected>({ data: null, type: null });
  const [name, setName] = useState<string>("");

  const dispatch = useAppDispatch();

  const columns = useMemo(
    (): ColumnTable[] => [
      { id: "id", label: "ID", minWidth: 70, align: "center" },
      { id: "name", label: "Tên trình độ", minWidth: 170 },
      { id: "character", label: "Kí tự viết tắt", minWidth: 170 },
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
    dispatch(qualificationActions.getStart(filters));
  }, [filters]);

  const isEditMode = useMemo(
    () => Boolean(selected.type === "edit" && selected.data),
    [selected.type, selected.data]
  );

  const initialValues = useMemo((): IQualification => {
    if (isEditMode) return selected.data!;

    return { character: "", name: "" };
  }, [isEditMode, selected]);

  const texts = useMemo(() => {
    if (isEditMode) return { title: `Cập nhật trình độ`, textBtn: "Lưu thay đổi" };
    return { title: `Thêm trình độ`, textBtn: "Thêm mới" };
  }, [isEditMode]);

  const handleSubmit = useCallback(
    (values: IQualification, resetForm: () => void) => {
      if (isEditMode) {
        return dispatch(
          qualificationActions.addEditStart({ type: "edit", data: values, resetData: resetForm })
        );
      }

      dispatch(
        qualificationActions.addEditStart({ type: "add", data: values, resetData: resetForm })
      );
    },
    [isEditMode]
  );

  const handleSelected = useCallback((mode: ModeTypes, item: IQualification) => {
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
      contentText: `Tên trình độ: \`${selected.data?.name}\``,
    };
  }, [selected.type, selected.data]);

  const onAgreeRemove = useCallback(() => {
    if (selected.type !== "delete" || !selected.data) return;

    dispatch(qualificationActions.deleteStart(`${selected.data.id}`));
  }, [selected.data, selected.type]);

  const handleCloseEditMode = useCallback(() => onCloseDialogRemove(), [onCloseDialogRemove]);

  const handleOnChangePage = useCallback(
    (newPage: number) => {
      dispatch(qualificationActions.setFilter({ ...filters, page: newPage }));
    },
    [filters]
  );

  const handleChangeName = useCallback(
    (value: string) => {
      setName(value);
      dispatch(
        qualificationActions.setDebounceSearch({
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
      <Head title="Danh sách trình độ" />

      <Dialog
        title={textRemove.title}
        contentText={textRemove.contentText}
        open={openDialogRemove}
        onClose={onCloseDialogRemove}
        onAgree={onAgreeRemove}
      />

      <Container maxWidth="xl">
        {/* <Title title="Danh sách trình độ" /> */}

        <Grid container spacing={2}>
          <Grid item xl={4} md={4} xs={12}>
            <Card sx={{ minHeight: 550 }}>
              <CardTitle>{texts.title}</CardTitle>
              <CardTitleError message={addEdit ?? ""} />
              <FormAddEditQualification
                textBtn={texts.textBtn}
                initialValues={initialValues}
                onSubmit={handleSubmit}
              />
            </Card>
          </Grid>

          <Grid item xl={8} md={8} xs={12}>
            <Card sx={{ minHeight: 550 }}>
              <Grid container spacing={2} alignItems={"center"} mb={4}>
                <Grid item xl={5} md={5} xs={12}>
                  <Search
                    value={name}
                    onChangeValue={handleChangeName}
                    width={"100%"}
                    placeholder="Tìm kiếm tên trình độ"
                  />
                </Grid>
                <Grid item xl={7} md={7} xs={12}>
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
                          const value = row[column.id as keyof IQualification];

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

export default QualificationPage;
