import { BASE_URL } from "@/constants/api";
import axios from "axios";

interface LoginParams {
  username: string;
  password: string;
}

interface Response {
  access: string;
  refresh: string;
}

const login = async ({ password, username }: LoginParams) => {
  const { data } = await axios.post<Response>(BASE_URL + "/user/login", {
    username,
    password,
  });

  return data;
};

const AuthService = {
  login,
};

export default AuthService;
