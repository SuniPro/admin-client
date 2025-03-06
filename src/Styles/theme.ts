import { Theme } from "@emotion/react";
import { createTheme } from "@mui/material";

const deviceSize = {
  phone: "screen and (max-width: 645px)",
  tablet: "screen and (min-width: 646px) and (max-width: 1280px)",
  desktop: "screen and (min-width: 1281px)",
};

const windowSize = {
  small: 645,
  large: 1280,
};

const flexLayout = {
  column: "display: flex;  flex-direction: column;",
  row: "display: flex; flex-direction: row;",
  center:
    "align-items: center; justify-content: center; align-content: center;",
};

const fontSize = {
  xs: "0.5rem",
  sm: "0.75rem",
  base: "1rem",
  md: "1.25rem",
  lg: "1.5rem",
};

const fontStyle = {
  serif: "sans-serif",
  roboto: "Roboto, sans-serif",
  montserrat: "Montserrat, sans-serif",
  poppins: "Poppins, sans-serif",
  archivo: "Archivo, sans-serif",
  katibeh: "Katibeh, sans-serif",
  playfair: "Playfair Display, sans-serif",
};

const mainFrameSize = {
  defaultWidth: 640,
};

const colors = {
  white: "#ffffff",
  black: "#000000",
  gray: "#979797",
  primary: "#00a0ff",
  secondary: "#ddd",
  hover: "#00a0ff50",
  basicBlack: "#181818",
  success: "#52c41a",
  warning: "#df1313",
  luxuryGreen: "#356358",
  whiteGray: "#f2f2f2",
  mayaBlue: "#58CCFF",
  babyBlue: "#85C8F2",
  babyBlueToneDown: "#88D4F2",
  brightGray: "#E6EEF3",
  diamond: "#B8EDFD",
  azureishWhite: "#DBEDF9",

  gold: "#d7bc6a",
  lightGold: "#f3e1a9",
  gradientGoldBottom: "linear-gradient(to bottom, #d7bc6a, #ffe9a6)",
  gradientGoldRight: "linear-gradient(to right, #d7bc6a, #ffe9a6)",
};

const shadowStyle = {
  default: "0 1px 2px rgba(0, 0, 0, 0.2)",
};

const borderRadius = {
  circle: "50%",
  roundedBox: "14px",
  softBox: "8px",
};

const defaultTheme = {
  bodyBackground: colors.brightGray,
  mainMenuActiveBackground: colors.babyBlueToneDown,
  fontPrimary: colors.black,
  fontSecondary: colors.gray,
  primary: colors.primary,
  secondary: colors.secondary,
  gray: "#979797",
  hover: colors.hover,
  contentBoxBorder: colors.brightGray,
  menuAndToggle: {
    active: colors.babyBlueToneDown,
    nonActive: colors.secondary,
  },
  activeBackgroundColor: colors.babyBlueToneDown,
  nonActiveBackgroundColor: colors.secondary,
  defaultBackground: colors.gold,
  fontColor: {
    default: colors.black,
    buttonDefault: colors.white,
  },
};

// const repo = {
//     open: "red",
//     close: "blue",
// };

export type DeviceSizeTypes = typeof deviceSize;
export type WindowSizeTypes = typeof windowSize;
export type FlexLayoutTypes = typeof flexLayout;
export type FontSizeTypes = typeof fontSize;
export type ColorTypes = typeof colors;
export type FontTypes = typeof fontStyle;
export type ShadowStylesTypes = typeof shadowStyle;
export type BorderRadiusTypes = typeof borderRadius;
export type DefaultThemeType = typeof defaultTheme;
export type MainFrameSizeType = typeof mainFrameSize;

const baseTheme = createTheme();

const theme: Theme = {
  ...baseTheme,
  deviceSize,
  windowSize,
  flexLayout,
  fontStyle,
  fontSize,
  colors,
  defaultTheme,
  shadowStyle,
  borderRadius,
  mainFrameSize,
};

export default theme;
