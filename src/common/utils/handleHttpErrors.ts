import { setAppErrorAC, setAppStatusAC } from "app/app-reducer";
import type { AppDispatch } from "app/store";
import { useAppDispatch } from "common/hooks";

export const handleHttpErrors = (
  err: { message: string },
  dispatch: AppDispatch
) => {
  dispatch(setAppErrorAC(err.message));
  dispatch(setAppStatusAC("failed"));
};
