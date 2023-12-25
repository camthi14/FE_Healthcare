import { Dayjs } from "dayjs";
import { FC, useCallback, useLayoutEffect, useMemo, useState } from "react";
import { CalendarLayout } from "~/components";
import { appActions } from "~/features/app";
import { OptionsSearchDoctor, specialtyActions, useSpecialties } from "~/features/specialty";
import { MainLayout } from "~/layouts";
import { ISpecialty } from "~/models";
import { useAppDispatch } from "~/stores";
import { getHourAndMinus, getHours } from "~/utils/common";
import HeaderSchedule from "./component/HeaderSchedule";

const { Container, Head } = MainLayout;

const DoctorSchedulesListPage: FC = () => {
  const dispatch = useAppDispatch();
  const {
    data: options,
    screenSchedules: { queries, data, selectedSpecialty, option },
  } = useSpecialties();

  const [search, setSearch] = useState("");

  useLayoutEffect(() => {
    dispatch(appActions.setOpenBackdrop());
    dispatch(
      // @ts-ignore
      specialtyActions.getDoctorStart({ ...queries, date: queries.date.format("YYYY-MM-DD") })
    );
  }, [queries]);

  useLayoutEffect(() => {
    dispatch(appActions.setOpenBackdrop());
    dispatch(specialtyActions.getStart({ limit: 9999 }));
  }, []);

  const hours = useMemo(() => {
    const startMorning = getHourAndMinus(7, 30);
    const endMorning = getHourAndMinus(11, 30);
    const startAfternoon = getHourAndMinus(13, 30);
    const endAfternoon = getHourAndMinus(20, 0);

    const hoursMorning = getHours(startMorning, endMorning);
    const hoursAfter = getHours(startAfternoon, endAfternoon);

    return [...hoursMorning, ...hoursAfter];
  }, []);

  const handlePrevDate = useCallback(() => {
    dispatch(specialtyActions.setPrevDate());
  }, []);

  const handleNextDate = useCallback(() => {
    dispatch(specialtyActions.setNextDate());
  }, []);

  const handleChangeDate = useCallback((date: Dayjs | null) => {
    dispatch(specialtyActions.setQuery({ date: date! }));
  }, []);

  const handleChangeOptions = useCallback(
    (value: ISpecialty | null) => {
      dispatch(specialtyActions.setSelectedSpecialty(value));
      dispatch(
        specialtyActions.setQuery({
          ...queries,
          specialtyId: Number(value?.id!) === -1 ? "" : String(value?.id),
        })
      );
    },
    [queries]
  );

  const handleChangeOptionSearchDoctor = useCallback(
    (value: OptionsSearchDoctor) => {
      dispatch(specialtyActions.setOptionSearchDoctor(value));

      if (!search) return;

      if (value === "id") {
        dispatch(
          specialtyActions.setDebounceSearchDoctor({ ...queries, doctorId: search, doctorName: "" })
        );
        return;
      }

      dispatch(
        specialtyActions.setDebounceSearchDoctor({ ...queries, doctorName: search, doctorId: "" })
      );
    },
    [search]
  );

  const handleChangeSearch = useCallback(
    (value: string) => {
      setSearch(value);

      if (option === "id") {
        dispatch(
          specialtyActions.setDebounceSearchDoctor({ ...queries, doctorId: value, doctorName: "" })
        );
        return;
      }

      dispatch(
        specialtyActions.setDebounceSearchDoctor({ ...queries, doctorName: value, doctorId: "" })
      );
    },
    [option, queries]
  );

  return (
    <MainLayout>
      <Head title="Danh sách lịch khám bệnh" />

      <Container maxWidth="xl">
        <HeaderSchedule
          search={search}
          onChangeSearch={handleChangeSearch}
          optionsSearchDoctor={option}
          valueOption={selectedSpecialty}
          options={[
            { name: "Tất cả", id: -1, desc: "", time_chekup_avg: "", price: "0" },
            ...options,
          ]}
          onChangeDate={handleChangeDate}
          date={queries.date}
          onNextDate={handleNextDate}
          onPrevDate={handlePrevDate}
          onChangeOptions={handleChangeOptions}
          onChangeOptionSearchDoctor={handleChangeOptionSearchDoctor}
        />

        <CalendarLayout hours={hours} data={data} />
      </Container>
    </MainLayout>
  );
};

export default DoctorSchedulesListPage;
