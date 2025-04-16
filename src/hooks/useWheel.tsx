import { RefObject, useCallback, useEffect, useState } from "react";
import { useEventListener } from "usehooks-ts";
import _ from "lodash";

/** ref로 전달된 컴포넌트에 wheel이벤트를 등록하여 세로 스크롤 동작 대신 가로 스크롤이 동작하게 만듭니다.
 * 횡스크롤 동작은 원래 shift+scroll이지만 scroll만으로도 동작하게 만듭니다.
 */
export function useHorizontalScroll(
  ref: RefObject<HTMLElement | null>,
  disabled?: boolean,
) {
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const scrollElement = ref.current;
      if (!scrollElement || disabled) return;
      e.preventDefault();
      scrollElement.scrollLeft += Number(e.deltaY);
    },
    [ref, disabled],
  );

  useEffect(() => {
    const scrollElement = ref.current;
    if (!scrollElement || disabled) return;

    scrollElement.addEventListener("wheel", handleWheel, { passive: false });
    return () => scrollElement.removeEventListener("wheel", handleWheel);
  });
}

/** ref로 전달된 컴포넌트에 wheel이벤트를 등록하여 특정 상황에서 wheel 이벤트가 전파되지 않도록 합니다.
 */
export function useStopWheelPropagation(
  ref: RefObject<HTMLElement>,
  shouldStop: (_e: WheelEvent) => boolean,
) {
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (shouldStop(e)) {
        e.stopPropagation();
      }
    },
    [shouldStop],
  );

  useEventListener("wheel", handleWheel, ref, { passive: false });
}

export function useScrollLocation() {
  const [scrollLocation, setScroll] = useState({
    x: document.documentElement.scrollLeft,
    y: document.documentElement.scrollTop,
  });
  useEventListener("scroll", () => {
    setScroll({
      x: document.documentElement.scrollLeft,
      y:
        document.documentElement.scrollTop - 50 <= 0
          ? 0
          : document.documentElement.scrollTop - 50,
    });
  });

  return { scrollLocation }; // ✅ { x: number, y: number } 반환
}

interface ItemScrollControlProps<T> {
  itemList: T[];
  itemWidth: number;
  itemGap: number;
  moveParam: number;
}

export function useItemScrollControls<T>(
  itemScrollControlProps: ItemScrollControlProps<T>,
) {
  const { itemList, itemWidth, itemGap, moveParam } = itemScrollControlProps;
  const [nowIndex, setNowIndex] = useState<number>(0);

  const calculateScrollX = (
    itemWidthList: number[],
    index: number,
    gap: number,
  ): number => {
    const sum = _.sum(itemWidthList.slice(0, index).map((width) => width));
    return sum + gap;
  };

  const itemWidthList = itemList.map(() => itemWidth + itemGap);
  const scrollXValue = calculateScrollX(itemWidthList, nowIndex, moveParam);

  const leftButton = () => {
    setNowIndex((prev) => (prev - moveParam <= 0 ? 0 : prev - moveParam));
  };

  const rightButton = () => {
    setNowIndex((prev) =>
      prev + moveParam >= itemList.length - 1 ? prev : prev + moveParam,
    );
  };

  return { scrollXValue, leftButton, rightButton };
}

// hooks.ts
export function useBodyScrollBottomOver(
  fetchNextPage: () => void,
  isFetchingNextPage: boolean,
  hasNextPage: boolean | undefined,
) {
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      const scrollTop = document.documentElement.scrollTop || window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const isScrollingDown = e.deltaY > 0;

      if (!hasNextPage || isFetchingNextPage) return;

      if (isAtBottom && isScrollingDown) {
        fetchNextPage();
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);
}
