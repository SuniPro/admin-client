import { postToEmployeeServer } from "./base";

export type LinkToken = { site: string; link: string };

export async function issueLinkToken(): Promise<LinkToken> {
  const response = await postToEmployeeServer("/link-token", {});

  return response.data;
}

export async function unlink() {
  await postToEmployeeServer("/unlink", {});
}
