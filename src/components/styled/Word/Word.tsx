import styled from "@emotion/styled";
import { css } from "@mui/material";
import { ReactNode } from "react";
import { Theme, useTheme } from "@emotion/react";

export function WordBox(props: {
  className?: string;
  size?: { width: number; height: number };
  color?: string;
  icon?: ReactNode;
  isActive?: boolean;
  activeColor?: string;
  fontWeight?: number;
  fontSize?: number;
  fontStyle?: string;
  label: ReactNode;
}) {
  const { className, icon, label, ...other } = props;
  const theme = useTheme();
  return (
    <WordContainer className={className}>
      <i>{icon}</i>
      <Word theme={theme} {...other}>
        {label}
      </Word>
    </WordContainer>
  );
}

const WordContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Word = styled.span<{
  size?: {
    width: number;
    height: number;
  };
  isActive?: boolean;
  color?: string;
  activeColor?: string;
  fontWeight?: number;
  fontSize?: number;
  fontStyle?: string;
  theme: Theme;
}>(
  ({
    theme,
    size,
    isActive,
    color,
    activeColor = theme.mode.textAccent,
    fontSize,
    fontWeight,
    fontStyle = "sans-serif",
  }) => css`
    ${size && "width: ${size.width}px; height: ${size.height}px;"}
    margin: 0;
    padding: 0;

    color: ${isActive ? activeColor : color};
    font-size: ${fontSize}px;
    font-weight: ${fontWeight};
    font-family: ${fontStyle};

    &:hover {
      color: ${activeColor};
    }

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
);
