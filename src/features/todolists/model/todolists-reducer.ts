import type { Todolist } from "../api/todolistsApi.types";
import { todolistsApi } from "../api/todolistsApi";
import type { AppDispatch } from "app/store";

export type FilterValuesType = "all" | "active" | "completed";

export type DomainTodolist = Todolist & {
  filter: FilterValuesType;
};

const initialState: DomainTodolist[] = [];

export const todolistsReducer = (
  state: DomainTodolist[] = initialState,
  action: ActionsType
): DomainTodolist[] => {
  switch (action.type) {
    case "SET-TODOLISTS": {
      return action.todolists.map((tl) => ({ ...tl, filter: "all" }));
    }

    case "REMOVE-TODOLIST": {
      return state.filter((tl) => tl.id !== action.payload.id);
    }

    case "ADD-TODOLIST": {
      //   const newTodolist: DomainTodolist = {
      //     id: action.payload.todolist.id,
      //     title: action.payload.todolist.title,
      //     filter: "all",
      //     addedDate: action.payload.todolist.addedDate,
      //     order: action.payload.todolist.order,
      //   };
      const newTodolist: DomainTodolist = {
        ...action.payload.todolist,
        filter: "all",
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

    default:
      return state;
  }
};

// Action creators

export const setTodolistsAC = (todolists: Todolist[]) => {
  return { type: "SET-TODOLISTS", todolists } as const;
};

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

// Thunks
export const fetchTodolistsTC = () => (dispatch: AppDispatch) => {
  todolistsApi.getTodolists().then((res) => {
    dispatch(setTodolistsAC(res.data));
  });
};

export const addTodolistTC = (title: string) => (dispatch: AppDispatch) => {
  todolistsApi.createTodolist(title).then((res) => {
    dispatch(addTodolistAC({ todolist: res.data.data.item }));
  });
};

export const removeTodolistTC = (id: string) => (dispatch: AppDispatch) => {
  todolistsApi.deleteTodolist(id).then(() => {
    dispatch(removeTodolistAC(id));
  });
};

export const updateTodolistTitleTC =
  (payload: { id: string; title: string }) => (dispatch: AppDispatch) => {
    todolistsApi.updateTodolistTitle(payload).then(() => {
      dispatch(changeTodolistTitleAC(payload));
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

type ActionsType =
  | SetTodolistsActionType
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType;
