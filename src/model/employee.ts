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
  insertName: string;
  insertDateTime: string;
  updateName: string;
  updateDateTime: string;
}

export interface SignUpFormType {
  name: string;
  password: string;
  department: DepartmentType;
  level: LevelType;
  insertName: string;
}

export const departmentList = [
  "OFFICE",
  "HEAD",
  "ADMIN",
  "DEVELOPER",
  "ACCOUNTING",
] as const;

export type DepartmentType = (typeof departmentList)[number];

export const levelList = [
  "STAFF",
  "ASSOCIATE",
  "SENIORMANAGER",
  "OFFICEMANAGER",
  "MANAGER",
  "ADMINISTRATOR",
] as const;

export type LevelType = (typeof levelList)[number];

export const departmentLabelMap: Record<DepartmentType, string> = {
  OFFICE: "영업",
  HEAD: "임원",
  ADMIN: "운영관리",
  DEVELOPER: "개발",
  ACCOUNTING: "재무",
};

export const levelLabelMap: Record<LevelType, string> = {
  STAFF: "사원",
  ASSOCIATE: "주임",
  SENIORMANAGER: "차장",
  OFFICEMANAGER: "팀장",
  MANAGER: "총괄팀장",
  ADMINISTRATOR: "관리자",
};

export function getLevelNameByRank(rank: number): string | undefined {
  const levelMap: Record<number, string> = {
    1: "STAFF",
    2: "ASSOCIATE",
    3: "SENIORMANAGER",
    4: "OFFICEMANAGER",
    5: "MANAGER",
    6: "ADMINISTRATOR",
  };

  return levelMap[rank as number];
}

export function getRankByLevelName(levelName: string): number {
  const nameToRankMap: Record<string, number> = {
    STAFF: 1,
    ASSOCIATE: 2,
    SENIORMANAGER: 3,
    OFFICEMANAGER: 4,
    MANAGER: 5,
    CTO: 6,
    CDO: 7,
    CIO: 8,
    CFO: 9,
    COO: 10,
    CEO: 11,
  };

  return nameToRankMap[levelName.toUpperCase()];
}
