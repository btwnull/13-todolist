import type { Todolist } from "../api/todolistsApi.types";
import { todolistsApi } from "../api/todolistsApi";
import type { AppDispatch } from "app/store";
import {
  setAppErrorAC,
  setAppStatusAC,
  type RequestStatus,
} from "app/app-reducer";
import { ResultCode } from "../lib/enums/enums";
import { handleHttpErrors } from "common/utils/handleHttpErrors";
import { handleAppErrors } from "common/utils/handleAppErrors";
import { fetchTasksTC } from "./tasks-reducer";

export type FilterValuesType = "all" | "active" | "completed";

export type DomainTodolist = Todolist & {
  filter: FilterValuesType;
  entityStatus: RequestStatus;
};

const initialState: DomainTodolist[] = [];

export const todolistsReducer = (
  state: DomainTodolist[] = initialState,
  action: ActionsType
): DomainTodolist[] => {
  switch (action.type) {
    case "SET-TODOLISTS": {
      return action.todolists.map((tl) => ({
        ...tl,
        filter: "all",
        entityStatus: "idle",
      }));
    }

    case "REMOVE-TODOLIST": {
      return state.filter((tl) => tl.id !== action.payload.id);
    }

    case "ADD-TODOLIST": {
      const newTodolist: DomainTodolist = {
        ...action.payload.todolist,
        filter: "all",
        entityStatus: "idle",
      };

      return [...state, newTodolist];
    }

    case "CHANGE-TODOLIST-TITLE": {
      return state.map((tl) =>
        tl.id === action.payload.id
          ? { ...tl, title: action.payload.title }
          : tl
      );
    }

    case "CHANGE-TODOLIST-FILTER": {
      return state.map((tl) =>
        tl.id === action.payload.id
          ? { ...tl, filter: action.payload.filter }
          : tl
      );
    }

    case "CHANGE-TODOLIST-STATUS":
      return state.map((t) =>
        t.id === action.payload.id
          ? {
              ...t,
              entityStatus: action.payload.entityStatus,
            }
          : t
      );
      
      case "CLEAR-DATA":
        return []

    default:
      return state;
  }
};

// Action creators

export const setTodolistsAC = (todolists: Todolist[]) => {
  return { type: "SET-TODOLISTS", todolists } as const;
};

export const clearTodolistsDataAC = () => ({ type: "CLEAR-DATA" } as const);

export const removeTodolistAC = (id: string) => {
  return { type: "REMOVE-TODOLIST", payload: { id } } as const;
};

export const addTodolistAC = (payload: { todolist: Todolist }) => {
  return {
    type: "ADD-TODOLIST",
    payload,
  } as const;
};

export const changeTodolistTitleAC = (payload: {
  id: string;
  title: string;
}) => {
  return { type: "CHANGE-TODOLIST-TITLE", payload } as const;
};

export const changeTodolistFilterAC = (payload: {
  id: string;
  filter: FilterValuesType;
}) => {
  return { type: "CHANGE-TODOLIST-FILTER", payload } as const;
};

export const changeTodolistStatusAC = (payload: {
  id: string;
  entityStatus: RequestStatus;
}) => {
  return { type: "CHANGE-TODOLIST-STATUS", payload } as const;
};

// Thunks
export const fetchTodolistsTC = () => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC("loading"));
  todolistsApi
    .getTodolists()
    .then((res) => {
      dispatch(setAppStatusAC("succeeded"));
      dispatch(setTodolistsAC(res.data));
      return res.data;
    })
    .then((todos) => {
      todos.forEach((tl) => {
        dispatch(fetchTasksTC(tl.id));
      });
    })
    .catch((err) => {
      handleHttpErrors(err, dispatch);
    });
};

export const addTodolistTC = (title: string) => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC("loading"));
  todolistsApi
    .createTodolist(title)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatusAC("succeeded"));
        dispatch(addTodolistAC({ todolist: res.data.data.item }));
      } else {
        handleAppErrors(dispatch, res.data);
      }
    })
    .catch((err) => {
      handleHttpErrors(err, dispatch);
    });
};

export const removeTodolistTC = (id: string) => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC("loading"));
  dispatch(changeTodolistStatusAC({ entityStatus: "loading", id }));
  todolistsApi
    .deleteTodolist(id)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatusAC("succeeded"));
        dispatch(removeTodolistAC(id));
      } else {
        handleAppErrors(dispatch, res.data);
        dispatch(changeTodolistStatusAC({ entityStatus: "succeeded", id }));
      }
    })
    .catch((err) => {
      handleHttpErrors(err, dispatch);
      dispatch(changeTodolistStatusAC({ entityStatus: "succeeded", id }));
    });
};

export const updateTodolistTitleTC =
  (payload: { id: string; title: string }) => (dispatch: AppDispatch) => {
    dispatch(setAppStatusAC("loading"));
    todolistsApi
      .updateTodolistTitle(payload)
      .then((res) => {
        if (res.data.resultCode === ResultCode.Success) {
          dispatch(setAppStatusAC("succeeded"));
          dispatch(changeTodolistTitleAC(payload));
        } else {
          handleAppErrors(dispatch, res.data);
        }
      })
      .catch((err) => {
        handleHttpErrors(err, dispatch);
      });
  };

// Actions types
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type ChangeTodolistTitleActionType = ReturnType<
  typeof changeTodolistTitleAC
>;
export type ChangeTodolistFilterActionType = ReturnType<
  typeof changeTodolistFilterAC
>;
export type ChangeTodolistStatusActionType = ReturnType<
  typeof changeTodolistStatusAC
>;
export type ClearDataActionType = ReturnType<
  typeof clearTodolistsDataAC
>;

type ActionsType =
  | ClearDataActionType
  | SetTodolistsActionType
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType
  | ChangeTodolistStatusActionType;
