import { EmployeeType } from "../model/employee";
import { SignInType } from "../model/sign";
import { getFromEmployeeServer, postToEmployeeServer } from "./base";

export async function me(): Promise<EmployeeType> {
  const response = await getFromEmployeeServer("/me");
  return response.data;
}

export async function login(loginInfo: SignInType): Promise<number> {
  const response = await postToEmployeeServer("/login", loginInfo);

  return response.data;
}

export async function logout(): Promise<number> {
  const response = await getFromEmployeeServer("/logout");

  return response.data;
}
