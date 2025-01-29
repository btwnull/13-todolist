import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { type SyntheticEvent } from "react";
import { Alert } from "@mui/material";
import { useAppDispatch, useAppSelector } from "common/hooks";
import { setAppError } from "app/appSelectors";
import { setAppErrorAC } from "app/app-reducer";

export const ErrorSnackBar = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(setAppError);

  const handleClose = (
    _: SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setAppErrorAC(null));
  };

  return (
    <div>
      <Snackbar
        open={error != null}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};
