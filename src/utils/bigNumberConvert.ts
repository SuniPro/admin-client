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
