import { WorkMenuListType, WorkTableType } from "../model/workTable";
import { getFromEmployeeServer, postToEmployeeServer } from "./base";

export async function createOrUpdate(
  id: number,
  workMenuList: WorkMenuListType[],
): Promise<WorkTableType> {
  const response = await postToEmployeeServer("/work/create", {
    id,
    workMenuList,
  });

  return response.data;
}

export async function getById(id: number): Promise<WorkTableType> {
  const response = await getFromEmployeeServer(`/work/get/by/id/${id}`);

  return response.data;
}

export async function getByName(name: number): Promise<WorkTableType> {
  const response = await getFromEmployeeServer(`/work/get/by/name/${name}`);

  return response.data;
}
