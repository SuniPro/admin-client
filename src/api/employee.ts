import {
  DepartmentType,
  EmployeeType,
  LevelType,
  SignUpFormType,
} from "../model/employee";
import { PaginationResponse } from "../model/pagination";
import {
  deleteToEmployeeServer,
  getFromEmployeeServer,
  postToEmployeeServer,
  updateToEmployeeServer,
} from "./base";

export async function createEmployee(
  form: SignUpFormType,
): Promise<EmployeeType> {
  const response = await postToEmployeeServer("/employee/create", form);

  return response.data;
}

export async function getAllEmployeeList(
  page: number,
  size: number,
): Promise<PaginationResponse<EmployeeType>> {
  const response = await getFromEmployeeServer(
    `/employee/get/all?page=${page}&size=${size}&sort=insertDateTime,desc`,
  );

  return response.data;
}

export async function getEmployeeById(id: number): Promise<EmployeeType[]> {
  const response = await getFromEmployeeServer(`/employee/get/by/${id}`);

  return response.data;
}

export async function getEmployeeByName(name: string): Promise<EmployeeType[]> {
  const response = await getFromEmployeeServer(`/employee/get/by/${name}`);

  return response.data;
}

export async function getEmployeeListByDepartment(
  department: DepartmentType,
): Promise<EmployeeType[]> {
  const response = await getFromEmployeeServer(
    "/employee/get/by?department=" + department,
  );

  return response.data;
}

export async function getEmployeeListByLevel(
  level: LevelType,
): Promise<EmployeeType[]> {
  const response = await getFromEmployeeServer(`/employee/get/by/${level}`);

  return response.data;
}

export async function getEmployeeListByLevelLessThen(
  level: LevelType,
  page: number,
  size: number,
): Promise<PaginationResponse<EmployeeType>> {
  const response = await getFromEmployeeServer(
    `/employee/get/by/${level}/less/then?page=${page}&size=${size}&sort=insert_date_time,desc`,
  );

  return response.data;
}

export async function getEmployeeListByLevelGreaterThenEqual(
  page: number,
  size: number,
  level: LevelType,
): Promise<PaginationResponse<EmployeeType>> {
  const response = await getFromEmployeeServer(
    `/employee/get/by/${level}/greater/then?page=${page}&size=${size}&sort=insertDateTime,desc`,
  );

  return response.data;
}

export async function updateEmployee(
  employee: EmployeeType,
): Promise<EmployeeType> {
  const response = await updateToEmployeeServer("/employee/update", employee);

  return response.data;
}

export async function deleteEmployee(id: number): Promise<number> {
  const response = await deleteToEmployeeServer(`/employee/delete/by/${id}`);

  return response.data;
}
