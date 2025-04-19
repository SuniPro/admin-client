import styled from "@emotion/styled";
import { ReactElement } from "react";
import { FuncIconItemProps, FuncItemProps } from "./ButtonPropsType";
import { css, Theme, useTheme } from "@emotion/react";

export function FuncItem(props: FuncItemProps): ReactElement {
  const { className, label, func, isActive, ...other } = props;
  const theme = useTheme();

  return (
    <StyledFuncButton
      theme={theme}
      className={className}
      onClick={func}
      isActive={isActive}
      {...other}
    >
      {label}
    </StyledFuncButton>
  );
}

export function FuncIconItem(props: FuncIconItemProps) {
  const { className, icon, label, func, ...other } = props;
  const theme = useTheme();
  return (
    <StyledFuncButton
      theme={theme}
      className={className}
      onClick={func}
      {...other}
    >
      <IconCase>{icon}</IconCase>
      {label}
    </StyledFuncButton>
  );
}

export const StyledFuncButton = styled.button<{
  isActive?: boolean;
  inActiveBackgroundColor?: string;
  activeBackgroundColor?: string;
  theme: Theme;
}>(
  ({
    isActive,
    theme,
    activeBackgroundColor = theme.mode.buttonHoverBackground,
    inActiveBackgroundColor = theme.mode.buttonBackground,
  }) => css`
    background-color: ${isActive
      ? activeBackgroundColor
      : inActiveBackgroundColor};

    color: ${isActive ? theme.mode.textRevers : theme.mode.textPrimary};

    margin: 0;
    padding: 0.6em 1.2em;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &:hover {
      background: ${activeBackgroundColor
        ? activeBackgroundColor
        : theme.mode.buttonHoverBackground};
      color: ${theme.mode.textRevers};
    }

    &:active {
      background-color: ${theme.mode.hoverEffect};
      color: ${isActive ? theme.mode.textRevers : theme.mode.textPrimary};
      background-size: 100%;
      transition: background 0s;
    }

    transition: background 0.8s;

    &:focus {
      outline: none;
    }
  `,
);

const IconCase = styled.i`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
`;
