/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import { HorizontalDivider } from "../layouts";
import { ReactNode } from "react";

export function PatchModal(props: {
  func: () => void;
  title: string;
  children: ReactNode;
}) {
  const { func, title, children } = props;
  const theme = useTheme();

  return (
    <div
      css={css`
        width: 100%;
        background-color: ${theme.mode.textRevers};
        border-radius: ${theme.borderRadius.softBox};
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          padding: 0 4px;
          height: 40px;

          span {
            width: 50px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
          }
        `}
      >
        <span></span>
        <span
          css={css`
            font-weight: 500 !important;
          `}
        >
          {title}
        </span>
        <span onClick={func}>변경</span>
      </div>
      <HorizontalDivider width={100} />
      {children}
    </div>
  );
}
