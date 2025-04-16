/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Pointer from "./Pointer";
import styled from "@emotion/styled";
import { AnalogMeterBackground, Star } from "./AlalogMeterImage";

export interface AnalogMeterProps {
  /** 계기판 표시 최대값 */
  maxValue: number;
  unit: string;
  /** 별 포인터의 데이터 값 */
  starValue?: number;
  /** 원 포인터의 데이터 값 */
  circleValue: number;
}

/** 별과 원 모양의 포인터를 가지는 계기판 컴포넌트입니다. */
export default function AnalogMeter(props: AnalogMeterProps) {
  const { maxValue, unit, starValue, circleValue } = props;
  const theme = useTheme();

  const starAngle = maxValue === 0 ? 0 : ((starValue ?? 0) / maxValue) * 180;
  const circleAngle = maxValue === 0 ? 0 : (circleValue / maxValue) * 180;

  return (
    <Container>
      <Meter>
        <AnalogMeterBackground />
        {Boolean(starValue) && (
          <Pointer
            angle={starAngle}
            color={theme.mode.textSecondary}
            length={60}
            icon={<Star />}
          />
        )}
        <Pointer
          angle={circleAngle}
          color={theme.mode.textAccent}
          length={80}
          icon={
            <div
              css={css`
                box-sizing: content-box;
                width: 8px;
                height: 8px;
                background-color: ${theme.mode.textAccent};
                border-radius: 50%;
                border: 3px solid ${theme.mode.textAccent};
              `}
            />
          }
          iconTranslate="translateX(4px) translateY(-0.5px)"
        />
        <Origin />
      </Meter>
      <Indicator>
        <Label>0{unit}</Label>
        <Label>
          {maxValue === 0 ? 100 : maxValue}
          {unit}
        </Label>
      </Indicator>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: 8px;
`;

const Meter = styled.div`
  position: relative;
  width: 200px;
  height: 100px;
`;

const Origin = styled.div(
  ({ theme }) => css`
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%) translateY(50%);
    background-color: ${theme.mode.textAccent};
    width: 20px;
    height: 20px;
    border-radius: 50%;
  `,
);

const Indicator = styled.div`
  display: flex;
  width: 200px;
  justify-content: space-between;
`;

const Label = styled.div(
  ({ theme }) => css`
    color: ${theme.mode.textSecondary};
    /* Default/Label/12px-Md */
    font-family: ${theme.mode.font.component.itemDescription};
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px; /* 133.333% */
  `,
);
