import { getExchangeInfo } from "@/api/financial";
import { ChainType } from "@/model/financial";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "bignumber.js";

export function useExchange(
  amount: string,
  chainType: ChainType,
  decimal: 1e8 | 1e18 | 6,
) {
  const [currentPrice, setCurrentPrice] = useState<BigNumber>(new BigNumber(0));
  const [cryptoAmount, setCryptoAmount] = useState<BigNumber>(new BigNumber(0));
  const [krwAmount, setKrwAmount] = useState<string>("");

  const crypto = () => {
    switch (chainType) {
      case "TRON":
        return "USDT";
      case "ETH":
        return "ETH";
      case "BTC":
        return "BTC";
    }
  };

  const { data: exchangeInfo } = useQuery({
    queryKey: ["exchange", chainType],
    queryFn: () => getExchangeInfo(crypto()),
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (!exchangeInfo) return;
    setCurrentPrice(exchangeInfo.closing_price);
    const amountFloored = new BigNumber(amount).decimalPlaces(
      decimal,
      BigNumber.ROUND_DOWN,
    );
    setCryptoAmount(amountFloored);
    setKrwAmount(
      amountFloored
        .multipliedBy(exchangeInfo.closing_price)
        .toNumber()
        .toLocaleString("ko-KR"),
    );
  }, [amount, decimal, exchangeInfo]);

  return { currentPrice, cryptoAmount, krwAmount };
}
