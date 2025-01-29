import type { AppDispatch } from "app/store";
import type { LoginInputs } from "../ui/Login/Login";
import { setAppStatusAC } from "app/app-reducer";
import { authApi } from "../api/authApi";
import { ResultCode } from "features/todolists/lib/enums/enums";
import { handleHttpErrors } from "common/utils/handleHttpErrors";
import { handleAppErrors } from "common/utils/handleAppErrors";
import { clearTodolistsDataAC } from "features/todolists/model/todolists-reducer";

type InitialStateType = typeof initialState;

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
};

export const authReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case "SET_IS_LOGGED_IN":
      return { ...state, isLoggedIn: action.payload.isLoggedIn };
    case "SET_IS_INITIALIZED":
      return { ...state, isInitialized: action.payload.isInitialized };
    default:
      return state;
  }
};

// ACTION CREATORS

const setIsLoggedInAC = (isLoggedIn: boolean) => {
  return { type: "SET_IS_LOGGED_IN", payload: { isLoggedIn } } as const;
};

const setIsInitializedAC = (isInitialized: boolean) => {
  return { type: "SET_IS_INITIALIZED", payload: { isInitialized } } as const;
};

// ACTIONS TYPES

type ActionsType =
  | ReturnType<typeof setIsLoggedInAC>
  | ReturnType<typeof setIsInitializedAC>;

//THUNKS

export const loginTC = (data: LoginInputs) => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC("loading"));
  authApi
    .login(data)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatusAC("succeeded"));
        dispatch(setIsLoggedInAC(true));
        localStorage.setItem("sn-token", res.data.data.token);
      } else {
        handleAppErrors(dispatch, res.data);
      }
    })
    .catch((e) => {
      handleHttpErrors(e, dispatch);
    });
};

export const logoutTC = () => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC("loading"));
  authApi
    .logout()
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatusAC("succeeded"));
        dispatch(setIsLoggedInAC(false));
        localStorage.removeItem("sn-token");
        dispatch(clearTodolistsDataAC());
      } else {
        handleAppErrors(dispatch, res.data);
      }
    })
    .catch((e) => {
      handleHttpErrors(e, dispatch);
    });
};

export const meTC = () => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC("loading"));
  authApi
    .me()
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatusAC("succeeded"));
        dispatch(setIsLoggedInAC(true));
      } else {
        handleAppErrors(dispatch, res.data);
      }
    })
    .catch((e) => {
      handleHttpErrors(e, dispatch);
    })
    .finally(() => {
      dispatch(setIsInitializedAC(true));
    });
};
