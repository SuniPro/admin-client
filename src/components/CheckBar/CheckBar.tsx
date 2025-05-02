import React, { useCallback, useRef } from "react";
import styled from "@emotion/styled";
import { useHorizontalScroll } from "../../hooks/useWheel";
import { css, Theme, useTheme } from "@emotion/react";
import { BaseCheckItemProps } from "../../model/util";
import {
  getLabel,
  LabelMapData,
  LabelMapKeyType,
  LabelMapType,
} from "./dynamicTypeExtendForLabelMap";

const NAVIGATION_PADDING = 10;
const CONTAINER_PADDING = 10;
const ITEM_GAP = 20;

interface CheckBoxPropsType<
  T extends LabelMapType,
  U extends BaseCheckItemProps,
> {
  className?: string;
  checkItemWidth: number;
  checkBarContainerWidth: number;
  labelMapType: string;
  labelMap: LabelMapData<T>;
  checkListStatus: U[];
  setCheckListStatus: React.Dispatch<React.SetStateAction<U[]>>;
  justifyContent?: string;
}

export function CheckBar<T extends LabelMapType, U extends BaseCheckItemProps>(
  props: CheckBoxPropsType<T, U>,
) {
  const {
    className,
    checkItemWidth,
    labelMap,
    checkListStatus,
    setCheckListStatus,
    justifyContent,
  } = props;

  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useHorizontalScroll(navRef);

  return (
    <Container
      ref={ref}
      className={className}
      justifyContent={justifyContent}
      theme={theme}
    >
      <CheckBarMover ref={navRef}>
        <ActivityCheckList>
          {checkListStatus.map((row, index) => (
            <React.Fragment key={index}>
              <CheckItem
                label={getLabel(labelMap, row.label as LabelMapKeyType<T>)}
                width={checkItemWidth}
                index={index}
                checkListStatus={row}
                setCheckListStatus={setCheckListStatus}
              />
            </React.Fragment>
          ))}
        </ActivityCheckList>
      </CheckBarMover>
    </Container>
  );
}

const Container = styled.div<{
  justifyContent?: string;
  theme: Theme;
}>(
  ({ justifyContent, theme }) => css`
    width: 100%;
    display: flex;
    height: 60px;
    padding: 0 ${CONTAINER_PADDING}px;
    align-items: center;
    justify-content: ${justifyContent};
    box-sizing: border-box;

    color: ${theme.mode.textPrimary};
    background: ${theme.mode.bodyBackground};
    position: relative;

    overflow: hidden;

    button:hover {
      border-color: ${theme.mode.buttonHoverBackground};
    }
  `,
);

const CheckBarMover = styled.div`
  display: flex;
  position: relative;
  z-index: 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ActivityCheckList = styled.ul`
  display: inline-flex;
  padding: 0 ${NAVIGATION_PADDING}px;
  align-items: center;
  gap: ${ITEM_GAP}px;
`;

function CheckItem<U extends BaseCheckItemProps>(props: {
  label: string;
  width: number;
  index: number;
  checkListStatus: U;
  setCheckListStatus: React.Dispatch<React.SetStateAction<U[]>>;
}) {
  const { label, width, index, setCheckListStatus, checkListStatus } = props;
  const theme = useTheme();

  const handleCheckboxChange = useCallback(
    (checked: boolean) => {
      setCheckListStatus((prev) => {
        const updated = [...prev];
        updated[index as number] = { ...updated[index as number], checked };
        return updated;
      });
    },
    [index, setCheckListStatus],
  );

  return (
    <>
      <CheckBoxContainer className="cntr" width={width} theme={theme}>
        <LabelCheckBox
          htmlFor={`checkbox-${index}`}
          className="label-cbx"
          theme={theme}
        >
          <Invisible
            id={`checkbox-${index}`}
            type="checkbox"
            className="invisible"
            onChange={(e) => handleCheckboxChange(e.target.checked)}
          />
          <CheckArea
            className="checkbox"
            checked={checkListStatus.checked}
            theme={theme}
          >
            <svg width="20px" height="20px" viewBox="0 0 20 20">
              <path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z"></path>
              <polyline points="4 11 8 15 16 6"></polyline>
            </svg>
          </CheckArea>
          <span>{label}</span>
        </LabelCheckBox>
      </CheckBoxContainer>
    </>
  );
}

const LabelCheckBox = styled.label`
  user-select: none;
  cursor: pointer;
  margin-bottom: 0;
  display: flex;
  align-items: center;

  &:hover .checkbox svg path {
    stroke-dashoffset: 0;
  }

  > span {
    pointer-events: none;
    vertical-align: middle;
    transform: translateY(12%);
  }
`;

const CheckArea = styled.div<{ theme: Theme; checked: boolean }>(
  ({ theme, checked }) => css`
    position: relative;
    top: 2px;
    float: left;
    margin-right: 8px;
    width: 16px;
    height: 16px;
    border: 2px solid
      ${checked ? theme.mode.textAccent : theme.mode.textSecondary};
    border-radius: 3px;

    svg {
      position: absolute;
      top: -2px;
      left: -2px;

      path {
        fill: ${checked ? theme.mode.textAccent : "none"};
        stroke: ${theme.mode.textAccent};
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-dasharray: 71px;
        stroke-dashoffset: ${checked ? "0" : "71px"};
        transition: all 0.6s ease;
      }

      polyline {
        fill: none;
        stroke: #fff;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-dasharray: 18px;
        stroke-dashoffset: ${checked ? "0" : "18px"};
        transition: all 0.3s ease;
      }
    }
  `,
);

const Invisible = styled.input`
  position: absolute;
  z-index: -1;
  width: 0;
  height: 0;
  opacity: 0;
`;

const CheckBoxContainer = styled.div<{ theme: Theme; width: number }>(
  ({ theme, width }) => css`
    width: ${width}px;
    text-align: center;
    padding: 0.6em 1em;

    font-family: ${theme.mode.font.navigation.item};

    border-radius: ${theme.borderRadius.softBox};
    background-color: ${theme.mode.buttonBackground};
  `,
);
