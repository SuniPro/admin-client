import { ReportType } from "../model/report";
import {
  deleteToEmployeeServer,
  getFromEmployeeServer,
  postToEmployeeServer,
  putToEmployeeServer,
  rangeFormatter,
} from "./base";
import { ValueType } from "rsuite/DateRangePicker";

export async function createReport(report: ReportType) {
  const response = await postToEmployeeServer(`/report/create`, report);

  return response.data;
}

export async function updateReport(report: ReportType) {
  const response = await putToEmployeeServer(`/report/create`, report);

  return response.data;
}

export async function deleteReport(reportId: number) {
  const response = await deleteToEmployeeServer(`/report/delete/${reportId}`);

  return response.data;
}

export async function getReportsByLevel(
  level: string,
  employeeId: number,
  page: number,
  size: number,
  range: ValueType,
) {
  const dateRangeValue = rangeFormatter(range);
  if (!dateRangeValue) return;
  const response = await getFromEmployeeServer(
    `/report/get/by/level/${level}/employeeId/${employeeId}?start=${dateRangeValue.start}&end=${dateRangeValue.end}&page=${page}&size=${size}&sort=insertDateTime,desc`,
  );

  return response.data;
}

export async function getReportsByLevelAndName(
  level: string,
  employeeName: string,
  employeeId: number,
) {
  const response = await getFromEmployeeServer(
    `/report/get/by/level/${level}/employeeName/${employeeName}/employeeId/${employeeId}`,
  );

  return response.data;
}
