import { OutLine } from "../layouts/Layouts";
import { SimpleRadarChart } from "../statistics/visualization/Chart/Radar";
import styled from "@emotion/styled";
import { Theme } from "@emotion/react";
import { SimpleRadarChartType } from "../statistics/visualization/Chart";

export function MemberAbility(props: {
  windowWidth: number;
  theme: Theme;
  data: SimpleRadarChartType[];
}) {
  const { windowWidth, theme, data } = props;
  const isWide = windowWidth >= theme.windowSize.HD;

  return (
    <OutLine title="종합 평가 결과">
      <AbilityRadarChart
        width={isWide ? 220 : 240}
        height={isWide ? 134 : 200}
        outerRadius={isWide ? 48 : 80}
        data={data}
      />
    </OutLine>
  );
}

const AbilityRadarChart = styled(SimpleRadarChart)`
  transform: translateY(16%);
`;
