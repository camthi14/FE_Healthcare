import { Button, TableCell, TableRow } from "@mui/material";
import { FC } from "react";
import { LazyLoadImage, Search } from "~/components";
import { Colors, Shadows } from "~/constants";
import { MainLayout, MenuType } from "~/layouts";
import { IService } from "~/models";
import DialogFormAddEditService from "./form/DialogFormAddEditService";
import { useManageStateService } from "./helpers/useManageStateService";

const { Card, Container, Relative, Grid, Head, LinearProgress, Table, Title, MenuActions, Dialog } =
  MainLayout;

export const menus: MenuType[] = [
  {
    divider: false,
    label: "Chỉnh sửa gói khám",
    color: Colors.blue,
    icon: "ic:baseline-plus",
    mode: "edit",
  },
  {
    divider: false,
    label: "Xoá gói khám",
    color: Colors.red,
    icon: "material-symbols:delete-outline",
    mode: "delete",
  },
];

const AmenityPage: FC = () => {
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
    openAddService,
    defaultImage,
    handleSelected,
    handleChangeName,
    handleOnChangePage,
    onAgreeRemove,
    handleOpenAddService,
    handleClose,
    onCloseDialogRemove,
    handleSubmit,
  } = useManageStateService();

  return (
    <MainLayout>
      <Head title="Danh sách gói khám" />

      <Dialog
        title={textRemove.title}
        contentText={textRemove.contentText}
        open={openDialogRemove}
        onClose={onCloseDialogRemove}
        onAgree={onAgreeRemove}
      />

      <DialogFormAddEditService
        defaultImage={defaultImage}
        title={texts.title}
        textBtn={texts.textBtn}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        openAdd={openAddService}
        onClose={handleClose}
      />

      <Container maxWidth="xl">
        {/* <Title title="Danh sách gói khám" /> */}

        <Card sx={{ minHeight: 630 }}>
          <Grid container spacing={2} alignItems={"center"} mb={4}>
            <Grid item xl={6} md={6} xs={12}>
              <Search
                value={name}
                onChangeValue={handleChangeName}
                width={"100%"}
                placeholder="Tìm kiếm tên gói khám"
              />
            </Grid>
            <Grid item xl={6} md={6} xs={12}>
              <Button onClick={handleOpenAddService} variant="contained">
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
                data.map((row, index2) => (
                  <TableRow key={index2}>
                    {columns.map((column) => {
                      const value = row[column.id as keyof IService];

                      if (column.id === "photo") {
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
                          {column.format ? column.format(value) : (value as string)}
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

export default AmenityPage;
