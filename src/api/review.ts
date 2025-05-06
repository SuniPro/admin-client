import { getFromEmployeeServer, postToEmployeeServer } from "./base";
import {
  AbilityReviewType,
  EmployeeAbilityType,
  WorkBalanceType,
} from "../model/review";
import { DepartmentType, LevelType } from "../model/employee";
import { PaginationResponse } from "../model/pagination";

export async function getCommutes(id: number): Promise<WorkBalanceType[]> {
  const response = await getFromEmployeeServer(`/review/get/commutes/by/${id}`);

  return response.data;
}

export async function getAbilitySet(
  employeeId: number,
): Promise<EmployeeAbilityType> {
  const response = await getFromEmployeeServer(
    `/review/get/ability/set/by/${employeeId}`,
  );

  return response.data;
}

export async function getAbilityTargetEmployeeList(
  level: LevelType,
  department: DepartmentType,
  page: number,
  size: number,
): Promise<PaginationResponse<AbilityReviewType>> {
  const response = await getFromEmployeeServer(
    `/review/get/ability/target/employee/list/by/level/${level}/and/department/${department}?page=${page}&size=${size}&sort=review_date,desc`,
  );

  return response.data;
}

export async function createAbility(
  abilityList: AbilityReviewType[],
): Promise<string[]> {
  const response = await postToEmployeeServer(
    "/review/create/ability",
    abilityList,
  );

  return response.data;
}
