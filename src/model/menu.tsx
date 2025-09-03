export type DashboardMenuType =
  | "notice"
  | "userManage"
  | "depositManage"
  | "siteManage"
  | "AdminMenu";

export interface DashBoardMenuType {
  label: string;
  type: DashboardMenuType;
}

/** 유저관리는 CryptoAccount Management를 일컫음. */
export const DashboardMenu: DashBoardMenuType[] = [
  { label: "공지사항", type: "notice" },
  {
    label: "유저관리",
    type: "userManage",
  },
  { label: "입금관리", type: "depositManage" },
  { label: "지갑관리", type: "siteManage" },
  { label: "관리자메뉴", type: "AdminMenu" },
];
