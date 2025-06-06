export interface EmployeeType {
  id: number;
  department: DepartmentType;
  level: LevelType;
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
  "COO",
  "CFO",
  "CDO",
  "CTO",
  "CEO",
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
  COO: "운영책임자",
  CFO: "재무책임자",
  CDO: "기술운영책임자",
  CTO: "기술책임자",
  CEO: "대표",
};

export function getLevelNameByRank(rank: number): string | undefined {
  const levelMap: Record<number, string> = {
    1: "STAFF",
    2: "ASSOCIATE",
    3: "SENIORMANAGER",
    4: "OFFICEMANAGER",
    5: "MANAGER",
    6: "CTO",
    7: "CDO",
    8: "CIO",
    9: "CFO",
    10: "COO",
    11: "CEO",
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
