import { FC, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { BreadcrumbsCustom } from "~/components";
import { MainLayout } from "~/layouts";
import { DashboardPaths } from "~/types";
import { FormAddEditEmployee } from "./form";
import { Box } from "@mui/material";
import { EmployeePayloadAdd } from "~/models";
import { useAppDispatch } from "~/stores";
import { positionActions } from "~/features/position";
import { departmentActions } from "~/features/department";
import { employeeActions } from "~/features/employee";
import { useLoadDataEdit } from "./helpers/loadAddEdit";

const { Head, Title, Container } = MainLayout;

type AddEditEmployeePageProps = {};

const AddEditEmployeePage: FC<AddEditEmployeePageProps> = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const data = useLoadDataEdit();
  const isEditMode = useMemo(() => Boolean(id), [id]);

  const title = useMemo(() => (isEditMode ? "Cập nhật nhân viên" : "Thêm nhân viên"), [isEditMode]);
  const texts = useMemo(() => {
    if (isEditMode) return { textBtn: "Lưu thay đổi" };
    return { textBtn: "Thêm mới" };
  }, [isEditMode]);

  const initialValues = useMemo((): EmployeePayloadAdd => {
    if (data) {
      return {
        id: data?.id,
        department_id: data?.operation?.department_id ? `${data?.operation?.department_id!}` : "",
        email: data.email!,
        first_name: data.infoData.first_name,
        gender: data.infoData.gender!,
        last_name: data.infoData.last_name,
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
    };
  }, [isEditMode, data]);

  useEffect(() => {
    const filters = { limit: 100, page: 1 };
    dispatch(positionActions.getStart(filters));
    dispatch(departmentActions.getStart(filters));
  }, []);

  const handleSubmit = useCallback(
    (values: EmployeePayloadAdd, resetForm: () => void) => {
      if (isEditMode) {
        return dispatch(
          employeeActions.addEditStart({
            type: "edit",
            data: values,
            resetData: resetForm,
          })
        );
      }
      dispatch(employeeActions.addEditStart({ type: "add", data: values, resetData: resetForm }));
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
          data={[{ label: "Danh sách nhân viên", to: DashboardPaths.Employee }, { label: title }]}
        />

        <Box mt={2}>
          <FormAddEditEmployee
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

export default AddEditEmployeePage;
