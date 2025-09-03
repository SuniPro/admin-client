import { EmployeeInfoType } from "@/model/employee";
import { SignInType } from "../model/sign";
import { getFromEmployeeServer, postToEmployeeServer } from "./base";

export async function check(): Promise<EmployeeInfoType> {
  const response = await getFromEmployeeServer("/check");
  return response.data;
}

export async function login(loginInfo: SignInType): Promise<string> {
  const response = await postToEmployeeServer("/login", loginInfo);

  return response.data;
}

export async function logout(): Promise<number> {
  const response = await getFromEmployeeServer("/logout");

  return response.data;
}

export async function refreshToken(): Promise<void> {
  await postToEmployeeServer("/auth/refresh", {});
}
