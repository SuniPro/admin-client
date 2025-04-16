/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { OutLine } from "../layouts/Layouts";
import WarningIcon from "@mui/icons-material/Warning";

export function MemberSolvingMeterEmpty() {
  return (
    <OutLine
      title="평가 결과"
      css={css`
        gap: 8px;
      `}
    >
      <WarningIcon color="error" fontSize="large"></WarningIcon>
      <Empty>표시할 데이터가 없습니다.</Empty>
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
