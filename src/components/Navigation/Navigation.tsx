import _ from "lodash";
import React, { useRef } from "react";
import styled from "@emotion/styled";
import { useHorizontalScroll } from "../../hooks/useWheel";
import { FuncItem } from "../styled/Button/Button";
import { css, Theme, useTheme } from "@emotion/react";
import { useParams } from "react-router-dom";
import { miniGames, sportsMenu } from "./navigationMenuList";
import { TransactionStatusType } from "../../model/financial";

const NAVIGATION_SUMMARY_WIDTH = 0;
const NAVIGATION_PADDING = 10;
const SUMMARY_PADDING_LEFT = 10;
const SUMMARY_PADDING_RIGHT = 20;
const CONTAINER_PADDING = 10;
const ITEM_GAP = 20;

const MENU_LIST = (path: string) => {
  switch (path) {
    case "sports":
      return sportsMenu;
    case "mini":
      return miniGames;
    default:
      return sportsMenu;
  }
};

// index에 해당하는 item이 화면 중앙에 위치할 수 있는 scrollX 값을 얻어냅니다.
const calculateScrollX = (
  containerWidth: number,
  itemWidthList: number[],
  index: number,
): number => {
  const sum = _.sum(itemWidthList.slice(0, index).map((width) => width));
  return (
    // 현재 선택한 아이템이 위치해야할
    sum +
    ITEM_GAP +
    // eslint-disable-next-line security/detect-object-injection
    itemWidthList[index] -
    (containerWidth - CONTAINER_PADDING * 2) / 2
  );
};

interface MenuListType {
  status: string;
  label: string;
}

interface NavigationPropsType {
  className?: string;
  navigationItemWidth: number;
  navigationContainerWidth: number;
  menuList: MenuListType[];
  activeStatus: TransactionStatusType;
  setActiveStatus: React.Dispatch<React.SetStateAction<TransactionStatusType>>;
  justifyContent?: string;
}

export function Navigation(props: NavigationPropsType) {
  const {
    className,
    navigationContainerWidth,
    navigationItemWidth,
    menuList,
    activeStatus,
    setActiveStatus,
    justifyContent,
  } = props;
  const { lastPath } = useParams();

  const theme = useTheme();

  const ref = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const itemWidthList = [
    NAVIGATION_SUMMARY_WIDTH + 1 + SUMMARY_PADDING_LEFT + SUMMARY_PADDING_RIGHT,
    ...MENU_LIST(lastPath ? lastPath : "sports").map(
      () => navigationItemWidth + ITEM_GAP,
    ),
  ];

  const scrollXValue = calculateScrollX(
    /*실제 container는 width가 100%로 적용되어 있으므로,ref.current.offsetWidth를 기본 반영하나,
     * 만약 없을 경우는 직접 계산한 navigationContainerWidth를 반영합니다.
     * */
    ref.current ? ref.current.offsetWidth : navigationContainerWidth,
    itemWidthList,
    menuList.findIndex((row) => activeStatus === row.status),
  );
  useHorizontalScroll(navRef);

  return (
    <Container
      ref={ref}
      className={className}
      justifyContent={justifyContent}
      theme={theme}
    >
      <NavigationMover
        onMouseLeave={() => {
          navRef.current?.scrollTo({
            left: scrollXValue,
            top: 0,
            behavior: "smooth",
          });
        }}
        ref={navRef}
      >
        {/*<SummaryTab>*/}
        {/*  <SummaryTitle>*/}
        {/*    SPORTS*/}
        {/*    /!*{lastPath?.toUpperCase()}*!/*/}
        {/*  </SummaryTitle>*/}
        {/*  <Divider />*/}
        {/*</SummaryTab>*/}
        <ActivityNavigation>
          {menuList.map((row, index) => (
            <React.Fragment key={index}>
              <NavigationFuncItem
                isActive={activeStatus === row.status}
                func={() =>
                  setActiveStatus(row.status as TransactionStatusType)
                }
                label={row.label}
                width={navigationItemWidth}
                justifyContent="center"
              />
            </React.Fragment>
          ))}
        </ActivityNavigation>
      </NavigationMover>
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

const NavigationMover = styled.div`
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

const ActivityNavigation = styled.nav`
  display: inline-flex;
  padding: 0 ${NAVIGATION_PADDING}px;
  align-items: center;
  gap: ${ITEM_GAP}px;
`;

const NavigationFuncItem = styled(FuncItem)<{
  width: number;
  justifyContent: "center" | "flex-start";
}>(
  ({ width, justifyContent, theme }) => css`
    width: ${width}px;
    align-items: center;
    white-space: nowrap;
    justify-content: ${justifyContent};
    font-family: ${theme.mode.font.navigation.item};
    display: flex;
    flex-direction: row;

    span {
      padding: 0;
    }

    @media ${theme.deviceSize.phone} {
      width: 80px;
      font-size: 15px;
    }
  `,
);
