import { Box, Button, Checkbox, TableCell, TableRow, Typography } from "@mui/material";
import { FC } from "react";
import { NavLink } from "react-router-dom";
import { Iconify, LazyLoadImage, Search, SelectInput, TableCellOverride } from "~/components";
import DialogDetailUser from "~/components/shared/DialogDetailUser/DialogDetaiUser";
import { Background, Colors, Shadows } from "~/constants";
import { MainLayout, MenuType } from "~/layouts";
import { IDoctorAuth } from "~/models";
import { DashboardPaths } from "~/types";
import { useManageStateDoctorPage } from "./helpers/useManageStateDoctorPage";

const { Card, Container, Grid, Head, LinearProgress, Relative, Table, Title, MenuActions, Dialog } =
  MainLayout;

export const menus: MenuType[] = [
  {
    divider: false,
    label: "Chỉnh sửa bác sĩ",
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
    label: "Xoá bác sĩ",
    color: Colors.red,
    icon: "material-symbols:delete-outline",
    mode: "delete",
  },
];

const DoctorPage: FC = () => {
  const {
    columns,
    data,
    selected,
    selectedCheckbox,
    openDialogProfile,
    openDialogRemove,
    pagination,
    textProfile,
    textRemove,
    loading,
    filters,
    display_name,
    dataOptionSpecialty,
    handleChangeName,
    handleOnChangePage,
    handleSelected,
    onAgreeRemove,
    onCloseDialog,
    handleChangeChecked,
    handleAddHours,
    handleChangeSpecialtyType,
  } = useManageStateDoctorPage();

  return (
    <MainLayout>
      <Head title="Danh sách bác sĩ" />

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
        {/* <Title title="Danh sách bác sĩ" /> */}

        <Card>
          <Grid container spacing={2} alignItems={"center"} mb={4}>
            <Grid item xl={3} md={3} xs={12}>
              <Search
                value={display_name}
                onChangeValue={handleChangeName}
                width={"100%"}
                placeholder="Tìm kiếm bác sĩ"
              />
            </Grid>
            <Grid item xl={3} md={3} xs={12}>
              {dataOptionSpecialty.length ? (
                <SelectInput
                  value={filters?.speciality_id || ""}
                  onChange={handleChangeSpecialtyType}
                  size="small"
                  margin="none"
                  options={[{ label: "Tất cả", value: "-1" }, ...dataOptionSpecialty]}
                  label="Chọn chuyên khoa"
                />
              ) : null}
            </Grid>
            <Grid item xl={6} md={6} xs={12} display={"flex"} flexDirection={"row"}>
              <Button
                component={NavLink}
                to={DashboardPaths.DoctorAdd}
                sx={{ mx: 1 }}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Thêm Bác Sĩ
              </Button>
              <Button
                onClick={handleAddHours}
                sx={{
                  mx: 1,
                  color: Colors.white,
                  background: Background.orange,
                  "&:hover": { background: Background.orange },
                }}
                variant="contained"
                startIcon={<Iconify icon="ph:calendar-duotone" />}
              >
                Thêm lịch khám bệnh
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
                data.map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => {
                      const value = row[column.id as keyof IDoctorAuth];

                      if (column.id === "index") {
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
                            <Checkbox
                              checked={selectedCheckbox?.includes(row?.id!)}
                              name={`${row.id}`}
                              onChange={handleChangeChecked}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </TableCell>
                        );
                      }

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
                                <Typography fontSize={14}> {row?.display_name}</Typography>
                              </Box>
                            </Box>
                          </TableCellOverride>
                        );
                      }
                      if (column.id === "specialty") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            {row?.specialty?.name}
                          </TableCellOverride>
                        );
                      }
                      if (column.id === "checkup_time") {
                        return (
                          <TableCellOverride key={column.id} {...column}>
                            {row?.specialty?.time_chekup_avg}
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

export default DoctorPage;
