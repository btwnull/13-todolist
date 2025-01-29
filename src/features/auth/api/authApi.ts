import { instance } from "common/instance";
import type { LoginInputs } from "../ui/Login/Login";
import type { Response } from "common/types";

export const authApi = {
  login: (payload: LoginInputs) => {
    return instance.post<Response<{ userId: number; token: string }>>(
      "auth/login",
      payload
    );
  },
  logout: () => {
    return instance.delete<Response>("auth/login");
  },
  me: () => {
    return instance.get<Response<{ id: number; email: string; login: string }>>(
      "auth/me"
    );
  },
};
