import {
  RemoveTodolistActionType,
  type AddTodolistActionType,
  type ClearDataActionType,
} from "./todolists-reducer";
import type { AppDispatch, RootState } from "app/store";
import { taskApi } from "../api/tasksApi";
import type { DomainTask, UpdateTaskDomainModel } from "../api/tasksApi.types";
import { ResultCode } from "../lib/enums/enums";
import { setAppErrorAC, setAppStatusAC } from "app/app-reducer";
import { handleHttpErrors } from "common/utils/handleHttpErrors";
import { handleAppErrors } from "common/utils/handleAppErrors";

export type TasksStateType = {
  [key: string]: DomainTask[];
};

const initialState: TasksStateType = {};

export const tasksReducer = (
  state: TasksStateType = initialState,
  action: ActionsType
): TasksStateType => {
  switch (action.type) {
    case "SET-TASKS": {
      const stateCopy = { ...state };
      stateCopy[action.payload.todolistId] = action.payload.tasks;
      return stateCopy;
    }

    case "REMOVE-TASK": {
      const { todolistId, taskId } = action.payload;
      if (!state[todolistId]) {
        return state;
      }
      return {
        ...state,
        [todolistId]: state[todolistId].filter((t) => t.id !== taskId),
      };
    }

    case "ADD-TASK": {
      const task = action.payload.task;
      return {
        ...state,
        [task.todoListId]: [task, ...state[task.todoListId]],
      };
    }

    case "UPDATE-TASK": {
      const { todolistId, taskId, domainModel } = action.payload;
      return {
        ...state,
        [todolistId]: state[todolistId].map((t) =>
          t.id === taskId ? { ...t, ...domainModel } : t
        ),
      };
    }

    case "ADD-TODOLIST":
      return { ...state, [action.payload.todolist.id]: [] };

    case "REMOVE-TODOLIST": {
      let copyState = { ...state };
      delete copyState[action.payload.id];
      return copyState;
    }

    case "CLEAR-DATA":
      return {};

    default:
      return state;
  }
};

// Action creators

export const setTasksAC = (payload: {
  todolistId: string;
  tasks: DomainTask[];
}) => {
  return {
    type: "SET-TASKS",
    payload,
  } as const;
};

export const removeTaskAC = (payload: {
  taskId: string;
  todolistId: string;
}) => {
  return {
    type: "REMOVE-TASK",
    payload,
  } as const;
};

export const addTaskAC = (payload: { task: DomainTask }) => {
  return {
    type: "ADD-TASK",
    payload,
  } as const;
};

export const updateTaskAC = (payload: {
  taskId: string;
  todolistId: string;
  domainModel: UpdateTaskDomainModel;
}) => {
  return {
    type: "UPDATE-TASK",
    payload,
  } as const;
};

//Thunks

export const fetchTasksTC = (todolistId: string) => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC("loading"));
  taskApi
    .getTasks(todolistId)
    .then((res) => {
      dispatch(setAppStatusAC("succeeded"));
      dispatch(setTasksAC({ tasks: res.data.items, todolistId }));
    })
    .catch((err) => {
      handleHttpErrors(err, dispatch);
    });
};

export const removeTaskTC =
  (payload: { todolistId: string; taskId: string }) =>
  (dispatch: AppDispatch) => {
    dispatch(setAppStatusAC("loading"));
    taskApi
      .removeTask(payload)
      .then((res) => {
        if (res.data.resultCode === ResultCode.Success) {
          dispatch(setAppStatusAC("succeeded"));
          dispatch(removeTaskAC(payload));
        } else {
          handleAppErrors(dispatch, res.data);
        }
      })
      .catch((err) => handleHttpErrors(err, dispatch));
  };

export const addTaskTC =
  (payload: { todolistId: string; title: string }) =>
  (dispatch: AppDispatch) => {
    dispatch(setAppStatusAC("loading"));
    taskApi
      .createTask(payload)
      .then((res) => {
        if (res.data.resultCode === ResultCode.Success) {
          dispatch(setAppStatusAC("succeeded"));
          dispatch(addTaskAC({ task: res.data.data.item }));
        } else {
          handleAppErrors(dispatch, res.data);
        }
      })
      .catch((err) => {
        handleHttpErrors(err, dispatch);
      });
  };

export const updateTaskTC =
  (payload: {
    taskId: string;
    todolistId: string;
    domainModel: UpdateTaskDomainModel;
  }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setAppStatusAC("loading"));
    const state = getState();
    const tasks = state.tasks;
    const tasksForTodolist = tasks[payload.todolistId];
    const task = tasksForTodolist.find((el) => el.id === payload.taskId);
    if (!task) {
      console.warn("task not found");
      return;
    }
    const model: UpdateTaskDomainModel = {
      title: task.title,
      status: task.status,
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      ...payload.domainModel,
    };

    taskApi
      .updateTask({
        todolistId: task.todoListId,
        taskId: task.id,
        model: model,
      })
      .then((res) => {
        if (res.data.resultCode === ResultCode.Success) {
          dispatch(setAppStatusAC("succeeded"));
          dispatch(updateTaskAC(payload));
        } else {
          handleAppErrors(dispatch, res.data);
        }
      })
      .catch((err) => {
        handleHttpErrors(err, dispatch);
      });
  };

// Actions types
export type SetTasksActionType = ReturnType<typeof setTasksAC>;
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
export type AddTaskActionType = ReturnType<typeof addTaskAC>;
// export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>;
// export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>;
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>;

type ActionsType =
  | ClearDataActionType
  | RemoveTaskActionType
  | AddTaskActionType
  | UpdateTaskActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTasksActionType;
