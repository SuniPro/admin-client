import { ChainType } from "@/model/financial";

export interface EmployeeInfoType {
  name: string;
  department: DepartmentType;
  level: LevelType;
  site: string;
}

export interface EmployeeType {
  id: number;
  department: DepartmentType;
  level: LevelType;
  name: string;
  insertName: string;
  insertDateTime: string;
  updateName: string;
  updateDateTime: string;
  deleteName: string;
  deleteDateTime: string;
}

export interface UpdateEmployeeType {
  id: number;
  department: DepartmentType;
  level: LevelType;
  name: string;
  password: string;
}

export type siteWalletType = {
  id: string;
  cryptoWallet: string;
  chainType: ChainType;
};

export interface SignUpFormType {
  name: string;
  password: string;
  department: DepartmentType;
  level: LevelType;
  site: string;
  siteWalletList: { cryptoWallet: string; chainType: ChainType }[];
}

export const departmentList = ["ADMIN", "DEVELOPER", "ACCOUNTING"] as const;

export type DepartmentType = (typeof departmentList)[number];

export const levelList = ["STAFF", "MANAGER", "ADMINISTRATOR"] as const;

export type LevelType = (typeof levelList)[number];

export const departmentLabelMap: Record<DepartmentType, string> = {
  ADMIN: "운영관리",
  DEVELOPER: "개발",
  ACCOUNTING: "재무",
};

export const levelLabelMap: Record<LevelType, string> = {
  STAFF: "직원",
  MANAGER: "총괄팀장",
  ADMINISTRATOR: "관리자",
};
