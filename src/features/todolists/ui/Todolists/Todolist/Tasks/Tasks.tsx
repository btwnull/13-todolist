import List from "@mui/material/List";
import { selectTasks } from "../../../../model/tasksSelectors";
import { Task } from "./Task/Task";
import { useAppDispatch, useAppSelector } from "common/hooks";
import type { DomainTodolist } from "features/todolists/model/todolists-reducer";
import { useEffect } from "react";
import { fetchTasksTC } from "features/todolists/model/tasks-reducer";
import { TaskStatus } from "features/todolists/lib/enums/enums";

type Props = {
  todolist: DomainTodolist;
};

export const Tasks = ({ todolist }: Props) => {
  const tasks = useAppSelector(selectTasks);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTasksTC(todolist.id));
  }, []);

  const allTodolistTasks = tasks[todolist.id];

  let tasksForTodolist = allTodolistTasks;

  if (todolist.filter === "active") {
    tasksForTodolist = allTodolistTasks.filter(
      (task) => task.status === TaskStatus.New
    );
  }

  if (todolist.filter === "completed") {
    tasksForTodolist = allTodolistTasks.filter(
      (task) => task.status === TaskStatus.Completed
    );
  }

  return (
    <>
      {tasksForTodolist?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {tasksForTodolist?.map((task) => {
            return <Task task={task} todolist={todolist} />;
          })}
        </List>
      )}
    </>
  );
};
