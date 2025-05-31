import { DepartmentType, LevelType } from "./employee";

export interface WorkTableType {
  id: number;
  name: string;
  department: DepartmentType;
  level: LevelType;
  workMenuList: workMenuType[];
}

export const workMenuList = [
  "MANAGE_EMPLOYEE",
  "REVIEW_EMPLOYEE",
  "MANAGE_TETHER",
  "MANAGE_TETHER_DEPOSIT",
  "NOTIFY",
] as const;

export type workMenuType = typeof workMenuList;

export type WorkMenuListType = (typeof workMenuList)[number];

export const WorkMenuLabelMap: Record<WorkMenuListType, string> = {
  MANAGE_EMPLOYEE: "직원관리",
  REVIEW_EMPLOYEE: "직원평가",
  MANAGE_TETHER: "테더관리",
  MANAGE_TETHER_DEPOSIT: "테더 입금관리",
  NOTIFY: "공지사항",
};
