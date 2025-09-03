// src/utils/address-detect.ts
// 브라우저(Web Crypto)에서 동작. Node에서 쓰면 crypto.subtle 대체 필요.

import { useEffect, useState } from "react";
import { ErrorAlert } from "@/components/Alert";

export type Chain = "BTC" | "ETH" | "TRON" | null;

/* ---------- WebCrypto SHA-256 ---------- */
async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const h = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(h);
}

async function doubleSha256(data: Uint8Array): Promise<Uint8Array> {
  return sha256(await sha256(data));
}

/* ---------- Base58 & Base58Check ---------- */
// eslint-disable-next-line noSecrets/no-secrets
const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const B58MAP = new Map([...B58].map((c, i) => [c, i]));

function base58Decode(str: string): Uint8Array | null {
  if (!str || /[0OIl+\/]/.test(str)) return null; // 빠른 거절
  let x = 0n;
  for (const ch of str) {
    const v = B58MAP.get(ch);
    if (v === undefined) return null;
    x = x * 58n + BigInt(v);
  }
  // big integer -> bytes
  const bytes: number[] = [];
  while (x > 0n) {
    bytes.push(Number(x & 0xffn));
    x >>= 8n;
  }
  bytes.reverse();
  // leading zeros (for '1' chars)
  let leading = 0;
  for (const ch of str) {
    if (ch === "1") leading++;
    else break;
  }
  return new Uint8Array([...Array(leading).fill(0), ...bytes]);
}

async function verifyBase58Check(addr: string): Promise<Uint8Array | null> {
  const decoded = base58Decode(addr);
  if (!decoded || decoded.length < 4) return null;
  const payload = decoded.subarray(0, decoded.length - 4);
  const checksum = decoded.subarray(decoded.length - 4);
  const hash = await doubleSha256(payload);
  for (let i = 0; i < 4; i++)
    if (checksum[i as number] !== hash[i as number]) return null;
  return decoded; // [version|payload|checksum]
}

/* ---------- Bech32 (BTC bc1...) ---------- */
// 최소 구현 (BIP-0173)
// eslint-disable-next-line noSecrets/no-secrets
const BECH32_ALPH = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const BECH32_MAP = new Map([...BECH32_ALPH].map((c, i) => [c, i]));

function bech32Polymod(values: number[]) {
  const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let chk = 1;
  for (const v of values) {
    const top = chk >>> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i++) if ((top >>> i) & 1) chk ^= GEN[i as number];
  }
  return chk >>> 0;
}

function bech32HrpExpand(hrp: string) {
  const ret: number[] = [];
  for (const c of hrp) ret.push(c.charCodeAt(0) >>> 5);
  ret.push(0);
  for (const c of hrp) ret.push(c.charCodeAt(0) & 31);
  return ret;
}

function bech32Decode(addr: string): { hrp: string; data: number[] } | null {
  const lower = addr.toLowerCase();
  if (addr !== lower && addr !== addr.toUpperCase()) return null; // mixed case 금지
  const s = lower;
  const pos = s.lastIndexOf("1");
  if (pos < 1 || pos + 7 > s.length || s.length > 90) return null;
  const hrp = s.slice(0, pos);
  const dataPart = s.slice(pos + 1);
  const data: number[] = [];
  for (const ch of dataPart) {
    const v = BECH32_MAP.get(ch);
    if (v === undefined) return null;
    data.push(v);
  }
  // checksum 검증
  if (bech32Polymod([...bech32HrpExpand(hrp), ...data]) !== 1) return null;
  return { hrp, data: data.slice(0, -6) }; // 마지막 6개는 checksum
}

function bech32ConvertBits(
  data: number[],
  from: number,
  to: number,
  pad = true,
) {
  let acc = 0,
    bits = 0;
  const ret: number[] = [];
  const maxv = (1 << to) - 1;
  for (const value of data) {
    if (value < 0 || value >> from) return null;
    acc = (acc << from) | value;
    bits += from;
    while (bits >= to) {
      bits -= to;
      ret.push((acc >> bits) & maxv);
    }
  }
  if (pad) {
    if (bits) ret.push((acc << (to - bits)) & maxv);
  } else if (bits >= from || (acc << (to - bits)) & maxv) {
    return null;
  }
  return ret;
}

function isValidBtcBech32(addr: string): boolean {
  const dec = bech32Decode(addr);
  if (!dec) return false;
  const hrp = dec.hrp;
  if (hrp !== "bc" && hrp !== "tb") return false; // 메인/테스트넷
  const data = dec.data;
  const version = data[0];
  const prog = bech32ConvertBits(data.slice(1), 5, 8, false);
  if (!prog) return false;
  if (version < 0 || version > 16) return false;
  // v0: 20(P2WPKH) or 32(P2WSH), v1(Taproot): 32, 그 외 2..40 허용
  if (version === 0 && !(prog.length === 20 || prog.length === 32))
    return false;
  if (version === 1 && prog.length !== 32) return false;
  return !(prog.length < 2 || prog.length > 40);
}

/* ---------- ETH ---------- */
function isEthAddress(addr: string): boolean {
  if (!/^0x[0-9a-fA-F]{40}$/.test(addr)) return false;
  // EIP-55 체크섬까지 엄격히 하려면 라이브러리(ethers/viem) 사용 권장.
  return true;
}

/* ---------- TRON ---------- */
async function isTronAddress(addr: string): Promise<boolean> {
  // Hex 형식 (0x41 + 20바이트)
  if (/^0x?41[0-9a-fA-F]{40}$/.test(addr)) return true;
  // Base58Check 형식 (보통 'T'로 시작), payload 첫 바이트 0x41
  const decoded = await verifyBase58Check(addr);
  if (!decoded) return false;
  // payload = version(1) + body(20) => Tron은 첫 바이트가 0x41
  // (BlockCypher/Tron 문서에서는 21바이트 payload로 보기도 함. 여기선 앞 1바이트 체크)
  return decoded[0] === 0x41 && decoded.length === 25; // 1(version) + 20 + 4(checksum)
}

/* ---------- BTC ---------- */
async function isBtcAddress(addr: string): Promise<boolean> {
  // Base58Check (1..., 3...)
  if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(addr)) {
    const decoded = await verifyBase58Check(addr);
    if (!decoded) return false;
    const version = decoded[0]; // 0x00(P2PKH=1...), 0x05(P2SH=3...)
    return (version === 0x00 || version === 0x05) && decoded.length === 25;
  }
  // Bech32 (bc1..., tb1...)
  if (/^(bc1|BC1|tb1|TB1)/.test(addr)) {
    return isValidBtcBech32(addr);
  }
  return false;
}

/* ---------- Public API ---------- */
export async function detectChain(address: string): Promise<Chain> {
  const addr = address.trim();
  if (!addr) return null;

  // 빠른 ETH 체크
  if (isEthAddress(addr)) return "ETH";
  // BTC / TRON은 체크섬 검증(비동기)
  if (await isBtcAddress(addr)) return "BTC";
  if (await isTronAddress(addr)) return "TRON";
  return null;
}

export function useDetectChain(address: string) {
  const [chain, setChain] = useState<Chain>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function detect(address: string) {
    return await detectChain(address);
  }

  useEffect(() => {
    setLoading(true);
    detect(address)
      .then((r) => {
        setChain(r);
      })
      .catch(() => {
        ErrorAlert("올바른 지갑 주소를 입력해주세요.");
      })
      .finally(() => setLoading(false));
  }, [address]);

  return { chain, loading };
}
