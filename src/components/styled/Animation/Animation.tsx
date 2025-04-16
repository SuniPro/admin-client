import { keyframes } from "@emotion/react";

export const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(100px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const scaleIn = keyframes`
  0% {
      visibility: hidden;
    scale: 0.7;
    opacity: 0;
  }
  100% {
      visibility: visible;
    scale: 1;
    opacity: 1;
  }
`;

export const scaleOut = keyframes`
  0% {
    visibility: visible;
    scale: 1;
    opacity: 1;
  }
  100% {
    visibility: hidden;
    scale: 0.7;
    opacity: 0;
  }
`;
