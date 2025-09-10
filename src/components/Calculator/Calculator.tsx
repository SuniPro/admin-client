/** @jsxImportSource @emotion/react */
import { CryptoType } from "@/model/financial";
import { css, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Input } from "@heroui/input";
import { Button, Select, SelectItem } from "@heroui/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import PercentIcon from "@mui/icons-material/Percent";
import { BigNumber } from "bignumber.js";
import { ErrorAlert } from "../Alert";
import { useQuery } from "@tanstack/react-query";
import { getExchangeInfo } from "@/api/financial";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { Container } from "../layouts/Frames";
import CalculateIcon from "@mui/icons-material/Calculate";

export function CalculatorButton(props: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const theme = useTheme();
  return (
    <StyledContainer>
      <Box theme={theme}>
        <label onClick={() => props.setOpen((prev) => !prev)}>
          <StyledIcon />
        </label>
      </Box>
    </StyledContainer>
  );
}

const StyledIcon = styled(CalculateIcon)(
  ({ theme }) => css`
    fill: ${theme.mode.textRevers};
  `,
);

const Box = styled(Button)<{ theme: Theme }>(
  ({ theme }) => css`
    width: 50px;
    min-width: 50px;
    height: 50px;
    min-height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${theme.mode.highlight};
    border-radius: 50%;
  `,
);

const StyledContainer = styled(Container)`
  position: fixed;
  bottom: 2%;
  right: 20px;
  width: 50px;
  height: 50px;
`;

export function Calculator() {
  const theme = useTheme();
  const [cryptoValue, setCryptoValue] = useState<BigNumber>(new BigNumber(0));
  const [krwValue, setKrwValue] = useState<number>(0);
  const [calculatorValue, setCalculatorValue] = useState<string>("");

  const [cryptoType, setCryptoType] = useState<CryptoType>("USDT");
  const [convert, setConvert] = useState<boolean>(false);

  const { data: exchangeInfo } = useQuery({
    queryKey: ["exchange", cryptoType],
    queryFn: () => getExchangeInfo(cryptoType),
    refetchInterval: 60000,
  });

  const handleChange = (val: string) => {
    if (/^[0-9+\-*/.]*$/.test(val)) {
      setCalculatorValue(val);
    }
  };

  const handleKrwKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && calculatorValue.trim()) {
      try {
        // 안전하게 eval 대신 Function 사용

        const result = Function(`"use strict";return (${calculatorValue})`)();
        if (typeof result === "number" && !isNaN(result)) {
          setKrwValue(result);
          setCalculatorValue(result.toString());
        }
      } catch {
        ErrorAlert("잘못된 수식입니다");
      }
    }
  };

  const handleCryptoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && calculatorValue.trim()) {
      try {
        const result = Function(`"use strict";return (${calculatorValue})`)();
        if (typeof result === "number" && !isNaN(result)) {
          setCryptoValue(new BigNumber(result));
          setCalculatorValue(result.toString());
        }
      } catch {
        ErrorAlert("잘못된 수식입니다");
      }
    }
  };

  useEffect(() => {
    const lastChar = calculatorValue[calculatorValue.length - 1];
    const lastLeftChar = calculatorValue[calculatorValue.length - 2];
    if ("+-*/".includes(lastChar) && "+-*/".includes(lastLeftChar)) {
      ErrorAlert("부호는 연속으로 입력할 수 없습니다");
      setCalculatorValue(calculatorValue.slice(0, calculatorValue.length - 1));
    }
  }, [calculatorValue]);

  const appendOperator = (op: string) => {
    if (!calculatorValue) {
      ErrorAlert("숫자 입력 후 부호를 넣으세요");
      return;
    }
    const lastChar = calculatorValue[calculatorValue.length - 1];
    const lastLeftChar = calculatorValue[calculatorValue.length - 2];
    if ("+-*/".includes(lastChar) && "+-*/".includes(lastLeftChar)) {
      ErrorAlert("부호는 연속으로 입력할 수 없습니다");
      return;
    }
    setCalculatorValue((prev) => prev + op);
  };

  useEffect(() => {
    if (exchangeInfo) {
      if (!convert && krwValue > 0) {
        // KRW -> Crypto
        setCryptoValue(
          new BigNumber(krwValue).dividedBy(exchangeInfo.closing_price),
        );
      }
      if (convert && cryptoValue.gt(0)) {
        // Crypto -> KRW
        setKrwValue(
          cryptoValue.multipliedBy(exchangeInfo.closing_price).toNumber(),
        );
      }
    }
  }, [exchangeInfo, krwValue, cryptoValue, convert]);

  return (
    <CalculatorWrapper theme={theme}>
      <CalculatorContainer>
        {!convert ? (
          <KrwToCrypto
            cryptoValue={cryptoValue}
            cryptoTypeState={{ cryptoType, setCryptoType }}
            calculatorValue={calculatorValue}
            handleChange={handleChange}
            handleKeyDown={handleKrwKeyDown}
          />
        ) : (
          <CryptoToKrw
            krwValue={krwValue}
            cryptoTypeState={{ cryptoType, setCryptoType }}
            calculatorValue={calculatorValue}
            handleChange={handleChange}
            handleKeyDown={handleCryptoKeyDown}
          />
        )}
        <Dial>
          <Button
            size="sm"
            variant="bordered"
            onPress={() => appendOperator("+")}
          >
            <AddIcon />
          </Button>
          <Button
            size="sm"
            variant="bordered"
            onPress={() => appendOperator("-")}
          >
            <RemoveIcon />
          </Button>
          <Button
            size="sm"
            variant="bordered"
            onPress={() => appendOperator("*")}
          >
            <CloseIcon />
          </Button>
          <Button
            size="sm"
            variant="bordered"
            onPress={() => appendOperator("/")}
          >
            <PercentIcon />
          </Button>
          <Button
            size="sm"
            variant="bordered"
            onPress={() => setConvert((prev) => !prev)}
          >
            <CurrencyExchangeIcon />
          </Button>
        </Dial>
      </CalculatorContainer>
    </CalculatorWrapper>
  );
}

interface CryptoTypeState {
  cryptoType: CryptoType;
  setCryptoType: Dispatch<SetStateAction<CryptoType>>;
}

function KrwToCrypto(props: {
  cryptoValue: BigNumber;
  cryptoTypeState: CryptoTypeState;
  calculatorValue: string;
  handleChange: (_val: string) => void;
  handleKeyDown: (_e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  const {
    cryptoValue,
    cryptoTypeState,
    calculatorValue,
    handleKeyDown,
    handleChange,
  } = props;
  const { cryptoType, setCryptoType } = cryptoTypeState;

  const theme = useTheme();

  return (
    <Display>
      <CryptoViewArea>
        <Input
          variant="underlined"
          label="암호화폐"
          type="number"
          value={cryptoValue.toString()}
          css={css`
            width: 70%;
          `}
        />
        <Select
          className="w-full"
          aria-labelledby="search-type-label"
          variant="bordered"
          selectedKeys={new Set([cryptoType])}
          label="화폐타입"
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0] as CryptoType | undefined;
            if (val) {
              setCryptoType(val);
            }
          }}
          css={css`
            width: 30%;

            span {
              color: ${theme.mode.textPrimary};
            }
          `}
        >
          {["USDT", "BTC", "ETH"].map((crypto) => (
            <SelectItem key={crypto}>{crypto}</SelectItem>
          ))}
        </Select>
      </CryptoViewArea>
      <Input
        label="원화 입력"
        variant="underlined"
        value={calculatorValue}
        onValueChange={handleChange}
        onKeyDown={handleKeyDown}
        inputMode="decimal"
        css={css`
          width: 100%;
        `}
      />
    </Display>
  );
}

function CryptoToKrw(props: {
  krwValue: number;
  cryptoTypeState: CryptoTypeState;
  calculatorValue: string;
  handleChange: (_val: string) => void;
  handleKeyDown: (_e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  const {
    krwValue,
    cryptoTypeState,
    calculatorValue,
    handleChange,
    handleKeyDown,
  } = props;
  const { cryptoType, setCryptoType } = cryptoTypeState;
  const theme = useTheme();

  return (
    <Display>
      <Input
        variant="underlined"
        label="원화"
        type="text"
        value={krwValue.toLocaleString("ko-KR")}
        css={css`
          width: 100%;
        `}
      />
      <CryptoViewArea>
        <Input
          label="암호화폐 입력"
          variant="underlined"
          value={calculatorValue}
          onValueChange={handleChange}
          onKeyDown={handleKeyDown}
          inputMode="decimal"
          css={css`
            width: 70%;
          `}
        />
        <Select
          className="w-full"
          variant="bordered"
          selectedKeys={new Set([cryptoType])}
          label="화폐타입"
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0] as CryptoType | undefined;
            if (val) {
              setCryptoType(val);
            }
          }}
          css={css`
            width: 30%;

            span {
              color: ${theme.mode.textPrimary};
            }
          `}
        >
          {["USDT", "BTC", "ETH"].map((crypto) => (
            <SelectItem key={crypto}>{crypto}</SelectItem>
          ))}
        </Select>
      </CryptoViewArea>
    </Display>
  );
}

const CalculatorWrapper = styled.article<{
  theme: Theme;
}>(
  ({ theme }) => css`
    position: absolute;
    right: 0;
    width: 350px;

    background-color: ${theme.mode.cardBackground};
    border-radius: ${theme.borderRadius.softBox};

    border: 1px solid ${theme.mode.textPrimary};
  `,
);

const CalculatorContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  box-sizing: border-box;

  padding: 10px;
`;

const Display = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const CryptoViewArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
`;

const Dial = styled.section`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  width: 100%;
  overflow: hidden; /* 넘치면 잘라내기 */
  box-sizing: border-box;
`;
