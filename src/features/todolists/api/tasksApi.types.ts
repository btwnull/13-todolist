import type { RequestStatus } from "app/app-reducer";
import { TaskPriority, TaskStatus } from "../lib/enums/enums";

export type DomainTask = {
  description: string | null;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: string | null;
  deadline: string | null;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
export type UpdateTaskModel = {
  status: TaskStatus;
  title: string;
  deadline: string | null;
  description: string | null;
  priority: TaskPriority;
  startDate: string | null;
};

export type UpdateTaskDomainModel = {
  status?: TaskStatus;
  title?: string;
  deadline?: string | null;
  description?: string | null;
  priority?: TaskPriority;
  startDate?: string | null;
};

export type GetTaskResponse = {
  error: string | null;
  totalCount: number;
  items: DomainTask[];
};
