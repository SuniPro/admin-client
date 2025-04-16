import { css, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

export function LogoText(props: { className?: string; fontSize?: number }) {
  const { className, fontSize = 28 } = props;
  const theme = useTheme();
  return (
    <LogoTextCase className={className} fontSize={fontSize} theme={theme}>
      TAEKANG
    </LogoTextCase>
  );
}

const LogoTextCase = styled.span<{ fontSize: number; theme: Theme }>(
  ({ theme, fontSize }) => css`
    white-space: nowrap;
    color: ${theme.colors.azure};
    font-family: ${theme.mode.font.logo};
    font-weight: 700;
    font-size: ${fontSize}px;
    transform: translateY(0%);
    letter-spacing: -0.07em;
  `,
);

export const LogoContainer = styled.div<{
  width: number;
  height: number;
}>(
  ({ width, height }) => css`
    width: ${width}px;
    height: ${height}px;
    gap: 4px;
    align-items: center;
    display: flex;
    flex-direction: row;
  `,
);
