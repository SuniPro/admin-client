import { LogoIcon } from "../../Logo/LogoIcon";
import styled from "@emotion/styled";
import { css, Theme, useTheme } from "@emotion/react";

export function EmptyPage(props: { title?: string; message?: string }) {
  const { title, message } = props;
  const theme = useTheme();
  return (
    <Container theme={theme}>
      <LogoIcon width={100 * 1.3} height={100} />
      <EmptyTitle>
        {title ? title : "현재 라이브 되는 방송이 없습니다."}
      </EmptyTitle>
      <h3>{message ? message : "방송 스케줄을 확인해주세요 !"}</h3>
    </Container>
  );
}

const Container = styled.div<{ theme: Theme }>(
  ({ theme }) => css`
    width: 100%;
    font-family: ${theme.mode.font.empty.title}
    box-sizing: border-box;
    white-space: nowrap;

    padding: 20px 30px;
  `,
);

const EmptyTitle = styled.h2`
  font-size: 25px;
  margin-top: 50px;
`;
