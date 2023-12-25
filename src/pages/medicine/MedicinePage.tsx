import { Button, TableCell, TableRow, Typography } from "@mui/material";
import moment from "moment";
import { FC } from "react";
import { Search, SelectInput } from "~/components";
import { Colors } from "~/constants";
import { MainLayout, MenuType } from "~/layouts";
import { IMedicineData } from "~/models";
import DialogFormAddEditMedicine from "./form/DialogFormAddEditMedicine";
import { useManageStateMedicine } from "./helpers/useManageStateMedicine";
import { fNumber } from "~/utils/formatNumber";

const { Card, Container, Relative, Grid, Head, LinearProgress, Table, Title, MenuActions, Dialog } =
  MainLayout;

export const menus: MenuType[] = [
  {
    divider: false,
    label: "Chỉnh sửa thuốc",
    color: Colors.blue,
    icon: "ic:baseline-plus",
    mode: "edit",
  },
  {
    divider: false,
    label: "Xoá thuốc",
    color: Colors.red,
    icon: "material-symbols:delete-outline",
    mode: "delete",
  },
];

const MedicinePage: FC = () => {
  const {
    columns,
    data,
    loading,
    pagination,
    textRemove,
    openDialogRemove,
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
  } = useManageStateMedicine();

  return (
    <MainLayout>
      <Head title="Danh sách thuốc" />

      <Dialog
        title={textRemove.title}
        contentText={textRemove.contentText}
        open={openDialogRemove}
        onClose={onCloseDialogRemove}
        onAgree={onAgreeRemove}
      />

      <DialogFormAddEditMedicine
        title={texts.title}
        textBtn={texts.textBtn}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        openAdd={openAddMedicine}
        onClose={handleClose}
        loading={loading}
      />

      <Container maxWidth="xl">
        {/* <Title title="Danh sách thuốc" /> */}

        <Card sx={{ minHeight: 630 }}>
          <Grid container spacing={2} alignItems={"center"} mb={4}>
            <Grid item xl={4} md={4} xs={12}>
              <Search
                value={name}
                onChangeValue={handleChangeName}
                width={"100%"}
                placeholder="Tìm kiếm tên thuốc"
              />
            </Grid>
            <Grid item xl={4} md={4} xs={12}>
              {dataMedicineTypes.length ? (
                <SelectInput
                  value={nameType}
                  onChange={handleChangeNameType}
                  size="small"
                  options={[{ label: "Tất cả", value: "-1" }, ...dataMedicineTypes]}
                  label="Tìm kiếm theo loại thuốc"
                  placeholder="Chọn loại thuốc"
                />
              ) : null}
            </Grid>
            <Grid item xl={4} md={4} xs={12}>
              <Button onClick={handleOpenAddMedicine} variant="contained">
                Thêm mới
              </Button>
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
                data.map((row, index1) => (
                  <TableRow key={index1}>
                    {columns.map((column) => {
                      const value = row[column.id as keyof IMedicineData];

                      if (column.id === "infoData") {
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
                            <Typography>Thành phần thuốc: {row.infoData.ingredients}</Typography>
                            {/* <Typography>Số lượng: {row.infoData.quantity}</Typography> */}
                            <Typography>Giá nhập: {fNumber(row.infoData.price)}VND/Viên</Typography>
                            <Typography>
                              Giá bán: {fNumber(row.infoData.price_sell)}VND/Viên
                            </Typography>
                            <Typography>
                              Ngày sản xuất:{" "}
                              {moment(new Date(row.infoData.production_date)).format("DD-MM-YYYY")}
                            </Typography>
                            <Typography>
                              Hạn sử dụng:{" "}
                              {moment(new Date(row.infoData.expired_at)).format("DD-MM-YYYY")}
                            </Typography>
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
                          {column.format ? column.format(value as string) : (value as string)}
                        </TableCell>
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

export default MedicinePage;
