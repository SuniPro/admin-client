/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

export function AnalogMeterBackground() {
  return (
    <svg
      width="200"
      height="100"
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M200 100C200 86.8678 197.413 73.8642 192.388 61.7317C187.362 49.5991 179.997 38.5752 170.711 29.2893C161.425 20.0035 150.401 12.6375 138.268 7.61205C126.136 2.58658 113.132 -5.74026e-07 100 0C86.8678 5.74026e-07 73.8642 2.58658 61.7317 7.61205C49.5991 12.6375 38.5752 20.0035 29.2893 29.2893C20.0035 38.5752 12.6375 49.5991 7.61204 61.7317C2.58657 73.8642 -1.14805e-06 86.8678 0 100L100 100H200Z"
        fill="#F6F6F6"
        css={css`
          fill: #f6f6f6;
          fill: color(display-p3 0.9647 0.9647 0.9647);
          fill-opacity: 1;
        `}
      />
      <line
        opacity="0.4"
        x1="100"
        y1="4.37115e-08"
        x2="100"
        y2="10"
        stroke="#2C61B5"
        css={css`
          stroke: #2c61b5;
          stroke: color(display-p3 0.1725 0.3804 0.7098);
          stroke-opacity: 1;
        `}
        strokeWidth="2"
      />
      <line
        opacity="0.4"
        x1="190"
        y1="99"
        x2="200"
        y2="99"
        stroke="#2C61B5"
        css={css`
          stroke: #2c61b5;
          stroke: color(display-p3 0.1725 0.3804 0.7098);
          stroke-opacity: 1;
        `}
        strokeWidth="2"
      />
      <line
        opacity="0.4"
        y1="99"
        x2="10"
        y2="99"
        stroke="#2C61B5"
        css={css`
          stroke: #2c61b5;
          stroke: color(display-p3 0.1725 0.3804 0.7098);
          stroke-opacity: 1;
        `}
        strokeWidth="2"
      />
    </svg>
  );
}

export function Star() {
  return (
    <svg
      width="12"
      height="11"
      viewBox="0 0 12 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 0L7.34708 4.1459H11.7063L8.17963 6.7082L9.52671 10.8541L6 8.2918L2.47329 10.8541L3.82037 6.7082L0.293661 4.1459H4.65292L6 0Z"
        fill="#9C9C9C"
        css={css`
          fill: #9c9c9c;
          fill: color(display-p3 0.6118 0.6118 0.6118);
          fill-opacity: 1;
        `}
      />
    </svg>
  );
}
