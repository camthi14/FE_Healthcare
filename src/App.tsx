import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { BackdropCommon, SnackbarCommon, StyledChart } from "~/components";
import { router } from "~/routes";
import NavContextProvider from "./contexts/NavContext";
import { sagaMiddleware, store } from "./stores";
import ThemeProvider from "./theme";

const helmetContext = {};

export default function App() {
  useEffect(() => {
    sagaMiddleware.setContext({ router });
  }, [router]);

  return (
    <Provider store={store}>
      <HelmetProvider>
        <ThemeProvider>
          <NavContextProvider>
            <RouterProvider router={router} />
            <StyledChart />
          </NavContextProvider>
          <BackdropCommon />
          <SnackbarCommon />
        </ThemeProvider>
      </HelmetProvider>
    </Provider>
  );
}
