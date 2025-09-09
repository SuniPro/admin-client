import { Chain } from "@/hooks/useDetectChain";
import {
  CryptoAccountType,
  CryptoDepositType,
  CryptoMemoUpdateType,
  ExchangeInfo,
  NormalizedTransfer,
} from "../model/financial";
import { PaginationResponse } from "../model/pagination";
import {
  deleteToEmployeeServer,
  getFromCryptoTrackerServer,
  getFromEmployeeServer,
  patchToEmployeeServer,
  postToEmployeeServer,
  rangeFormatter,
} from "./base";
import { ValueType } from "rsuite/DateRangePicker";

export async function getExchangeInfo(
  cryptoType: "USDT" | "BTC" | "ETH",
): Promise<ExchangeInfo> {
  const response = await getFromCryptoTrackerServer(
    `/exchange/get?cryptoType=${cryptoType}`,
  );

  return response.data;
}

export async function updateMemo(
  updateInfo: CryptoMemoUpdateType,
): Promise<void> {
  await patchToEmployeeServer("/financial/update/memo", updateInfo);
}

export async function getAllCryptoAccountBySite(
  site: string,
  page: number,
  size: number,
): Promise<PaginationResponse<CryptoAccountType>> {
  const response = await getFromEmployeeServer(
    `/financial/get/crypto/account/by/site/${site}?page=${page}&size=${size}&sort=insertDateTime,desc`,
  );
  return response.data;
}

export async function getCryptoAccountByCryptoWallet(
  cryptoWallet: string,
): Promise<CryptoAccountType> {
  const response = await getFromEmployeeServer(
    `/financial/get/crypto/account/wallet/${cryptoWallet}`,
  );
  return response.data;
}

export async function getCryptoAccountByEmailAndSite(
  email: string,
  site: string,
): Promise<CryptoAccountType[]> {
  const response = await getFromEmployeeServer(
    `/financial/get/crypto/account/email/${email}/by/site/${site}`,
  );
  return response.data;
}

export async function getSendDepositsBySite(
  send: boolean,
  site: string,
  page: number,
  size: number,
): Promise<PaginationResponse<CryptoDepositType>> {
  const response = await getFromEmployeeServer(
    `/financial/get/crypto/deposit/send/${send}/by/site/${site}?page=${page}&size=${size}&sort=requestedAt,desc`,
  );

  return response.data;
}

export async function getDepositByAddressAndRangeAndSite(
  address: string,
  type: "to" | "from",
  isSend: boolean,
  site: string,
  page: number,
  size: number,
  range: ValueType,
) {
  const dateRangeValue = rangeFormatter(range);
  if (!dateRangeValue) return;
  if (address.length !== 0 && type === "to") {
    const response = await getFromEmployeeServer(
      `/financial/get/crypto/account/range/address/to/${address}/send/${isSend}/by/site/${site}?start=${dateRangeValue.start}&end=${dateRangeValue.end}&page=${page}&size=${size}&sort=requestedAt,desc`,
    );
    return response.data;
  } else if (address.length !== 0 && type === "from") {
    const response = await getFromEmployeeServer(
      `/financial/get/crypto/account/range/address/from/${address}/send/${isSend}/by/site/${site}?start=${dateRangeValue.start}&end=${dateRangeValue.end}&page=${page}&size=${size}&sort=requestedAt,desc`,
    );
    return response.data;
  }

  const response = await getFromEmployeeServer(
    `/financial/get/crypto/account/range/by/site/${site}?start=${dateRangeValue.start}&end=${dateRangeValue.end}&page=${page}&size=${size}&sort=requestedAt,desc`,
  );
  return response.data;
}

export async function updateSend(id: number, isSend: boolean) {
  const response = await patchToEmployeeServer("/financial/update/send", {
    id,
    isSend,
  });

  return response.data;
}

export async function updateCryptoWallet(
  cryptoWallet: string,
): Promise<CryptoAccountType> {
  const response = await patchToEmployeeServer("/financial/update/wallet", {
    cryptoWallet,
  });

  return response.data;
}

export async function createSentDeposit(
  deposit: CryptoDepositType,
): Promise<CryptoDepositType> {
  const response = await postToEmployeeServer(
    "/financial/create/crypto/deposit/sent",
    deposit,
  );
  return response.data;
}

export async function createNotSentDeposit(
  deposit: CryptoDepositType,
): Promise<CryptoDepositType> {
  const response = await postToEmployeeServer(
    "/financial/create/crypto/deposit/not/sent",
    deposit,
  );
  return response.data;
}

export async function deleteDepositById(depositId: number): Promise<void> {
  await deleteToEmployeeServer(`/financial/delete/deposit/${depositId}`);
}

/* Transfer List */
export async function getTransferList(
  address: string,
  chain: Chain,
): Promise<NormalizedTransfer[]> {
  const response = await getFromCryptoTrackerServer(
    `/transfer/get?chain=${chain}&address=${address}`,
  );

  return response.data;
}
