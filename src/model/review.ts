import { EmployeeType } from "./employee";

export interface WorkBalanceType {
  employeeId: number;
  workBalance: number;
  date: string;
}

export interface EmployeeAbilityType {
  employeeId: number;
  ability: AbilityType;
  employeesAbilityList: AbilityType[];
}

export interface AbilityType {
  id: number;
  employee: EmployeeType;
  attitude: number;
  creativity: number;
  workPerformance: number;
  teamwork: number;
  knowledgeLevel: number;
}

export const abilityList = [
  "attitude",
  "creativity",
  "workPerformance",
  "teamwork",
  "knowledgeLevel",
] as const;

export type abilityType = (typeof abilityList)[number];

export const abilityLabelMap: Record<abilityType, string> = {
  attitude: "태도",
  creativity: "창의력",
  workPerformance: "수행능력",
  teamwork: "협동심",
  knowledgeLevel: "지식",
};
