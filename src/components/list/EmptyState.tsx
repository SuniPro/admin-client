/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import { OutLine } from "../layouts";
import WarningIcon from "@mui/icons-material/Warning";
import styled from "@emotion/styled";
import { ReactNode } from "react";

export function EmptyState(props: {
  icon?: ReactNode;
  title: string;
  message?: string;
}) {
  const { icon, title, message } = props;
  const theme = useTheme();
  return (
    <OutLine
      title={title}
      css={css`
        gap: 8px;
      `}
    >
      {icon ?? <WarningIcon color="error" fontSize="large" />}
      <Empty theme={theme}>{message ?? "표시할 데이터가 없습니다."}</Empty>
    </OutLine>
  );
}

const Empty = styled.div(
  ({ theme }) => css`
    color: ${theme.mode.textPrimary};
    /* Default/Label/14px-Eb */
    font-family: ${theme.mode.font.component.itemDescription};
    font-size: 16px;
    font-style: normal;
    font-weight: 800;
    line-height: 16px; /* 114.286% */
  `,
);
