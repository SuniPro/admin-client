/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import { OutLine } from "../../layouts/Layouts";
import AnalogMeter from "../../AnalogMeter";
import styled from "@emotion/styled";

export function DepositAcceptRateMeter(props: {
  starValue?: number | null;
  circleValue?: number | null;
}) {
  const theme = useTheme();
  const { starValue, circleValue } = props;
  const star =
    starValue === null || starValue === undefined
      ? 0
      : Math.round(starValue * 100) / 10;
  const circle =
    circleValue === null || circleValue === undefined
      ? 0
      : Math.round(circleValue * 100) / 10;
  return (
    <OutLine
      title="입금 승인 진행율"
      css={css`
        gap: 14px;
      `}
    >
      <div
        css={css`
          display: flex;
          gap: 40px;
        `}
      >
        <AnalogMeter
          maxValue={Math.min(100, Math.ceil(Math.max(star, circle) * 1.25))}
          unit="%"
          starValue={star}
          circleValue={circle}
        />
        <div
          css={css`
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: 1 0 0;
          `}
        >
          <Data>
            <CircleData>
              <div
                css={css`
                  width: 12px;
                  height: 12px;
                  background-color: ${theme.mode.textAccent};
                  border-radius: 50%;
                `}
              />
              {circle}%
            </CircleData>
          </Data>
          <Description>
            요청된 입금에 대한
            <br />
            승인 진행율입니다.
          </Description>
        </div>
      </div>
    </OutLine>
  );
}

const Data = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CircleData = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: 4px;
    align-items: center;
    color: ${theme.mode.textAccent};
    /* Default/Heading/24px-Rg */
    font-family: ${theme.mode.font.component.itemDescription};
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 32px; /* 133.333% */
  `,
);

const Description = styled.div(
  ({ theme }) => css`
    color: ${theme.mode.textSecondary};
    /* Default/Paragraph/12px-Rg */
    font-family: ${theme.mode.font.component.itemDescription};
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 166.667% */
    text-align: left;
  `,
);
