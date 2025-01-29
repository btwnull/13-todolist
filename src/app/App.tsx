import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { selectThemeMode } from "./appSelectors";
import { Header } from "common/components";
import { useAppDispatch, useAppSelector } from "common/hooks";
import { getTheme } from "common/theme";
import { ErrorSnackBar } from "common/components/ErrorSnackBar/ErrorSnackBar";
import { Routing } from "common/routing";
import { useEffect } from "react";
import { meTC } from "features/auth/model/authReducer";
import { selectIsInitialized } from "features/auth/model/authSelectors";
import { CircularProgress } from "@mui/material";
import s from "./App.module.css";

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode);
  const isInitialized = useAppSelector(selectIsInitialized);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(meTC());
  }, []);

  if (!isInitialized) {
    return (
      <div className={s.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    );
  }

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <CssBaseline />
      <Header />
      <Routing />
      <ErrorSnackBar />
    </ThemeProvider>
  );
};
