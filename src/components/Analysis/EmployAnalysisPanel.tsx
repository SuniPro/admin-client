import styled from "@emotion/styled";
import { Container } from "../layouts/Frames/FrameLayouts";
import { css, Theme, useTheme } from "@emotion/react";
import {
  SimpleBarChartType,
  SimpleRadarChartType,
} from "../statistics/visualization/Chart";
import { MemberWorkBalance } from "./MemberWorkBalance";
import { MemberAbility } from "./MemberAbility";
import { MemberSolvingMeter } from "./MemberSolvingMeter";
import { MemberSolvingMeterEmpty } from "./MemberSolvingMeterEmpty";
import { useWindowContext } from "../../context/WindowContext";
import { EmployeeType } from "../../model/employee";
import { getAbilitySet, getCommutes } from "../../api/review";
import { useQuery } from "@tanstack/react-query";
import { iso8601ToSummaryString } from "../styled/Date/DateFomatter";
import {
  abilityLabelMap,
  abilityList,
  abilityType,
  EmployeeAbilityType,
} from "../../model/review";
import { sumBy } from "lodash";

export function convertToRadarData(
  ability: EmployeeAbilityType,
): SimpleRadarChartType[] {
  const targetA = ability.ability;
  const others = ability.employeesAbilityList;

  return abilityList.map((key) => {
    const averageB = others.length ? sumBy(others, key) / others.length : 0;

    return {
      subject: abilityLabelMap[key as abilityType],
      A: Number(targetA[key as abilityType].toFixed(1)),
      B: Number(averageB.toFixed(1)),
      fullMark: 150,
    };
  });
}

export function EmployAnalysisPanel(props: {
  user: EmployeeType;
  employeeId: number;
}) {
  const { user, employeeId } = props;
  const theme = useTheme();
  const { windowWidth } = useWindowContext();

  const { data: abilityList } = useQuery({
    queryKey: ["getAbilitySet", employeeId],
    queryFn: () => getAbilitySet(employeeId),
    refetchInterval: 60000,
  });

  const { data: commuteList } = useQuery({
    queryKey: ["getCommutes", employeeId],
    queryFn: () => getCommutes(employeeId),
    refetchInterval: 60000,
  });

  const isWide = windowWidth >= theme.windowSize.HD;

  if (!abilityList || !commuteList) {
    return (
      <AnalysisContainer isWide={isWide}>
        <MemberSolvingMeterEmpty />
      </AnalysisContainer>
    );
  }

  const workDateList: SimpleBarChartType[] = commuteList.map((commute) => ({
    label: iso8601ToSummaryString(commute.date),
    legendA: "근무시간",
    dataA: commute.workBalance,
  }));

  /* 업무수행율 계산 */
  const performance =
    ((abilityList.ability.knowledgeLevel +
      abilityList.ability.workPerformance) /
      2) *
    2;
  let anotherFactor = 0;
  abilityList.employeesAbilityList.forEach(
    (value) =>
      (anotherFactor = (value.workPerformance + value.knowledgeLevel) / 2),
  );
  const anotherPerformance =
    (anotherFactor / abilityList.employeesAbilityList.length) * 2;

  return (
    <AnalysisContainer isWide={isWide}>
      {user.level === "OFFICEMANAGER" || user.level === "STAFF" ? (
        <>
          <ContentsContainer theme={theme} width={28} isWide={isWide}>
            <MemberSolvingMeter
              starValue={anotherPerformance}
              circleValue={performance}
            />
          </ContentsContainer>
          <ContentsContainer theme={theme} width={16} isWide={isWide}>
            <MemberAbility
              windowWidth={windowWidth}
              theme={theme}
              data={convertToRadarData(abilityList)}
            />
          </ContentsContainer>
          <ContentsContainer theme={theme} width={56} isWide={isWide}>
            <MemberWorkBalance data={workDateList}></MemberWorkBalance>
          </ContentsContainer>
        </>
      ) : (
        <ContentsContainer width={100} theme={theme} isWide={isWide}>
          <MemberSolvingMeterEmpty />
        </ContentsContainer>
      )}
    </AnalysisContainer>
  );
}

const AnalysisContainer = styled(Container)<{ isWide: boolean }>(
  ({ isWide }) => css`
    width: 100%;
    flex-direction: row;
    flex-wrap: ${isWide ? "nowrap" : "wrap"};
    align-items: center;
    justify-content: ${isWide ? "space-between" : "center"};
    gap: 10px;
  `,
);

const ContentsContainer = styled(Container)<{
  theme: Theme;
  width: number;
  isWide: boolean;
}>(
  ({ theme, width, isWide }) => css`
    width: ${isWide ? width : 100}%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${theme.mode.cardBackground};
    border-radius: ${theme.borderRadius.softBox};

    padding: 4px;
    box-sizing: border-box;
  `,
);
