import { SiteOnlyType, SiteType, SiteWalletInfoType } from "@/model/site";
import { getFromEmployeeServer, patchToEmployeeServer } from "./base";
import { PaginationResponse } from "@/model/pagination";
import { ChainType } from "@/model/financial";

export async function getSite(site: string): Promise<SiteType> {
  const response = await getFromEmployeeServer(`/site/get/${site}`);

  return response.data;
}

export async function getAll(): Promise<SiteType[]> {
  const response = await getFromEmployeeServer(`/site/get/all`);

  return response.data;
}

export async function getAllThroughPage(
  page: number,
  size: number,
): Promise<PaginationResponse<SiteType>> {
  const response = await getFromEmployeeServer(
    `/site/get/all/through/page?page=${page}&size=${size}&sort=insertDateTime,desc`,
  );

  return response.data;
}

export async function updateOnlySite(
  id: number,
  site: string,
): Promise<SiteOnlyType> {
  const response = await patchToEmployeeServer(`/site/update/only/site`, {
    id,
    site,
  });

  return response.data;
}

export async function updateOnlyWallet(
  id: number,
  cryptoWallet: string,
  chainType: ChainType,
): Promise<SiteOnlyType> {
  const response = await patchToEmployeeServer(`/site/update/only/site`, {
    id,
    cryptoWallet,
    chainType,
  });

  return response.data;
}

export async function getSiteWalletInfoBySite(): Promise<SiteWalletInfoType[]> {
  const response = await getFromEmployeeServer("/site/get/wallet/info");

  return response.data;
}
