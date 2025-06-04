import { useTheme } from "@emotion/react";
import {
  SimpleBarChartType,
  SimpleRadarChartType,
} from "../../statistics/visualization/Chart";
import { useWindowContext } from "../../../context/WindowContext";
import { EmployeeType } from "../../../model/employee";
import {
  abilityLabelMap,
  abilityList,
  abilityType,
  EmployeeAbilityType,
} from "../../../model/review";
import { sumBy } from "lodash";
import { AnalysisContainer, AnalysisContentsContainer } from "../../layouts";
import { AnalysisEmptyState } from "../AnalysisEmptyState";
import { useQuery } from "@tanstack/react-query";
import { getAbilitySet, getCommutes } from "../../../api/review";
import { iso8601ToSummaryString } from "../../styled/Date/DateFomatter";
import { MemberWorkBalance } from "./MemberWorkBalance";
import { MemberAbility } from "./MemberAbility";
import { MemberSolvingMeter } from "./MemberSolvingMeter";

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

export function EmployeeAnalysisPanel(props: {
  user: EmployeeType;
  employeeId: number;
}) {
  const { user, employeeId } = props;
  const theme = useTheme();
  const { windowWidth } = useWindowContext();

  const { data: abilityList } = useQuery({
    queryKey: ["getAbilitySet", employeeId],
    queryFn: () => getAbilitySet(employeeId),
  });

  const { data: commuteList } = useQuery({
    queryKey: ["getCommutes", employeeId],
    queryFn: () => getCommutes(employeeId),
  });

  const isWide = windowWidth >= theme.windowSize.HD;

  if (
    !abilityList ||
    !commuteList ||
    !Array.isArray(commuteList) ||
    commuteList.length === 0
  ) {
    return (
      <AnalysisContainer isWide={isWide}>
        <AnalysisContentsContainer width={100} theme={theme} isWide={isWide}>
          <AnalysisEmptyState />
        </AnalysisContentsContainer>
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
      {user.level === "OFFICEMANAGER" ||
      user.level === "STAFF" ||
      commuteList.length !== 0 ? (
        <>
          <AnalysisContentsContainer theme={theme} width={28} isWide={isWide}>
            <MemberSolvingMeter
              starValue={anotherPerformance}
              circleValue={performance}
            />
          </AnalysisContentsContainer>
          <AnalysisContentsContainer theme={theme} width={16} isWide={isWide}>
            <MemberAbility
              windowWidth={windowWidth}
              theme={theme}
              data={convertToRadarData(abilityList)}
            />
          </AnalysisContentsContainer>
          <AnalysisContentsContainer theme={theme} width={56} isWide={isWide}>
            eslint-disable-next-line noSecrets/no-secrets
            <MemberWorkBalance data={workDateList}></MemberWorkBalance>
          </AnalysisContentsContainer>
        </>
      ) : (
        <AnalysisContentsContainer width={100} theme={theme} isWide={isWide}>
          <AnalysisEmptyState />
        </AnalysisContentsContainer>
      )}
    </AnalysisContainer>
  );
}
