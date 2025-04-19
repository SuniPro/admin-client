import { levelType } from "./employee";

export interface NotifyType {
  id: number;
  level: levelType;
  writer: string;
  title: string;
  contents: string;
  insertDateTime?: string;
  updateDateTime?: string;
  deletedDateTime?: string;
}

export interface NotifyWithReadType {
  id: number;
  title: string;
  contents: string;
  read: boolean;
  readTime: string;
}
