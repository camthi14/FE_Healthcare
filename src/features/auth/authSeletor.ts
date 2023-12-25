import { useAppSelector } from "~/stores";

export const useAuth = () => useAppSelector((state) => state.auth);

export const useAccount = () => {
  const role = useAppSelector((state) => state.auth.role);

  if (!role) return null;

  const user = useAppSelector((state) => state.auth[role].user);

  return user;
};
