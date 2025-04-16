import styled from "@emotion/styled";
import { css, Global, Theme, useTheme } from "@emotion/react";

export const ResourcePageContainer = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.section`
  display: flex;
`;

export function GlobalStyled() {
  const theme = useTheme();
  return (
    <Global
      styles={css`
        width: 100%;
        position: relative;

        z-index: -1;
        background-color: ${theme.mode.bodyBackground};

        :root {
          font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
          line-height: 1.5;
          font-weight: 400;

          color-scheme: light dark;

          color: ${theme.mode.textPrimary};
          background-color: ${theme.mode.bodyBackground};

          font-synthesis: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          margin: 0;
          display: flex;
          place-items: center;
          min-width: 320px;
          min-height: 100vh;
          color: ${theme.mode.textPrimary};
          background-color: ${theme.mode.bodyBackground};
        }

        button {
          border-radius: 8px;
          border: 1px solid transparent;
          padding: 0.6em 1.2em;
          font-size: 1em;
          font-weight: 500;
          font-family: inherit;
          background-color: #1a1a1a;
          transition: border-color 0.25s;
        }
      `}
    />
  );
}

export const ModalContainer = styled.div<{ width: number; theme: Theme }>(
  ({ width, theme }) => css`
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${width}px;
    height: 450px;
    border: 1px solid ${theme.mode.textSecondary};
    border-radius: ${theme.borderRadius.softBox};
    color: ${theme.mode.textPrimary};
    background-color: ${theme.mode.cardBackground};
    overflow-x: visible;
    overflow-y: scroll;
    box-sizing: border-box;
    padding: 20px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
);
