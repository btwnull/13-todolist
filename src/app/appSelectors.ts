import { RootState } from "./store";

export const selectThemeMode = (state: RootState) => state.app.themeMode;
export const setAppStatus = (state: RootState) => state.app.status;
export const setAppError = (state: RootState) => state.app.error;
