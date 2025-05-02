import styled from "@emotion/styled";
import { ReactElement, useState } from "react";
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

export function PlusButton(props: { className?: string; func: () => void }) {
  const { className, func } = props;
  const [toggle, setToggle] = useState(false);
  const theme = useTheme();

  return (
    <PlusButtonWrapper
      className={className}
      onMouseLeave={() => setToggle(false)}
      onClick={() => {
        func();
        setToggle((prev) => !prev);
      }}
      toggle={toggle}
      theme={theme}
    >
      <svg width="32px" height="32px" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="15"></circle>
        <g id="plus">
          <path d="M16,11 L16,21"></path>
          <path d="M11,16 L21,16"></path>
        </g>
      </svg>
    </PlusButtonWrapper>
  );
}

const PlusButtonWrapper = styled.div<{ theme: Theme; toggle: boolean }>(
  ({ theme, toggle }) => css`
    position: absolute;
    width: 32px;
    height: 32px;
    display: inline-block;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.2s ease;
    transition-delay: 0.15s;

    svg {
      transform: rotate(270deg);

      circle {
        stroke-width: 2;
        stroke: ${theme.mode.cardBackground};
        fill: ${theme.mode.bodyBackground};
        stroke-dasharray: 95;
        stroke-dashoffset: ${toggle ? 285 : 190};
        transition: all 0.6s ease;
        stroke-linecap: round;
      }

      // 플러스 버튼에 회전을 적용하기 위한 로직입니다.
      //eslint-disable-next-line
      #plus {
        transform-origin: 50% 50%;
        transform: ${toggle ? "rotate(45deg)" : "rotate(0deg)"};
        transition: all 0.8s ease;

        path {
          stroke-width: 2;
          stroke: white;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      }
    }

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }
  `,
);
