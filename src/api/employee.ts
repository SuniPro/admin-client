import {
  EmployeeType,
  LevelType,
  SignUpFormType,
  UpdateEmployeeType,
} from "../model/employee";
import { PaginationResponse } from "../model/pagination";
import {
  deleteToEmployeeServer,
  getFromEmployeeServer,
  postToEmployeeServer,
  putToEmployeeServer,
} from "./base";

export async function createEmployee(
  form: SignUpFormType,
): Promise<EmployeeType> {
  const response = await postToEmployeeServer("/employee/create", form);

  return response.data;
}

export async function getAllEmployeeList(
  level: LevelType,
  site: string,
  page: number,
  size: number,
): Promise<PaginationResponse<EmployeeType>> {
  if (level === "ADMINISTRATOR" || level === "DEVELOPER") {
    const response = await getFromEmployeeServer(
      `/employee/get/all?page=${page}&size=${size}&sort=insertDateTime,desc`,
    );

    return response.data;
  } else {
    const response = await getFromEmployeeServer(
      `/employee/get/all/${site}?page=${page}&size=${size}&sort=insertDateTime,desc`,
    );

    return response.data;
  }
}

export async function getEmployeeByNameThroughList(
  name: string,
): Promise<EmployeeType[]> {
  const response = await getFromEmployeeServer(
    `/employee/get/by/${name}/through/list`,
  );

  return response.data;
}

export async function updateEmployee(
  employee: UpdateEmployeeType,
): Promise<EmployeeType> {
  const response = await putToEmployeeServer("/employee/update", employee);

  return response.data;
}

export async function deleteEmployee(id: number): Promise<number> {
  const response = await deleteToEmployeeServer(`/employee/delete/by/${id}`);

  return response.data;
}
