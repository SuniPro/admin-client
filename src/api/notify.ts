import { LevelType } from "../model/employee";
import { NotifyType, NotifyWithReadType } from "../model/notify";
import {
  deleteToEmployeeServer,
  getFromEmployeeServer,
  patchToEmployeeServer,
  postToEmployeeServer,
  putToEmployeeServer,
} from "./base";

export async function createNotify(notify: NotifyType): Promise<NotifyType> {
  const response = await postToEmployeeServer("/notify/create", notify);
  return response.data;
}

export async function updateNotify(notify: NotifyType): Promise<NotifyType> {
  const response = await putToEmployeeServer("/notify/update", notify);
  return response.data;
}

export async function getAllNotifyList(): Promise<NotifyType[]> {
  const response = await getFromEmployeeServer("/notify/get/all");
  return response.data;
}

export async function getNotifyById(id: number): Promise<NotifyType> {
  const response = await getFromEmployeeServer(`/notify/get/by/id/${id}`);
  return response.data;
}

export async function getNotifyByLevel(
  level: LevelType,
): Promise<NotifyType[]> {
  const response = await getFromEmployeeServer(`/notify/get/by/level/${level}`);
  return response.data;
}

export async function getLatestNotify(): Promise<NotifyType> {
  const response = await getFromEmployeeServer("/notify/get/latest");

  return response.data;
}

export async function getNotifyWithRead(
  id: number,
  level: LevelType,
): Promise<NotifyWithReadType> {
  const response = await getFromEmployeeServer(
    `/notify/get/all/with/read/${id}/${level}`,
  );
  return response.data;
}

export async function deleteNotify(id: number): Promise<void> {
  const response = await deleteToEmployeeServer(`/notify/delete/${id}`);
  return response.data;
}

export async function readNotify(
  id: number,
  employeeId: number,
): Promise<void> {
  const response = await patchToEmployeeServer(
    `/notify/read/${id}/${employeeId}`,
    null,
  );
  return response.data;
}

export async function isNotifyRead(
  id: number,
  employeeId: number,
): Promise<boolean> {
  const response = await getFromEmployeeServer(
    `/notify/read/about/notify/${id}/${employeeId}`,
  );

  return response.data;
}

export async function getCountUnReadAboutNotify(
  id: number,
  level: LevelType,
): Promise<number> {
  const response = await getFromEmployeeServer(
    `/notify/count/notify/${id}/${level}`,
  );
  return response.data;
}

export async function getNotifyListByReadEmployee(
  employeeId: number,
  level: LevelType,
): Promise<NotifyType[]> {
  const response = await getFromEmployeeServer(
    `/notify/get/read/${employeeId}/${level}`,
  );

  return response.data;
}

export async function getNotifyListByUnReadEmployee(
  employeeId: number,
  level: LevelType,
): Promise<NotifyType[]> {
  const response = await getFromEmployeeServer(
    `/notify/get/unread/${employeeId}/${level}`,
  );

  return response.data;
}
