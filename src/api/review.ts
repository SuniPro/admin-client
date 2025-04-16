import { getFromEmployeeServer } from "./base";
import { EmployeeAbilityType, WorkBalanceType } from "../model/review";

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
