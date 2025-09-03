import { ChainType } from "./financial";

export interface SiteType {
  id: number;
  site: string;
  siteWalletList: SiteWalletType[];
  telegramUsername: string;
  telegramChatId: number;
  insertDateTime: string;
  insertId: string;
  updateDateTime: string | null;
  updateId: string | null;
  deleteDateTime: string | null;
  deleteId: string | null;
}

export interface SiteOnlyType {
  id: number;
  site: string;
  telegramUsername: string;
  telegramChatId: number;
  insertDateTime: string;
  insertId: string;
  updateDateTime: string | null;
  updateId: string | null;
  deleteDateTime: string | null;
  deleteId: string | null;
}

export interface SiteWalletType {
  id: number;
  cryptoWallet: string;
  chainType: ChainType;
}

export interface SiteWalletInfoType {
  id: number;
  cryptoWallet: string;
  chainType: ChainType;
  balance: string;
  depositHistoryLength: number;
  todayDepositAmount: string;
  weeksDepositAmount: string;
  insertDateTime: string;
  updateDateTime: string;
}
