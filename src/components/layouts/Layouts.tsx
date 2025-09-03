import { css, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import Badge, { badgeClasses } from "@mui/material/Badge";
import { ReactNode } from "react";
import { Container } from "./Frames";

export function HorizontalDivider(props: {
  width: number;
  className?: string;
}) {
  const { className, width } = props;
  const theme = useTheme();
  return (
    <HorizontalLine
      className={className}
      theme={theme}
      width={width}
    ></HorizontalLine>
  );
}

export function VerticalDivider(props: { height: number; className?: string }) {
  const { className, height } = props;
  const theme = useTheme();
  return <VerticalLine className={className} theme={theme} height={height} />;
}

const VerticalLine = styled.div<{ theme: Theme; height: number }>(
  ({ theme, height }) => css`
    width: 1px;
    height: ${height}px;
    border-left: 1px solid ${theme.mode.borderSecondary};
  `,
);

const HorizontalLine = styled.div<{ theme: Theme; width: number }>(
  ({ theme, width }) => css`
    width: ${width}%;
    border-bottom: 1px solid ${theme.mode.borderSecondary};
  `,
);

export const StyledBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    font-size: 12px;
    position: absolute;
    top: -12px;
    right: -12px;
  }
`;

export const ContentsContainer = styled(Container)`
  width: 95%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

/** 범용적으로 사용되는 컨테이너 컴포넌트입니다.
 * 주로 자녀 요소의 정렬을 위해 사용됩니다.
 * */
export function OutLine(props: {
  className?: string;
  title?: string;
  children: ReactNode;
  alignItems?: "center" | "flex-start";
  titleAlign?: "left" | "center";
}) {
  const {
    className,
    title,
    alignItems = "center",
    titleAlign = "center",
    children,
  } = props;
  const theme = useTheme();
  return (
    <OutLineContainer
      className={className}
      theme={theme}
      alignItems={alignItems}
    >
      {title && (
        <OutLineTitle textAlign={titleAlign} theme={theme}>
          {title}
        </OutLineTitle>
      )}
      {children}
    </OutLineContainer>
  );
}

const OutLineContainer = styled.div<{
  theme: Theme;
  alignItems: "center" | "flex-start";
}>(
  ({ theme, alignItems }) => css`
    display: flex;
    padding: 16px;
    flex-direction: column;
    justify-content: space-between;
    align-items: ${alignItems};
    width: 100%;
    height: auto;
    border: 1px solid ${theme.mode.borderSecondary};
    border-radius: ${theme.borderRadius.softBox};
    background: ${theme.mode.cardBackground};
    box-sizing: border-box;
  `,
);

const OutLineTitle = styled.div<{ theme: Theme; textAlign: string }>(
  ({ theme, textAlign }) => css`
    text-align: ${textAlign};
    width: 100%;
    color: ${theme.mode.textPrimary};
    /* Default/Label/12px-Eb */
    font-family: ${theme.mode.font.component.itemTitle};
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 16px; /* 133.333% */
  `,
);

export const AnalysisContainer = styled(Container)<{ isWide: boolean }>(
  ({ isWide }) => css`
    width: 100%;
    flex-direction: row;
    flex-wrap: ${isWide ? "nowrap" : "wrap"};
    align-items: center;
    justify-content: ${isWide ? "flex-start" : "center"};
    gap: 10px;
  `,
);

export const AnalysisContentsContainer = styled(Container)<{
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

export function EllipsisCase(props: {
  text: ReactNode;
  testAlign: "center" | "left" | "right";
  className?: string;
  width: number;
  func?: () => void;
}) {
  const { text, className, width, testAlign, func } = props;

  return (
    <TextCase className={className} onClick={func}>
      <Text textAlign={testAlign} width={width}>
        {text}
      </Text>
    </TextCase>
  );
}

export const TextCase = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Text = styled.span<{ width?: number; textAlign: string }>(
  ({ width, textAlign }) => css`
    text-align: ${textAlign};
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
    overflow: hidden;
    width: ${width}px;
  `,
);

export const TableSearchBar = styled.input<{ theme: Theme }>(
  ({ theme }) => css`
    background-color: ${theme.mode.cardBackground};
    border: none;
    font-size: 16px;
    width: 400px;
  `,
);
