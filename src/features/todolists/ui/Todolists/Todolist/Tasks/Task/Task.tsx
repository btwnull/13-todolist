import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import { ChangeEvent, useState } from "react";
import { removeTaskTC, updateTaskTC } from "../../../../../model/tasks-reducer";
import { type DomainTodolist } from "../../../../../model/todolists-reducer";
import { getListItemSx } from "./Task.styles";
import { EditableSpan } from "common/components";
import { useAppDispatch } from "common/hooks";
import { TaskStatus } from "features/todolists/lib/enums/enums";
import type { DomainTask } from "features/todolists/api/tasksApi.types";

type Props = {
  task: DomainTask;
  todolist: DomainTodolist;
};

export const Task = ({ task, todolist }: Props) => {
  const dispatch = useAppDispatch();

  const removeTaskHandler = () => {
    dispatch(removeTaskTC({ taskId: task.id, todolistId: todolist.id }));
  };

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked
      ? TaskStatus.Completed
      : TaskStatus.New;
    dispatch(
      updateTaskTC({
        taskId: task.id,
        domainModel: { status },
        todolistId: todolist.id,
      })
    );
  };

  const changeTaskTitleHandler = (title: string) => {
    dispatch(
      updateTaskTC({
        taskId: task.id,
        domainModel: { title },
        todolistId: todolist.id,
      })
    );
  };

  return (
    <ListItem
      key={task.id}
      sx={getListItemSx(task.status === TaskStatus.Completed)}
    >
      <div>
        <Checkbox
          checked={task.status === TaskStatus.Completed}
          onChange={changeTaskStatusHandler}
          disabled={todolist.entityStatus === "loading"}
        />
        <EditableSpan
          value={task.title}
          onChange={changeTaskTitleHandler}
          disabled={todolist.entityStatus === "loading"}
        />
      </div>
      <IconButton
        onClick={removeTaskHandler}
        disabled={todolist.entityStatus === "loading"}
      >
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
};
