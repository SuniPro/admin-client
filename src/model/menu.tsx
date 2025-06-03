export type DashboardMenuType =
  | "employeeList"
  | "workTable"
  | "notice"
  | "report";

export interface DashBoardMenuType {
  label: string;
  type: DashboardMenuType;
}

export const DashboardMenu: DashBoardMenuType[] = [
  { label: "공지사항", type: "notice" },
  {
    label: "직원관리",
    type: "employeeList",
  },
  { label: "업무관리", type: "workTable" },
  { label: "일일보고", type: "report" },
  { label: "스케쥴", type: "employeeList" },
];
