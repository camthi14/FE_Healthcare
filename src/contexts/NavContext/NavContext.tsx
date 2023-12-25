import { createContext, useContext, useState, useCallback, FC, ReactNode } from "react";

interface NavContextState {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  onToggle: () => void;
}

type NavContextProviderProps = {
  children: ReactNode | JSX.Element;
};

const NavContext = createContext<NavContextState>({
  open: false,
  onClose() {},
  onOpen() {},
  onToggle() {},
});

export const useNav = () => useContext(NavContext);

const NavContextProvider: FC<NavContextProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(true);

  const onClose = useCallback(() => setOpen(false), []);
  const onOpen = useCallback(() => setOpen(true), []);
  const onToggle = useCallback(() => setOpen((prev) => !prev), []);

  return (
    <NavContext.Provider value={{ open, onClose, onOpen, onToggle }}>
      {children}
    </NavContext.Provider>
  );
};

export default NavContextProvider;
