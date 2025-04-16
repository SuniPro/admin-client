/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useMemo } from "react";
import { uid } from "uid";

export interface PointerProps {
  className?: string;
  angle: number;
  color: string;
  length: number;
  /** 포인터 끝에 오는 아이콘 */
  icon: React.ReactNode;
  // 아이콘의 위치를 position으로 수정하면 회전한 후에 위치가 변경되므로 transform으로 위치를 조정합니다.
  /** 아이콘 위치 조정 */
  iconTranslate?: string;
}

/** AnalogMeter 컴포넌트의 계기판 포인터(바늘)을 나타내는 컴포넌트입니다.
 * 포인터의 끝에 오는 아이콘의 경우 수평을 유지해야 하므로 역회전을 적용해야 합니다.
 */
export default function Pointer(props: PointerProps) {
  const { className, angle, color, length, icon, iconTranslate } = props;
  // 포인터마다 회전해야하는 각도 애니메이션이 다르므로 고유한 id를 부여합니다.
  const uniqueId = useMemo(uid, []);
  return (
    <div
      className={className}
      css={css`
        display: flex;
        gap: 2px;
        height: 5px;
        align-items: center;
        position: absolute;
        right: 100px;
        bottom: -2px;
        transition: transform 0.3s;
        transform: rotate(${angle}deg);
        transform-origin: right;
        animation: pointer-animate-${uniqueId} 0.3s ease-in;
        @keyframes pointer-animate-${uniqueId} {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(${angle}deg);
          }
        }
      `}
    >
      {/** 포인터 Icon 부분 */}
      <div
        css={css`
          transition: transform 0.3s;
          // 아이콘의 위치를 조정한 후, 역회전합니다.
          transform: ${iconTranslate} rotate(-${angle}deg);
          animation: icon-animate-${uniqueId} 0.3s ease-in;
          @keyframes icon-animate-${uniqueId} {
            0% {
              transform: ${iconTranslate} rotate(0deg);
            }
            100% {
              transform: ${iconTranslate} rotate(-${angle}deg);
            }
          }
        `}
      >
        {icon}
      </div>
      {/** 포인터 Bar 부분 */}
      <div
        css={css`
          width: ${length}px;
          height: 5px;
          background-color: ${color};
        `}
      />
    </div>
  );
}
