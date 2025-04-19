import { ErrorAlert } from "../components/Alert/Alerts";
import {
  ExchangeInfoType,
  TetherAccountType,
  TetherDepositAcceptType,
  TetherDepositType,
  TransactionStatusType,
} from "../model/financial";
import { PaginationResponse } from "../model/pagination";
import { getFromEmployeeServer, patchToEmployeeServer } from "./base";
import axios from "axios";

export async function updateTetherWallet(
  tetherWallet: string,
): Promise<TetherAccountType> {
  const response = await patchToEmployeeServer(
    "/financial/tether/update/wallet",
    tetherWallet,
  );
  return response.data;
}

export async function approveDeposit(
  acceptRequest: TetherDepositAcceptType,
): Promise<boolean> {
  const response = await patchToEmployeeServer(
    "/financial/tether/accept/deposit",
    acceptRequest,
  );

  return response.data;
}

export async function getDepositsByAccountId(
  id: number,
): Promise<TetherDepositType[]> {
  const response = await getFromEmployeeServer(
    `/financial/tether/get/deposits/by/id/${id}`,
  );

  return response.data;
}

export async function getDepositsByStatus(
  status: TransactionStatusType,
  page: number,
  size: number,
): Promise<PaginationResponse<TetherDepositType>> {
  const response = await getFromEmployeeServer(
    `/financial/tether/get/deposits/by/status/${status}?page=${page}&size=${size}&sort=requestedAt,desc`,
  );

  return response.data;
}

export async function getDepositsByAccountIdAndStatus(
  id: number,
  status: TransactionStatusType,
): Promise<TetherDepositType[]> {
  const response = await getFromEmployeeServer(
    `/financial/tether/get/${status}/deposits/by/id/${id}`,
  );
  return response.data;
}

export async function getApprovedDepositsByTetherWallet(
  tetherWallet: string,
): Promise<TetherDepositType[]> {
  const response = await getFromEmployeeServer(
    `/financial/tether/get/approved/deposits/by/tether/wallet/${tetherWallet}`,
  );

  return response.data;
}

export async function getNonApprovedDepositsByTetherWallet(
  tetherWallet: string,
): Promise<TetherDepositType[]> {
  const response = await getFromEmployeeServer(
    `/financial/tether/get/non/approved/deposits/by/tether/wallet/${tetherWallet}`,
  );
  return response.data;
}

export async function getLatestDeposit(id: number): Promise<TetherDepositType> {
  const response = await getFromEmployeeServer(
    `/financial/tether/get/latest/deposit/by/id/${id}`,
  );
  return response.data;
}

export async function getLatestDepositByWallet(
  tetherWallet: string,
): Promise<TetherDepositType> {
  const response = await getFromEmployeeServer(
    `/financial/tether/get/latest/deposit/by/tether/wallet/${tetherWallet}`,
  );
  return response.data;
}

export async function getDepositsByDateRange(
  startDate: string,
  endDate: string,
): Promise<TetherDepositType[]> {
  const response = await getFromEmployeeServer(
    `/financial/tether/get/deposits/range?startDate=${startDate}&endDate=${endDate}`,
  );
  return response.data;
}

export async function getDepositsByWalletAndDateRange(
  tetherWallet: string,
  startDate: Date,
  endDate: Date,
): Promise<TetherDepositType[]> {
  const response = await getFromEmployeeServer(
    `/financial/tether/get/deposits/range/by/wallet/${tetherWallet}?startDate=${startDate}&endDate=${endDate}`,
  );
  return response.data;
}

export async function getTotalDepositAmountByStatus(
  status: TransactionStatusType,
): Promise<number> {
  const response = await getFromEmployeeServer(
    `/financial/tether/get/total/deposit/amount/by/status/${status}`,
  );

  return response.data;
}

export async function getTotalDepositAmountByStatusAndWallet(
  status: TransactionStatusType,
  tetherWallet: string,
): Promise<number> {
  const response = await getFromEmployeeServer(
    `/financial/tether/get/total/deposit/amount/by/status/${status}/wallet/${tetherWallet}`,
  );

  return response.data;
}

export async function getUsdToKrwRate(): Promise<ExchangeInfoType> {
  try {
    const response = await axios.get("https://api.frankfurter.app/latest", {
      params: {
        from: "USD",
        to: "KRW",
      },
    });

    return response.data;
  } catch {
    ErrorAlert("환율 조회에 실패하였습니다.");
    return null as unknown as ExchangeInfoType;
  }
}
