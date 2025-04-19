/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import WarningIcon from "@mui/icons-material/Warning";
import { Container } from "../layouts/Frames/FrameLayouts";

export function ContentsEmptyState() {
  return (
    <EmptyContainer>
      <WarningIcon sx={{ fontSize: "60px" }} color="error"></WarningIcon>
      <Empty>표시할 데이터가 없습니다.</Empty>
    </EmptyContainer>
  );
}

const EmptyContainer = styled(Container)`
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 20px;
`;

const Empty = styled.div(
  ({ theme }) => css`
    color: ${theme.mode.textPrimary};
    /* Default/Label/14px-Eb */
    font-family: ${theme.mode.font.component.itemTitle};
    font-size: 20px;
    font-style: normal;
    font-weight: 800;
    line-height: 16px; /* 114.286% */
  `,
);
