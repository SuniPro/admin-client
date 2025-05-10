import { Decimal } from "decimal.js";

export interface TetherAccountType {
  id: number;
  tetherWallet: string;
  email: string;
  site?: string | null;
  memo?: string | null;
  insertDateTime: string;
  updateDateTime?: string;
  deleteDateTime?: string;
}

export interface TetherAccountUpdateType {
  id: number;
  site?: string | null;
  memo?: string | null;
}

export interface TetherCreateRequestType {
  email: string;
  tetherWallet: string;
}

export interface TetherDepositRequestType {
  tetherWallet: string;
  amount: number;
}

export interface TetherDepositType {
  id: number;
  tetherWallet: string;
  email: string;
  site?: string | null;
  memo?: string | null;
  insertDateTime: string;
  amount: Decimal;
  usdtAmount: Decimal;
  accepted: boolean;
  acceptedAt: string;
  requestedAt: string;
  status: TransactionStatusType;
}

export interface TetherDepositSummaryType {
  totalAmount: Decimal;
  depositLength: number;
  maximumDepositor: string;
  maximumAmount: Decimal;
}

export interface ExchangeInfoType {
  amount: number;
  base: string;
  date: string;
  rates: ExchangeRatesType;
}

export interface TetherDepositChangeStatusType {
  depositId: number;
  tetherWallet: string;
  amount: string;
}

interface ExchangeRatesType {
  KRW: number;
}

export const TransactionStatus = [
  "PENDING", // 요청
  "PROCESSING", // 지갑 처리 중
  "CONFIRMED", // 블록에 포함됨
  "CANCELLED", // 관리자 취소
  "FAILED", // 블록 전송 실패
  "TIMEOUT", // 시간 초과
];

export type TransactionStatusType = (typeof TransactionStatus)[number];

export const transactionStatusLabelMap: Record<TransactionStatusType, string> =
  {
    PENDING: "요청",
    PROCESSING: "처리 중",
    CONFIRMED: "승인",
    FAILED: "실패",
    CANCELLED: "반려",
    TIMEOUT: "요청시간 초과",
  };

export const statusNavigationMenu = [
  { status: "PENDING", label: "요청" },
  { status: "CONFIRMED", label: "승인" },
  { status: "CANCELLED", label: "반려" },
  { status: "PROCESSING", label: "처리 중" },
  { status: "FAILED", label: "실패" },
  { status: "TIMEOUT", label: "시간초과" },
];
