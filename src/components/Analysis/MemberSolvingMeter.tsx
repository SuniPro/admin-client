/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { OutLine } from "../layouts/Layouts";
import AnalogMeter from "../AnalogMeter/AnalogMeter";
import { Star } from "../AnalogMeter/AlalogMeterImage";

export function MemberSolvingMeter(props: {
  starValue: number | null;
  circleValue: number | null;
}) {
  const theme = useTheme();
  const { starValue, circleValue } = props;
  const star = starValue === null ? 0 : Math.round(starValue * 100) / 10;
  const circle = circleValue === null ? 0 : Math.round(circleValue * 100) / 10;
  return (
    <OutLine
      title="업무 수행률"
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
            <StarData>
              <Star />
              소속 직원 평균 {star}%
            </StarData>
          </Data>
          <Description>
            이 구성원과 소속 직원들의
            <br />
            평가를 분석할 수 있는 지표입니다.
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

const StarData = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: 4px;
    align-items: center;
    color: ${theme.mode.textPrimary};
    /* Default/Label/12px-Eb */
    font-family: ${theme.mode.font.component.itemDescription};
    font-size: 12px;
    font-style: normal;
    font-weight: 800;
    line-height: 16px; /* 133.333% */

    path {
      fill: ${theme.mode.textPrimary};
    }
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
