import { setAppErrorAC, setAppStatusAC } from "app/app-reducer";
import type { AppDispatch } from "app/store";
import type { Response } from "common/types";

export const handleAppErrors = <T>(
  dispatch: AppDispatch,
  data: Response<T>
) => {
  dispatch(
    setAppErrorAC(
      data.messages.length ? data.messages[0] : "Some error occurred"
    )
  );
  dispatch(setAppStatusAC("failed"));
};
