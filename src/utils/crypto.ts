import { ChainType, CryptoType } from "@/model/financial";

export const chainToDecimal = (chainType: ChainType) => {
  switch (chainType) {
    case "BTC":
      return 1e8;
    case "ETH":
      return 1e18;
    case "TRON":
      return 6;
  }
};

export const cryptoToDecimal = (chainType: CryptoType) => {
  switch (chainType) {
    case "BTC":
      return 1e8;
    case "ETH":
      return 1e18;
    case "USDT":
      return 6;
  }
};
