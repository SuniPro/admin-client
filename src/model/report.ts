import { EmployeeType } from "./employee";

export interface ReportType {
  id: number;
  employee: EmployeeType;
  title: string;
  reportContents: string;
  insertDateTime: string;
  updateDateTime?: string | null;
}
