import type { Response } from "common/types";
import type {
  DomainTask,
  GetTaskResponse,
  UpdateTaskDomainModel,
  UpdateTaskModel,
} from "./tasksApi.types";
import { instance } from "common/instance";

export const taskApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTaskResponse>(`todo-lists/${todolistId}/tasks`);
  },

  createTask(payload: { todolistId: string; title: string }) {
    const { todolistId, title } = payload;
    return instance.post<Response<{ item: DomainTask }>>(
      `todo-lists/${todolistId}/tasks`,
      {
        title,
      }
    );
  },
  removeTask(payload: { todolistId: string; taskId: string }) {
    const { todolistId, taskId } = payload;
    return instance.delete<Response<{}>>(
      `todo-lists/${todolistId}/tasks/${taskId}`
    );
  },
  // changeTaskStatus(payload: {
  //   todolistId: string;
  //   taskId: string;
  //   model: UpdateTaskModel;
  // }) {
  //   const { todolistId, taskId, model } = payload;
  //   return instance.put<Response<{ item: DomainTask }>>(
  //     `todo-lists/${todolistId}/tasks/${taskId}`,
  //     model
  //   );
  // },
  // updateTaskTitle(payload: {
  //   todolistId: string;
  //   taskId: string;
  //   model: UpdateTaskModel;
  // }) {
  //   const { todolistId, taskId, model } = payload;
  //   return instance.put<any>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
  // },

  updateTask(payload: {
    todolistId: string;
    taskId: string;
    model: UpdateTaskDomainModel;
  }) {
    const { todolistId, taskId, model } = payload;
    return instance.put<Response<{ item: DomainTask }>>(
      `todo-lists/${todolistId}/tasks/${taskId}`,
      model
    );
  },
};
