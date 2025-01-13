import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import {
  removeTodolistTC,
  updateTodolistTitleTC,
  type DomainTodolist,
} from "../../../../model/todolists-reducer";
import s from "./TodolistTitle.module.css";
import { EditableSpan } from "common/components";
import { useAppDispatch } from "common/hooks";

type Props = {
  todolist: DomainTodolist;
};

export const TodolistTitle = ({ todolist }: Props) => {
  const { title, id } = todolist;

  const dispatch = useAppDispatch();

  const removeTodolistHandler = () => {
    dispatch(removeTodolistTC(id));
  };
  const updateTodolistHandler = (title: string) => {
    dispatch(updateTodolistTitleTC({ id, title }));
  };

  return (
    <div className={s.container}>
      <h3>
        <EditableSpan value={title} onChange={updateTodolistHandler} />
      </h3>
      <IconButton onClick={removeTodolistHandler}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};
