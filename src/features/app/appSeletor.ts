import { useAppSelector } from "~/stores";

export const useSnackbar = () => useAppSelector((state) => state.app.snackbar);
export const useBackdrop = () => useAppSelector((state) => state.app.backdrop);
export const useCurrentTabSelector = () => useAppSelector((state) => state.app.currentTab);
export const useReport = () => useAppSelector((state) => state.app.reports);
export const useTitle = () => useAppSelector((state) => state.app.title);
