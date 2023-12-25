import { Alert, Box, Button, Chip, Radio, Stack, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { FC } from "react";
import { BreadcrumbsCustom, LazyLoadImage } from "~/components";
import { Colors, Shadows } from "~/constants";
import { MainLayout } from "~/layouts";
import { DashboardPaths } from "~/types";
import { useGetDoctorIds } from "./helpers/useGetDoctorIds";
import CalendarHelper from "~/components/ui/CalendarLayout/CalendarHelpert";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import DoneIcon from "@mui/icons-material/Done";

const { Card, Container, Grid, Head, Title } = MainLayout;

type AddEditSchedulePageProps = {};

const AddEditSchedulePage: FC<AddEditSchedulePageProps> = () => {
  const {
    disabled,
    doctors,
    sessionCheckups,
    selected,
    values,
    dateSelectedResults,
    selectedSessionDoctor,
    hourSelectedByDoctor,
    onChangeSelected,
    onRemoveHour,
    onSelectSession,
    onChangeDate,
    onRemoveSelectedDate,
    onSave,
  } = useGetDoctorIds();

  return (
    <MainLayout>
      <Head title="Thêm lịch khám bệnh" />

      <Container maxWidth="xl">
        {/* <Title mb={0} title="Thêm lịch khám bệnh" /> */}

        <BreadcrumbsCustom
          data={[
            { label: "Danh sách bác sĩ", to: DashboardPaths.Doctor },
            { label: "Thêm lịch khám bệnh" },
          ]}
        />

        <Grid container spacing={2}>
          <Grid item xl={4} md={4} xs={12}>
            {doctors.length
              ? doctors.map((doctor, index) => (
                  <Card
                    onClick={() => onChangeSelected(doctor)}
                    key={index}
                    sx={{ mt: 3, cursor: "pointer" }}
                  >
                    <Stack
                      flexDirection={"row"}
                      gap={2}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Stack flexDirection={"row"} alignItems={"center"} gap={2} flexWrap={"wrap"}>
                        <LazyLoadImage
                          src={doctor.photo!}
                          sxBox={{
                            width: 70,
                            height: 70,
                            flexShrink: 0,
                            borderRadius: 50,
                            boxShadow: Shadows.boxShadow2,
                          }}
                          sxImage={{
                            flexShrink: 0,
                            width: 70,
                            height: 70,
                            borderRadius: 50,
                          }}
                        />
                        <Box sx={{}}>
                          <Typography
                            fontWeight={700}
                          >{`${doctor?.qualificationData?.character} ${doctor.display_name}`}</Typography>
                          <Typography>Chuyên khoa: {doctor?.specialtyData?.name}</Typography>
                        </Box>
                      </Stack>
                      <Box>
                        <Radio
                          checked={selected?.id === doctor.id}
                          name="radio-buttons"
                          onChange={() => onChangeSelected(doctor)}
                          inputProps={{ "aria-label": "A" }}
                        />
                      </Box>
                    </Stack>
                  </Card>
                ))
              : null}
          </Grid>

          <Grid item xl={8} md={8} xs={12}>
            <Card sx={{ mt: 3 }}>
              <Grid item>
                <Stack flexDirection={"row"} alignItems={"center"} gap={2} flexWrap={"wrap"}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      slotProps={{ textField: { InputProps: { size: "small" } } }}
                      format="DD/MM/YYYY"
                      minDate={disabled}
                      label="Ngày khám"
                      value={values && selected ? values[selected.id!].dateSelected : dayjs()}
                      onChange={onChangeDate}
                      shouldDisableDate={(date) => Boolean(date.day() === 0)}
                    />
                  </LocalizationProvider>

                  <Stack flexDirection={"row"} gap={1}>
                    {sessionCheckups?.length
                      ? sessionCheckups.map((item) => (
                          <Button
                            onClick={() => onSelectSession(item.id!)}
                            key={item.id}
                            variant={
                              selectedSessionDoctor?.id === item.id ? "contained" : "outlined"
                            }
                            color="primary"
                          >
                            {item.name}
                          </Button>
                        ))
                      : null}
                  </Stack>
                </Stack>
              </Grid>

              <Grid mt={2} item>
                <Alert severity="error">
                  Nếu không muốn chọn ngày hiện tại, vui lòng chọn ngày khác và click vào xoá ngày
                  hiện tại.
                </Alert>

                <CalendarHelper hideBooked hideCancel />

                <Stack
                  border={({ palette }) => `1px dashed ${palette.grey[400]}`}
                  borderRadius={1}
                  p={1}
                  mt={2}
                  flexDirection={"row"}
                  flexWrap={"wrap"}
                  gap={1}
                >
                  <Box>
                    <Typography>Ngày đã chọn: </Typography>
                  </Box>

                  {selected && dateSelectedResults?.length
                    ? dateSelectedResults.map((d, index) => (
                        <Box key={index}>
                          <Chip label={d} size="small" onDelete={() => onRemoveSelectedDate(d)} />
                        </Box>
                      ))
                    : null}
                </Stack>
              </Grid>

              <Grid item>
                <Typography variant="h5" my={2}>
                  Thời gian khám bệnh
                </Typography>

                <Box mb={2}>
                  <Alert severity="warning">
                    Tất cả thời gian đều đã được chọn, nếu không muốn chọn giờ nào vui lòng click
                    vào.
                  </Alert>
                </Box>

                <Stack flexDirection={"row"} flexWrap={"wrap"} mb={4} gap={2}>
                  {hourSelectedByDoctor?.length
                    ? hourSelectedByDoctor.map((hour, i) => (
                        <Button
                          startIcon={hour.is_over_time ? <DoNotDisturbIcon /> : <DoneIcon />}
                          disabled={hour.is_over_time}
                          key={i}
                          variant={hour.is_remove ? "outlined" : "contained"}
                          onClick={() => onRemoveHour(selected?.id!, hour.id)}
                        >
                          {`${hour.time_start} - ${hour.time_end}`}
                        </Button>
                      ))
                    : null}
                </Stack>
                <Button
                  onClick={onSave}
                  variant="contained"
                  color="success"
                  sx={{ color: Colors.white }}
                >
                  Lưu lại
                </Button>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default AddEditSchedulePage;
