export interface EmployeeType {
  id: number;
  department: departmentType;
  level: levelType;
  name: string;
  insertName: string;
  insertDateTime: Date;
  updateName: string;
  updateDateTime: Date;
  deleteName: string;
  deleteDateTime: Date;
}

export interface SignUpFormType {
  name: string;
  password: string;
  department: departmentType;
  level: levelType;
  insertName: string;
}

export const departmentList = [
  "OFFICE",
  "HEAD",
  "ADMIN",
  "DEVELOPER",
  "ACCOUNTING",
] as const;

export type departmentType = (typeof departmentList)[number];

export const levelList = [
  "STAFF",
  "ASSOCIATE",
  "SENIORMANAGER",
  "OFFICEMANAGER",
  "MANAGER",
  "COO",
  "CFO",
  "CDO",
  "CTO",
  "CEO",
] as const;

export type levelType = (typeof levelList)[number];

export const departmentLabelMap: Record<departmentType, string> = {
  OFFICE: "영업",
  HEAD: "임원",
  ADMIN: "운영관리",
  DEVELOPER: "개발",
  ACCOUNTING: "재무",
};

export const levelLabelMap: Record<levelType, string> = {
  STAFF: "사원",
  ASSOCIATE: "주임",
  SENIORMANAGER: "차장",
  OFFICEMANAGER: "팀장",
  MANAGER: "총괄팀장",
  COO: "운영책임자",
  CFO: "재무책임자",
  CDO: "기술운영책임자",
  CTO: "기술책임자",
  CEO: "대표",
};
