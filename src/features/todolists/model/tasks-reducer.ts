import {
  RemoveTodolistActionType,
  type AddTodolistActionType,
} from "./todolists-reducer";
import type { AppDispatch, RootState } from "app/store";
import { taskApi } from "../api/tasksApi";
import type {
  DomainTask,
  UpdateTaskDomainModel,
  UpdateTaskModel,
} from "../api/tasksApi.types";
import type { TaskPriority, TaskStatus } from "../lib/enums/enums";

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

    // case "CHANGE_TASK_STATUS": {
    //   const { todolistId, taskId, status } = action.payload;
    //   return {
    //     ...state,
    //     [todolistId]: state[todolistId].map((t) =>
    //       t.id === taskId ? { ...t, status } : t
    //     ),
    //   };
    // }

    // case "CHANGE_TASK_TITLE": {
    //   debugger;
    //   const { todolistId, taskId, title } = action.payload;
    //   return {
    //     ...state,
    //     [todolistId]: state[todolistId].map((t) =>
    //       t.id === taskId ? { ...t, title } : t
    //     ),
    //   };
    // }

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

// export const changeTaskStatusAC = (payload: {
//   taskId: string;
//   status: TaskStatus;
//   todolistId: string;
// }) => {
//   return {
//     type: "CHANGE_TASK_STATUS",
//     payload,
//   } as const;
// };

// export const changeTaskTitleAC = (payload: {
//   taskId: string;
//   title: string;
//   todolistId: string;
// }) => {
//   return {
//     type: "CHANGE_TASK_TITLE",
//     payload,
//   } as const;
// };

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

//Thunk

export const fetchTasksTC = (todolistId: string) => (dispatch: AppDispatch) => {
  taskApi.getTasks(todolistId).then((res) => {
    dispatch(setTasksAC({ tasks: res.data.items, todolistId }));
  });
};

export const removeTaskTC =
  (payload: { todolistId: string; taskId: string }) =>
  (dispatch: AppDispatch) => {
    taskApi.removeTask(payload).then(() => {
      dispatch(removeTaskAC(payload));
    });
  };

export const addTaskTC =
  (payload: { todolistId: string; title: string }) =>
  (dispatch: AppDispatch) => {
    taskApi.createTask(payload).then((res) => {
      dispatch(addTaskAC({ task: res.data.data.item }));
    });
  };

// export const updateTaskStatusTC =
//   (payload: { todolistId: string; taskId: string; status: TaskStatus }) =>
//   (dispatch: AppDispatch, getState: () => RootState) => {
//     const state = getState();
//     const tasks = state.tasks;
//     const tasksForTodolist = tasks[payload.todolistId];
//     const task = tasksForTodolist.find((el) => el.id === payload.taskId);

//     if (task) {
//       const model: UpdateTaskModel = {
//         title: task.title,
//         status: payload.status,
//         deadline: task.deadline,
//         description: task.description,
//         priority: task.priority,
//         startDate: task.startDate,
//       };
//       taskApi
//         .changeTaskStatus({
//           taskId: payload.taskId,
//           todolistId: payload.todolistId,
//           model,
//         })
//         .then((res) => {
//           dispatch(changeTaskStatusAC(payload));
//         });
//     }
//   };

// export const updateTaskTitleTC =
//   (payload: { todolistId: string; taskId: string; title: string }) =>
//   (dispatch: AppDispatch, getState: () => RootState) => {
//     const state = getState();
//     const tasks = state.tasks;
//     const tasksForTodolist = tasks[payload.todolistId];
//     const task = tasksForTodolist.find((el) => el.id === payload.taskId);

//     if (task) {
//       const model: UpdateTaskModel = {
//         title: payload.title,
//         status: task.status,
//         deadline: task.deadline,
//         description: task.description,
//         priority: task.priority,
//         startDate: task.startDate,
//       };
//       debugger;
//       taskApi
//         .updateTaskTitle({
//           taskId: payload.taskId,
//           todolistId: payload.todolistId,
//           model,
//         })
//         .then((res) => {
//           dispatch(changeTaskTitleAC(payload));
//         });
//     }
//   };

export const updateTaskTC =
  (payload: {
    taskId: string;
    todolistId: string;
    domainModel: UpdateTaskDomainModel;
  }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
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
      .then(() => dispatch(updateTaskAC(payload)));
  };

// Actions types
export type SetTasksActionType = ReturnType<typeof setTasksAC>;
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
export type AddTaskActionType = ReturnType<typeof addTaskAC>;
// export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>;
// export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>;
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>;

type ActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  //   | ChangeTaskStatusActionType
  //   | ChangeTaskTitleActionType
  | UpdateTaskActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTasksActionType;
