import {
  TetherAccountType,
  TetherAccountUpdateType,
  TetherDepositChangeStatusType,
  TetherDepositSummaryType,
  TetherDepositType,
  TransactionStatusType,
} from "../model/financial";
import { DateTime } from "luxon";
import { PaginationResponse } from "../model/pagination";
import {
  deleteToEmployeeServer,
  getFromEmployeeServer,
  getFromUserServer,
  patchToEmployeeServer,
} from "./base";
import { ValueType } from "rsuite/DateRangePicker";

export async function updateSite(
  updateInfo: TetherAccountUpdateType,
): Promise<void> {
  await patchToEmployeeServer("/financial/tether/update/site", updateInfo);
}

export async function updateMemo(
  updateInfo: TetherAccountUpdateType,
): Promise<void> {
  await patchToEmployeeServer("/financial/tether/update/memo", updateInfo);
}

export async function getTetherAccount(
  page: number,
  size: number,
  email: string | null | undefined,
): Promise<PaginationResponse<TetherAccountType>> {
  if (email) {
    const response = await getFromEmployeeServer(
      `/financial/tether/get/account/by/email/${email}?page=${page}&size=${size}&sort=insertDateTime,desc`,
    );
    return response.data;
  } else {
    const response = await getFromEmployeeServer(
      `/financial/tether/get/account/all?page=${page}&size=${size}&sort=insertDateTime,desc`,
    );
    return response.data;
  }
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
  acceptRequest: TetherDepositChangeStatusType,
): Promise<boolean> {
  const response = await patchToEmployeeServer(
    "/financial/tether/accept/deposit",
    acceptRequest,
  );

  return response.data;
}

export async function cancelDeposit(
  cancelRequest: TetherDepositChangeStatusType,
): Promise<boolean> {
  const response = await patchToEmployeeServer(
    "/financial/tether/cancel/deposit",
    cancelRequest,
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

export async function getDepositsByStatusOrEmailOrRange(
  status: TransactionStatusType,
  page: number,
  size: number,
  email: string | null | undefined,
  range: ValueType,
): Promise<PaginationResponse<TetherDepositType>> {
  const dateRangeValue = dateRange(range);
  if (email && range?.length == 0) {
    const response = await getFromEmployeeServer(
      `financial/tether/get/deposits/by/status/${status}/email/${email}`,
    );
    return response.data;
  } else if (!email && dateRangeValue) {
    const response = await getFromEmployeeServer(
      `/financial/tether/get/deposits/range/by/status/${status}?start=${dateRangeValue.start}&end=${dateRangeValue.end}&page=${page}&size=${size}&sort=requestedAt,desc`,
    );
    return response.data;
  } else if (email && dateRangeValue) {
    const response = await getFromEmployeeServer(
      `/financial/tether/get/deposits/range/by/status/${status}/email/${email}?start=${dateRangeValue.start}&end=${dateRangeValue.end}&page=${page}&size=${size}&sort=requestedAt,desc`,
    );
    return response.data;
  } else {
    const response = await getFromEmployeeServer(
      `/financial/tether/get/deposits/by/status/${status}?page=${page}&size=${size}&sort=requestedAt,desc`,
    );
    return response.data;
  }
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

export async function getTotalDepositSummaryByStatusAndEmail(
  status: TransactionStatusType,
  email: string | null | undefined,
  range: ValueType,
): Promise<TetherDepositSummaryType> {
  const dateRangeValue = dateRange(range);

  // 1. email 정규화 (null/undefined → "null" 문자열로 통일)
  const normalizedEmail = email ?? "null";

  // 2. URL 동적 생성
  const baseUrl = `/financial/tether/get/total/deposit/amount/by/status/${status}/email/${normalizedEmail}`;
  const queryParams = dateRangeValue
    ? `?start=${dateRangeValue.start}&end=${dateRangeValue.end}`
    : "";

  // 3. API 호출
  const response = await getFromEmployeeServer(`${baseUrl}${queryParams}`);
  return response.data;
}

const dateRange = (
  range: [(Date | undefined)?, (Date | undefined)?] | null,
) => {
  if (range && range[0] && range[1]) {
    const start = DateTime.fromJSDate(range[0])
      .setZone("Asia/Seoul")
      .set({ hour: 0, minute: 0, second: 0 })
      .toISO({ includeOffset: false });
    const end = DateTime.fromJSDate(range[1])
      .setZone("Asia/Seoul")
      .set({ hour: 23, minute: 59, second: 59 })
      .toISO({ includeOffset: false });

    if (start && end) {
      return { start, end };
    }
  }
};

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
