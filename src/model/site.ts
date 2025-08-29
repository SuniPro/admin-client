import { ChainType } from "./financial";

export interface SiteResponseType {
  id: number;
  site: string;
  cryptoWallet: string;
  chainType: ChainType;
  insertDateTime: string;
  insertId: string;
  updateDateTime: string | null;
  updateId: string | null;
  deleteDateTime: string | null;
  deleteId: string | null;
}
