import { Login } from "features/auth/ui/Login/Login";
import { Route, Routes } from "react-router";
import { Main } from "app/Main";
import { Page404 } from "common/components";

export const Path = {
  Main: "/13-todolist",
  Login: "/login",
  NotFound: "*",
} as const;

export const Routing = () => {
  return (
    <Routes>
      <Route path={Path.Main} element={<Main />} />
      <Route path={Path.Login} element={<Login />} />
      <Route path={Path.NotFound} element={<Page404 />} />
    </Routes>
  );
};
