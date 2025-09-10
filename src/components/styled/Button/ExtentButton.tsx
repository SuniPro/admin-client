import { ReactNode, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import AddIcon from "@mui/icons-material/Add";

export interface OptionType {
  count: number;
  key: string;
  icons: ReactNode[];
}

const btnSize = 40; // px
const subBtnSize = 40; // px
const layoutRadius = 60; // px
const transitionSpd = 0.25; // s
const transitionStep = 0.1; // s

export function ExtentButton(props: { option: OptionType }) {
  const { option } = props;
  const { count, key: variantKey } = option;

  const [isExtent, setIsExtent] = useState(false);

  /**
   * 옵션 버튼을 배치할 좌표를 계산합니다.
   *
   * @param idx    - 버튼 순서 (1부터 시작)
   * @param total  - 옵션 버튼 개수 (primary 버튼 제외)
   * @param start  - 시작각 (도 단위, 0° = 오른쪽 → 시계방향 양수)
   * @param end    - 끝각   (도 단위)
   * @returns      - CSS translate(x, y) 문자열
   */
  const calculatePosition = (
    idx: number,
    total: number,
    start: number,
    end: number,
  ): string => {
    let options = total;

    /* 옵션버튼이 배치될 각도를 지정합니다.
     * 원형으로 구현될 예정이니 원형 4등분의 한 조각이라고 생각해도 무방합니다.
     * */
    const range = end - start;

    /* 옵션버튼 gap의 각도를 계산하기위한 과정입니다.
     * n 개의 버튼은 n-1개의 gap을 가지기 때문에 options -1을 통해 이를 확보합니다.
     * */
    if (range < 360 && options > 1) options -= 1;

    /* 첫번째 옵션 요소의 배치 위치를 결정합니다.
     * i=1 → θ=start, i=segments+1 → θ=start+range
     *  * */
    const angle = start + (range / options) * (idx - 1);

    /* (라디안) 결정된 위치를 원형으로 배치하기 위해 π로 원의 중심으로부터의 거리를 정확히 판별합니다.  * */
    const rad = (Math.PI / 180) * angle;

    // 5) 원 위 좌표 (r=layoutRadius)
    const x = layoutRadius * Math.cos(rad);
    const y = layoutRadius * Math.sin(rad);
    return `translate(${x}px, ${y}px)`;
  };

  return (
    <>
      <ButtonContainer data-options={variantKey}>
        {/* primary 버튼 */}
        <PrimaryButton onClick={() => setIsExtent((prev) => !prev)}>
          <AddButton rotate={isExtent ? "rotate(45deg)" : "rotate(0deg)"} />
        </PrimaryButton>
        {option.icons.map((icon, i) => (
          <OptionButton
            key={i}
            isExtent={isExtent}
            transform={
              isExtent
                ? calculatePosition(i + 1, count, 180, 270)
                : "translate(0, 0)"
            }
            optionIndex={i + 1}
            transitionStep={transitionStep}
          >
            <ChildIcon className="material-icons">{icon}</ChildIcon>
          </OptionButton>
        ))}
      </ButtonContainer>
    </>
  );
}

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 2%;
  right: 2%;
  height: ${btnSize}px;
  width: ${btnSize}px;
  border-radius: 40px;
`;

const PrimaryButton = styled.button`
  background-color: #2196f3;
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  z-index: 7;
  width: ${btnSize}px;
  height: ${btnSize}px;
  border-radius: ${btnSize}px;
  cursor: pointer;
  outline: none;
`;

const AddButton = styled(AddIcon)<{ rotate: string }>(
  ({ rotate }) => css`
    transform: rotate(${rotate});
    font-size: 24px;
    position: absolute;
    top: 25%;
    left: 26%;
    width: ${btnSize / 2}px;
    height: ${btnSize / 2}px;
    transition: transform ${transitionSpd}s ease;
    color: #fafafa;
  `,
);

const OptionButton = styled.button<{
  isExtent: boolean;
  transform: string;
  optionIndex: number;
  transitionStep: number;
}>(
  ({ isExtent, transform, optionIndex, transitionStep }) => css`
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${subBtnSize}px;
    height: ${subBtnSize}px;
    margin-left: ${-subBtnSize / 2}px;
    margin-top: ${-subBtnSize / 2}px;
    border: none;
    border-radius: ${subBtnSize}px;
    cursor: pointer;
    outline: none;
    opacity: ${isExtent ? 1 : 0};
    transform: ${transform};
    transition:
      transform ${transitionSpd}s ease ${optionIndex * transitionStep}s,
      opacity ${transitionSpd}s ease ${optionIndex * transitionStep}s;
  `,
);

const ChildIcon = styled.div`
  position: absolute;
  transform: translate(10%, -45%);
  font-size: 18px;
  line-height: 18px;
`;
