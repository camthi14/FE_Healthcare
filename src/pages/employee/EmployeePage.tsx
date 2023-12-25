import { Box, Button, TableCell, TableRow, Typography } from "@mui/material";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Iconify, LazyLoadImage, Search, TableCellOverride } from "~/components";
import DialogDetailUser from "~/components/shared/DialogDetailUser/DialogDetaiUser";
import { Colors, Shadows } from "~/constants";
import { useSnackbar } from "~/features/app";
import { employeeActions, useEmployees } from "~/features/employee";
import { MainLayout, MenuType, ModeTypes } from "~/layouts";
import { IEmployeeAuth } from "~/models";
import { useAppDispatch } from "~/stores";
import { ColumnTable, DashboardPaths } from "~/types";

const { Card, Container, Grid, Head, LinearProgress, Relative, Table, Title, MenuActions, Dialog } =
  MainLayout;

export const menus: MenuType[] = [
  {
    divider: false,
    label: "Chỉnh sửa người dùng",
    color: Colors.blue,
    icon: "ic:baseline-plus",
    mode: "edit",
  },
  {
    divider: false,
    label: "Thông tin chi tiết",
    color: Colors.yellow,
    icon: "mdi:user",
    mode: "info",
  },
  {
    divider: false,
    label: "Xoá người dùng",
    color: Colors.red,
    icon: "material-symbols:delete-outline",
    mode: "delete",
  },
];

type Selected = {
  type: "edit" | "delete" | "info" | null;
  data: IEmployeeAuth | null;
};

const EmployeePage: FC = () => {
  const {
    data,
    filters,
    loading,
    pagination,
    errors: { addEdit },
  } = useEmployees();
  const dispatch = useAppDispatch();
  const { severity } = useSnackbar();
  const navigation = useNavigate();
  const [display_name, setDisplayName] = useState<string>("");
  const [selected, setSelected] = useState<Selected>({ data: null, type: null });

  const columns = useMemo(
    (): ColumnTable[] => [
      { id: "id", label: "Mã nhân viên", minWidth: 70 },
      { id: "display_name", label: "Thông tin nhân viên", minWidth: 170 },
      { id: "department", label: "Bộ phận", minWidth: 70 },
      { id: "position", label: "Chức vụ ", minWidth: 70, maxWidth: 120 },
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
    dispatch(employeeActions.getStart(filters));
  }, [filters]);

  const handleSelected = useCallback((mode: ModeTypes, item: IEmployeeAuth) => {
    if (mode === "edit") {
      navigation(DashboardPaths.EmployeeEdit + `/${item.id!}`, { replace: true });
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
      title: "Thông tin nhân viên",
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
      title: "Bạn có muốn xoá nhân viên này hay không?",
      contentText: `Nhân viên: \`${selected.data?.display_name}\``,
    };
  }, [selected.type, selected.data]);

  const onAgreeRemove = useCallback(() => {
    if (selected.type !== "delete" || !selected.data) return;

    dispatch(employeeActions.deleteStart(`${selected.data.id}`));
  }, [selected.data, selected.type]);

  const handleOnChangePage = useCallback(
    (newPage: number) => {
      dispatch(employeeActions.setFilter({ ...filters, page: newPage }));
    },
    [filters]
  );

  const handleChangeName = useCallback(
    (value: string) => {
      console.log(value);

      setDisplayName(value);
      dispatch(
        employeeActions.setDebounceSearch({
          limit: filters.limit,
          page: filters.page,
          display_name_like: value,
        })
      );
    },
    [filters]
  );

  return (
    <MainLayout>
      <Head title="Danh sách nhân viên" />

      <Dialog
        title={textRemove.title}
        contentText={textRemove.contentText}
        open={openDialogRemove}
        onClose={onCloseDialog}
        onAgree={onAgreeRemove}
      />

      <DialogDetailUser
        title={textProfile.title}
        openDialog={openDialogProfile}
        handleCloseDialog={onCloseDialog}
        values={selected.data!}
      />

      <Container maxWidth="xl">
        {/* <Title title="Danh sách nhân viên" /> */}

        <Card>
          <Grid container spacing={2} alignItems={"center"} mb={4}>
            <Grid item xl={4} md={4} xs={12}>
              <Search
                value={display_name}
                onChangeValue={handleChangeName}
                width={"100%"}
                placeholder="Tìm kiếm nhân viên"
              />
            </Grid>
            <Grid item xl={4} md={4} xs={12}>
              <Button
                component={Link}
                to={DashboardPaths.EmployeeAdd}
                sx={{ mx: 1 }}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Thêm mới
              </Button>
            </Grid>
          </Grid>
          <Relative>
            <LinearProgress isOnTable loading={Boolean(loading === "pending")} />
            <Table
              totalPage={pagination.totalPage}
              onChangePage={handleOnChangePage}
              columns={columns}
              sxTableContainer={{ minHeight: 440 }}
            >
              {!data.length ? (
                <TableRow>
                  <TableCell colSpan={columns.length} component={"th"} scope="row">
                    Chưa có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id as keyof IEmployeeAuth];

                      if (column.id === "display_name") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            <Box
                              sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}
                            >
                              {row.photo ? (
                                <LazyLoadImage
                                  src={row.photo}
                                  sxBox={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 50,
                                    boxShadow: Shadows.boxShadow2,
                                    mr: 2,
                                  }}
                                  sxImage={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 50,
                                  }}
                                />
                              ) : (
                                <div> </div>
                              )}
                              <Box>
                                <Typography fontSize={14}>Họ Tên: {row?.display_name}</Typography>
                                <Typography fontSize={14}>Email: {row?.email}</Typography>
                                <Typography fontSize={14}>SĐT: {row?.phone_number}</Typography>
                              </Box>
                            </Box>
                          </TableCellOverride>
                        );
                      }
                      if (column.id === "department") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            {row?.operation?.department?.name}
                          </TableCellOverride>
                        );
                      }
                      if (column.id === "position") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            {row?.operation?.position?.name}
                          </TableCellOverride>
                        );
                      }
                      if (column.id === "actions") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            <MenuActions item={row} menus={menus} onClick={handleSelected} />
                          </TableCellOverride>
                        );
                      }

                      return (
                        <TableCellOverride key={column.id} {...column}>
                          {column.format ? column.format(value as string) : (value as string)}
                        </TableCellOverride>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </Table>
          </Relative>
        </Card>
      </Container>
    </MainLayout>
  );
};

export default EmployeePage;
