import { Box } from "@mui/material";
import { FC, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { BreadcrumbsCustom } from "~/components";
import { departmentActions } from "~/features/department";
import { doctorActions } from "~/features/doctor";
import { positionActions } from "~/features/position";
import { qualificationActions } from "~/features/qualification";
import { specialtyActions } from "~/features/specialty";
import { MainLayout } from "~/layouts";
import { DoctorPayloadAdd } from "~/models";
import { useAppDispatch } from "~/stores";
import { DashboardPaths } from "~/types";
import FormAddEditDoctor from "./form/FormAddEditDoctor";
import { useLoadDataEdit } from "./helpers/loadAddEdit";

const { Head, Title, Container } = MainLayout;

type AddEditDoctorPageProps = {};

const AddEditDoctorPage: FC<AddEditDoctorPageProps> = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const data = useLoadDataEdit();
  const isEditMode = useMemo(() => Boolean(id), [id]);

  const title = useMemo(() => (isEditMode ? "Cập nhật bác sĩ" : "Thêm bác sĩ"), [isEditMode]);
  const texts = useMemo(() => {
    if (isEditMode) return { textBtn: "Lưu thay đổi" };
    return { textBtn: "Thêm mới" };
  }, [isEditMode]);

  const initialValues = useMemo((): DoctorPayloadAdd => {
    if (data) {
      return {
        id: data?.id,
        department_id: data?.operation?.department_id ? `${data?.operation?.department_id!}` : "",
        email: data.email!,
        first_name: data.infoData.first_name,
        gender: data.infoData.gender!,
        last_name: data.infoData.last_name,
        qualified_doctor_id: `${data.qualified_doctor_id}`,
        speciality_id: `${data.speciality_id}`,
        phone_number: data.phone_number!,
        photo: data.photo!,
        position_id: data?.operation?.position_id ? `${data?.operation?.position_id!}` : "",
        username: data.username,
      };
    }

    return {
      department_id: "",
      email: "",
      first_name: "",
      gender: "",
      last_name: "",
      password: "",
      phone_number: "",
      photo: "",
      position_id: "",
      username: "",
      qualified_doctor_id: "",
      speciality_id: "",
    };
  }, [isEditMode, data]);

  useEffect(() => {
    const filters = { limit: 100, page: 1 };
    dispatch(positionActions.getStart(filters));
    dispatch(departmentActions.getStart(filters));
    dispatch(qualificationActions.getStart(filters));
    dispatch(specialtyActions.getStart(filters));
  }, []);

  const handleSubmit = useCallback(
    (values: DoctorPayloadAdd, resetForm: () => void) => {
      if (isEditMode) {
        return dispatch(
          doctorActions.addEditStart({
            type: "edit",
            data: values,
            resetData: resetForm,
          })
        );
      }
      dispatch(doctorActions.addEditStart({ type: "add", data: values, resetData: resetForm }));
    },
    [isEditMode]
  );

  const defaultImage = useMemo(() => (isEditMode ? data?.photo! : ""), [data]);

  return (
    <MainLayout>
      <Head title={title} />
      <Container maxWidth="xl">
        {/* <Title mb={0} title={title} /> */}

        <BreadcrumbsCustom
          data={[{ label: "Danh sách bác sĩ", to: DashboardPaths.Doctor }, { label: title }]}
        />

        <Box mt={5}>
          <FormAddEditDoctor
            defaultImage={defaultImage}
            isEditMode={isEditMode}
            onSubmit={handleSubmit}
            initialValues={initialValues}
            textBtn={texts.textBtn}
          />
        </Box>
      </Container>
    </MainLayout>
  );
};

export default AddEditDoctorPage;
