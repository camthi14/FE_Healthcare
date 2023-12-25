import { Box, Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { Iconify, LazyLoadImage } from "~/components";
import { Background, Colors, Shadows } from "~/constants";
import { convertGender } from "~/utils/common";

type DialogProps = {
  openDialog: boolean;
  title: string;
  handleCloseDialog: () => void;
  values: Record<string, any>;
};

const DialogDetailUser = ({ openDialog, handleCloseDialog, title, values }: DialogProps) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent sx={{ "&::-webkit-scrollbar": { width: 0 }, p: 0 }}>
        <Box sx={{ position: "relative" }}>
          <Button
            variant="text"
            onClick={handleCloseDialog}
            sx={{
              display: "flex",
              position: "absolute",
              top: "6px",
              right: "0px",
              color: Colors.white,
              height: "45px",
              lineHeight: "45px",
            }}
          >
            <Iconify icon="clarity:close-line" />
          </Button>
        </Box>

        <DialogTitle
          sx={{ textAlign: "center", background: Background.blue, color: Colors.white }}
          id="alert-dialog-title"
        >
          {title}
        </DialogTitle>
        <Box sx={{ mx: 2, p: 2, fontSize: 15 }}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LazyLoadImage
                src={values?.photo!}
                sxBox={{
                  width: 120,
                  height: 120,
                  borderRadius: 50,
                  boxShadow: Shadows.boxShadow2,
                  mr: 5,
                }}
                sxImage={{
                  width: 120,
                  height: 120,
                  borderRadius: 50,
                }}
              />
            </Box>
            <Stack gap={1}>
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <Iconify mr={1} icon="mdi:user" />
                Họ và tên: <b>{values?.display_name}</b>
              </Typography>
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <Iconify mr={1} icon="mdi:birthday-cake" />
                Ngày sinh: <b>{values?.infoData?.birth_date}</b>
              </Typography>
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <Iconify mr={1} icon="mdi:gender-male-female" />
                Giới tính: <b>{convertGender(values?.infoData?.gender)}</b>
              </Typography>
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <Iconify mr={1} icon="ic:outline-email" />
                Email: <b>{values?.email}</b>
              </Typography>
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <Iconify mr={1} icon="bi:phone" />
                Số điện thoại: <b>{values?.phone_number}</b>
              </Typography>
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <Iconify mr={1} icon="mingcute:department-fill" />
                Bộ phận làm việc: <b>{values?.operation?.department?.name}</b>
              </Typography>
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <Iconify mr={1} icon="gis:position-man" />
                Chức vụ: <b>{values?.operation?.position?.name}</b>
              </Typography>
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <Iconify mr={1} icon="grommet-icons:map" />
                Địa chỉ: <b>{values?.infoData?.address}</b>
              </Typography>
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <Iconify mr={1} icon="material-symbols:description-outline" />
                Mô tả: <b>{values?.infoData?.desc}</b>
              </Typography>
            </Stack>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDetailUser;
