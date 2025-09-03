import styled from "@emotion/styled";
import { darken, lighten, rgba } from "polished";
import { css, keyframes, Theme, useTheme } from "@emotion/react";

export const FINGER_PRINT_PATH = [
  "m95.42 60.221c0.33333-4.6667 0.33333-10.667 0-18-0.5-11-8.5-26.5-24-34.5-15.5-8-38-9.5-55.5 8-11.667 11.667-16 25.5-13 41.5l0.65525 4.3683c0.38693 2.5791 2.7914 4.3563 5.3705 3.9695 2.5664-0.38496 4.3413-2.7687 3.9742-5.3378-1-7-6-22 10-38 14.554-14.554 38.15-14.554 52.704 0 4.5444 4.5444 7.8364 10.187 9.5562 16.379 0.5744 2.0681 0.98766 3.9417 1.2398 5.6209 2.4899 16.582-2.9979 37.051-6 53",
  "m15.42 76.221c5.3333-3.6667 7.3333-10.167 6-19.5-0.23862-1.551-0.44877-3.0902-0.63044-4.6174-1.8313-15.395 9.1641-29.359 24.559-31.191 1.268-0.15084 2.5448-0.21497 3.8216-0.19197 15.616 0.28138 28.07 13.129 27.864 28.747-0.089675 6.8105-0.29443 11.895-0.61426 15.253-1.2042 12.644-2.9364 21.532-7 37",
  "m19.92 85.221c7-5.3333 10.5-13.333 10.5-24v-12.5c0-10.217 8.2827-18.5 18.5-18.5 10.287 0 18.636 8.3235 18.666 18.611 0.019372 6.5699-0.035925 10.7-0.16589 12.389-1.5 19.5-3.5 31.5-12 45",
  "m26.92 92.221c8.6667-9.3333 13-17.333 13-24 0-4.1832-0.18166-10.365-0.54497-18.544-0.2219-4.9954 3.6478-9.2249 8.6432-9.4467 0.13383-0.0059444 0.26778-0.0089177 0.40175-0.0089177 5.5235 0 10.044 4.395 10.2 9.9163 0.16256 5.764-0.070756 11.792-0.69994 18.084-1.5 15-5.5 25.5-16.5 38",
  "m32.92 99.221c10.667-12.333 16-23.333 16-33v-17",
];

const BASE_COLOR = "#d8dee8";
const ACCENT_COLOR = "#00aaff";

const buttonIn = keyframes`
    from {
        opacity: 0;
        transform: scale3d(1.1, 1.15, 1);
    }
    to {
        opacity: 1;
        transform: none;
    }`;

const printPulse = keyframes`
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.33;
    }
    100% {
        opacity: 1;
    }
`;

const glowPulse = keyframes`
    0% {
        transform: scale3d(0.9, 0.9, 1);
    }
    50% {
        transform: scale3d(1, 1, 1);
    }
    100% {
        transform: scale3d(0.9, 0.9, 1);
    }
`;

const glowTwist = keyframes`
    0% {
        rotate: 0deg;
    }
    50% {
        rotate: 180deg;
    }
    100% {
        rotate: 360deg;
    }
`;

const printIn = keyframes`
    from {
        opacity: 0;
        stroke-dashoffset: 0.5;
    }
    to {
        opacity: 1;
        stroke-dashoffset: 0;
    }
`;

export function FingerPrint(props: {
  mainFunc: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  checkFunc?: () => void;
}) {
  const { checkFunc, mainFunc, type = "button" } = props;
  const theme = useTheme();
  return (
    <FingerPrintButton
      className="button"
      type={type}
      onMouseEnter={checkFunc}
      onClick={mainFunc}
    >
      <PrintUnder className="print print--under" theme={theme}>
        <svg viewBox="0 0 98 109" xmlns="http://www.w3.org/2000/svg">
          {FINGER_PRINT_PATH.map((d, index) => (
            <StyledPath
              theme={theme}
              key={index}
              d={d}
              pathLength="1"
              index={index}
              layer="under"
              delay={index * 0.1}
            />
          ))}
        </svg>
      </PrintUnder>
      <PrintOver className="print print--over" theme={theme}>
        <svg viewBox="0 0 98 109" xmlns="http://www.w3.org/2000/svg">
          {FINGER_PRINT_PATH.map((d, index) => (
            <StyledPath
              key={index}
              d={d}
              pathLength="1"
              index={index}
              layer="over"
              delay={index * 0.1}
              theme={theme}
            />
          ))}
        </svg>
      </PrintOver>
    </FingerPrintButton>
  );
}

export const PrintUnder = styled.span<{ theme: Theme }>(
  ({ theme }) => css`
    position: relative;
    width: 40%;
    height: 0;
    padding-bottom: calc(40% * 1.1122);
    display: inline-block;
    z-index: 1;
    transform: scale3d(1.05, 1.05, 1);
    backface-visibility: hidden;
    margin-right: -40%;
    mix-blend-mode: lighten;
    filter: drop-shadow(0 0 0.033em ${theme.mode.textSecondary});
    animation: ${printPulse} 2s linear infinite 6.25s;

    svg {
      position: absolute;
      inset: 0;
    }
  `,
);

const PrintOver = styled.span<{ theme: Theme }>(
  ({ theme }) => css`
    position: relative;
    width: 40%;
    height: 0;
    padding-bottom: calc(40% * 1.1122);
    display: inline-block;
    z-index: 1;
    transform: scale3d(1.05, 1.05, 1);
    backface-visibility: hidden;

    opacity: 0;
    filter: drop-shadow(-0.0075em -0.0075em 0.005em rgba(0, 0, 51, 0.1))
      drop-shadow(0.0075em 0.0075em 0.005em rgba(255, 255, 255, 0.1))
      drop-shadow(0 0 0.04em ${theme.mode.textSecondary});

    transition:
      transform 2s cubic-bezier(0.33, 0.45, 0.3, 1),
      color 0s 0.4s,
      opacity 0.5s cubic-bezier(0.33, 0.45, 0.3, 1);

    svg {
      position: absolute;
      inset: 0;
    }

    &::after {
      content: "";
      position: absolute;
      top: -40%;
      right: -60%;
      bottom: -40%;
      left: -60%;
      border-radius: 50%;
      opacity: 0;
      mix-blend-mode: color-dodge;

      transition: opacity 0.3s cubic-bezier(0.33, 0.45, 0.3, 1);
      animation:
        ${glowPulse} 3s linear infinite,
        ${glowTwist} 3s linear infinite;
    }
  `,
);

const StyledPath = styled.path<{
  theme: Theme;
  index: number;
  layer: "under" | "over";
  delay: number;
}>(
  ({ theme, index, layer, delay }) => css`
    stroke-width: 4;
    fill: none;
    stroke-linecap: round;
    stroke-dasharray: 1;
    will-change: stroke-dashoffset, stroke, color, opacity;
    transition: 2s cubic-bezier(0.33, 0.45, 0.3, 1);

    stroke: ${layer === "under"
      ? lighten(0.225 - index * 0.02, theme.mode.highlight + 50)
      : ACCENT_COLOR};
    opacity: 0;
    stroke-dashoffset: ${layer === "under" ? 0.5 : 1};

    transition-delay: ${delay}s;

    ${layer === "under" &&
    css`
      animation: ${printIn} 1.2s cubic-bezier(0.33, 0.45, 0.3, 1) forwards 1.5s;
    `}
  `,
);

const FingerPrintButton = styled.button`
  appearance: none;
  border: none;
  outline: none;
  padding: 0;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 30vmin;
  width: 100px;
  height: 100px;
  opacity: 0;
  animation: ${buttonIn} 1s cubic-bezier(0.33, 0.45, 0.3, 1) forwards 1s;
  background: none;
  border-radius: 50%;

  &:before,
  &:after {
    border-radius: inherit;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    filter: blur(0.025em);
    background: ${darken(0.0866, BASE_COLOR)},
      radial-gradient(
        160% 160% at 57.5% 60%,
        ${rgba(lighten(0.06, BASE_COLOR), 0)} 30%,
        ${lighten(0.06, BASE_COLOR)} 45%
      ),
      radial-gradient(
        180% 200% at 40% 17.5%,
        ${rgba(darken(0.2, BASE_COLOR), 0)} 35%,
        ${darken(0.2, BASE_COLOR)} 50%
      ),
      radial-gradient(
        120% 120% at 45% 45%,
        ${rgba(darken(0.1, BASE_COLOR), 0)} 42%,
        ${rgba(darken(0.2, BASE_COLOR), 0.75)} 50%
      );
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0.025em;
    border-radius: inherit;
    opacity: 0;
    filter: blur(0.03em);
    transform: scale3d(0.925, 0.94, 1);
    transition: 0.75s cubic-bezier(0.33, 0.45, 0.3, 1);
    transition-delay: 0.25s;
  }

  &:hover {
    &::after {
      opacity: 1;
      transform: none;
      transition-delay: 0s;
    }

    ${PrintOver} {
      opacity: 0.66;
      transform: scale3d(1, 1, 1);

      ${StyledPath} {
        opacity: 1;
        stroke-dashoffset: 0;
      }
    }
  }
`;
