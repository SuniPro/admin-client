import { css, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import Badge, { badgeClasses } from "@mui/material/Badge";
import { ReactNode } from "react";
import { Container } from "./Frames/FrameLayouts";

export function HorizontalDivider(props: {
  width: number;
  className?: string;
}) {
  const { className, width } = props;
  const theme = useTheme();
  return <Line className={className} theme={theme} width={width}></Line>;
}

const Line = styled.div<{ theme: Theme; width: number }>(
  ({ theme, width }) => css`
    width: ${width}%;
    border-bottom: 1px solid ${theme.mode.textSecondary};
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
  width: 90%;
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
}) {
  const { className, title, alignItems = "center", children } = props;
  const theme = useTheme();
  return (
    <OutLineContainer
      className={className}
      theme={theme}
      alignItems={alignItems}
    >
      {title && <OutLineTitle>{title}</OutLineTitle>}
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
    border: 1px solid ${theme.mode.textSecondary};
    border-radius: ${theme.borderRadius.softBox};
    background: ${theme.mode.cardBackground};
    box-sizing: border-box;
  `,
);

const OutLineTitle = styled.div(
  ({ theme }) => css`
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
