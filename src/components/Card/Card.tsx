/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import { OutLine } from "../layouts";

export interface cardProps {
  title: string;
  statistics: string;
  description: string;
  unit?: string;
  postscript?: string;
}

export function StatisticsCard(props: cardProps) {
  const { title, statistics, description, unit, postscript } = props;
  const theme = useTheme();
  return (
    <OutLine
      title={title}
      titleAlign="left"
      css={css`
        width: auto;
        text-align: left;
      `}
    >
      <div
        className="w-full flex flex-col items-start"
        css={css`
          margin-top: 10px;
        `}
      >
        <span
          css={css`
            font-family: ${theme.mode.font.component.itemTitle};
            font-weight: 600;
            font-size: 1.125rem;
            margin-bottom: 14px;
          `}
        >
          {statistics} {unit}
        </span>
        <div
          className="flex flex-col items-start gap-1"
          css={css`
            font-family: ${theme.mode.font.component.itemDescription};
            font-size: 0.75rem;
            text-align: left;
          `}
        >
          <span>{description}</span>
          <span
            css={css`
              color: ${theme.mode.textSecondary};
            `}
          >
            {postscript}
          </span>
        </div>
      </div>
    </OutLine>
  );
}
