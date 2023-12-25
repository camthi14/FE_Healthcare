import { Button, TableCell, TableRow, Typography } from "@mui/material";
import { FC } from "react";
import { Search } from "~/components";
import { Colors } from "~/constants";
import { MainLayout, MenuType } from "~/layouts";
import { ISubclinical } from "~/models";
import DialogFormAddEditSubclinical from "./form/DialogFormAddEditSubclinical";
import { useManageStateSubclinical } from "./helpers/useManageStateSubclinical";

const { Card, Container, Relative, Grid, Head, LinearProgress, Table, Title, MenuActions, Dialog } =
  MainLayout;

export const menus: MenuType[] = [
  {
    divider: false,
    label: "Chỉnh sửa mẫu cận lâm sàng",
    color: Colors.blue,
    icon: "ic:baseline-plus",
    mode: "edit",
  },
  {
    divider: false,
    label: "Xoá mẫu cận lâm sàng",
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
    openAddSubclinical,
    handleSelected,
    handleChangeName,
    handleOnChangePage,
    onAgreeRemove,
    handleOpenAddSubclinical,
    handleClose,
    onCloseDialogRemove,
    handleSubmit,
  } = useManageStateSubclinical();

  return (
    <MainLayout>
      <Head title="Danh sách mẫu cận lâm sàng" />

      <Dialog
        title={textRemove.title}
        contentText={textRemove.contentText}
        open={openDialogRemove}
        onClose={onCloseDialogRemove}
        onAgree={onAgreeRemove}
      />

      <DialogFormAddEditSubclinical
        title={texts.title}
        textBtn={texts.textBtn}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        openAdd={openAddSubclinical}
        onClose={handleClose}
      />

      <Container maxWidth="xl">
        {/* <Title title="Danh sách mẫu cận lâm sàng" /> */}

        <Card sx={{ minHeight: 630 }}>
          <Grid container spacing={2} alignItems={"center"} mb={4}>
            <Grid item xl={6} md={6} xs={12}>
              <Search
                value={name}
                onChangeValue={handleChangeName}
                width={"100%"}
                placeholder="Tìm kiếm tên mẫu cận lâm sàng"
              />
            </Grid>
            <Grid item xl={6} md={6} xs={12}>
              <Button onClick={handleOpenAddSubclinical} variant="contained">
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
                      const value = row[column.id as keyof ISubclinical];

                      if (column.id === "room") {
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
                            <Typography fontSize={14}>{row.dataRoom?.name}</Typography>
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
