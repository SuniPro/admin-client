import { BigNumber } from "bignumber.js";

export function formatUnits(
  value: BigNumber.Value,
  decimals: number,
  maxDp = 8,
) {
  return new BigNumber(value)
    .shiftedBy(-decimals)
    .decimalPlaces(maxDp, BigNumber.ROUND_DOWN)
    .toFormat();
}

export function parseUnits(value: BigNumber.Value, decimals: number) {
  // 사람이 읽는 값 → base units
  return new BigNumber(value).shiftedBy(decimals).toFixed(0);
}
