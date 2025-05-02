import {
  TetherAccountType,
  TetherDepositAcceptType,
  TetherDepositType,
  TransactionStatusType,
} from "../model/financial";
import { PaginationResponse } from "../model/pagination";
import {
  deleteToEmployeeServer,
  getFromEmployeeServer,
  getFromUserServer,
  patchToEmployeeServer,
} from "./base";

export async function getAllTetherAccounts(
  page: number,
  size: number,
): Promise<PaginationResponse<TetherAccountType>> {
  const response = await getFromEmployeeServer(
    `/financial/tether/get/account/all?page=${page}&size=${size}&sort=insertDateTime,desc`,
  );

  return response.data;
}

export async function updateTetherWallet(
  id: number,
  tetherWallet: string,
): Promise<TetherAccountType> {
  const response = await patchToEmployeeServer(
    "/financial/tether/update/wallet",
    { id, tetherWallet },
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

export async function deleteDepositById(depositId: number): Promise<void> {
  await deleteToEmployeeServer(
    `/financial/tether/delete/deposit/by/id/${depositId}`,
  );
}

export async function getExchangeInfo(): Promise<number> {
  const response = await getFromUserServer("/financial/exchange");

  return response.data;
}
