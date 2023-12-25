import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  DialogContent,
  Grid,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import { TransitionProps } from "@mui/material/transitions";
import React, { FC, useMemo } from "react";
import { Background, Colors } from "~/constants";
import { ColumnTable } from "~/types";
import { MainLayout } from "~/layouts";
import { Iconify } from "~/components";

const { Table } = MainLayout;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type DialogPrescribeMedicineProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (...args: any[]) => void;
};

const DialogPrescribeMedicine: FC<DialogPrescribeMedicineProps> = ({ open, onClose, onSubmit }) => {
  const columns = useMemo(
    (): ColumnTable[] => [
      { id: "id", label: "Mã thuốc", minWidth: 70, align: "center" },
      { id: "name", label: "Tên thuốc" },
      { id: "name7", label: "Thành phần" },
      { id: "name5", label: "Đơn vị", align: "center" },
      { id: "name1", label: "SL", align: "center" },
      { id: "name2", label: "Giá", align: "center" },
      { id: "name3", label: "Thành tiền", align: "center" },
      { id: "name4", label: "Ghi chú", align: "center" },
    ],
    []
  );

  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: "relative", background: Background.blue }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" fontWeight={400} component="div">
            Kê đơn thuốc
          </Typography>
          <Typography fontSize={17}> Thời gian y lệnh: 09:54 3/11/2023</Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Box p={2} m={1}>
          <Grid container spacing={3}>
            <Grid item lg={4} md={4} mt={2}>
              <Grid item mb={2}>
                <TextField
                  margin="none"
                  size="small"
                  fullWidth
                  label="Tên thuốc"
                  placeholder="VD: thuốc"
                />
              </Grid>
              <Grid item mb={2}>
                <TextField
                  margin="none"
                  size="small"
                  fullWidth
                  label="Thành phần"
                  placeholder="VD: thành phần"
                />
              </Grid>
              <Grid item mb={2}>
                <TextField
                  margin="none"
                  size="small"
                  fullWidth
                  label="Đơn vị"
                  placeholder="VD: viên"
                />
              </Grid>
              <Grid item mb={2}>
                <TextField
                  margin="none"
                  size="small"
                  fullWidth
                  label="Số lượng"
                  placeholder="VD: 2"
                />
              </Grid>
              <Grid item mb={2}>
                <TextField margin="none" size="small" fullWidth label="Giá" placeholder="VD:1 " />
              </Grid>
              <Grid item mb={2}>
                <TextField
                  margin="none"
                  size="small"
                  multiline
                  rows={3}
                  fullWidth
                  label="Ghi chú"
                />
              </Grid>
              <Grid item mb={2} justifyContent={"center"} display={"flex"}>
                <Button variant="contained" color="success" sx={{ color: Colors.white }}>
                  Thêm thuốc
                </Button>
              </Grid>
            </Grid>

            <Grid item lg={8} md={8}>
              <Typography variant="h6">Danh sách thuốc đã chọn</Typography>

              <Table columns={columns} sxTableContainer={{ mt: 2 }}>
                {[...Array(3)].map((row, i) => (
                  <TableRow key={i}>
                    {columns.map((column) => {
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
                          hello
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </Table>

              <Box textAlign={"end"} my={3}>
                <Button variant="outlined" sx={{ mr: "4px" }} color="error">
                  Huỷ
                </Button>
                <Button variant="contained" sx={{ mr: "4px" }}>
                  <Iconify mr={1} width={23} height={23} icon={"bx:save"} />
                  Lưu
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPrescribeMedicine;
