export interface TetherAccountType {
  id: number;
  tetherWallet: string;
  email: string;
  insertDateTime: string;
  updateDateTime?: string;
  deleteDateTime?: string;
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
  insertDateTime: string;
  amount: number;
  usdtAmount: number;
  accepted: boolean;
  acceptedAt: string;
  requestedAt: string;
  status: TransactionStatusType;
}

export interface ExchangeInfoType {
  amount: number;
  base: string;
  date: string;
  rates: ExchangeRatesType;
}

export interface TetherDepositAcceptType {
  depositId: number;
  tetherWallet: string;
  amount: number;
}

interface ExchangeRatesType {
  KRW: number;
}

export const TransactionStatus = [
  "PENDING", // 요청
  "PROCESSING", // 지갑 처리 중
  "CONFIRMED", // 블록에 포함됨
  "FAILED", // 블록 전송 실패
  "CANCELLED", // 관리자 취소
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
  { status: "PROCESSING", label: "처리 중" },
  { status: "CONFIRMED", label: "승인" },
  { status: "FAILED", label: "실패" },
  { status: "CANCELLED", label: "반려" },
  { status: "TIMEOUT", label: "시간초과" },
];
