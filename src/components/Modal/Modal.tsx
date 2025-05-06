import { css, Theme, useTheme } from "@emotion/react";
import { useWindowContext } from "../../context/WindowContext";
import { useProportionHook } from "../../hooks/useWindowHooks";
import { Modal } from "@mui/material";
import styled from "@emotion/styled";
import { ReactNode } from "react";
import { Container } from "../layouts/Frames/FrameLayouts";

/** ReactNode를 받아 반응형으로 자녀요소를 모달로 띄우는 컴포넌트입니다.
 * date-area 가 이미 선언되어 있으므로 캘린더 설정 작업을 할때 디자인을 신경쓰지 않아도 됩니다.
 * */
export function CustomModal(props: {
  open: boolean;
  close: () => void;
  children: ReactNode;
  className?: string;
}) {
  const { open, close, children, className } = props;
  const { windowWidth } = useWindowContext();
  const theme = useTheme();

  const { size } = useProportionHook(windowWidth, 600, theme.windowSize.tablet);

  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <>
        <div id="date-area"></div>
        <ModalContainer width={size} theme={theme} className={className}>
          {children}
        </ModalContainer>
      </>
    </Modal>
  );
}

export const ModalContainer = styled.div<{ width: number; theme: Theme }>(
  ({ width, theme }) => css`
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${width}px;
    height: 450px;
    border: 1px solid ${theme.mode.textSecondary};
    border-radius: ${theme.borderRadius.softBox};
    color: ${theme.mode.textPrimary};
    background-color: ${theme.mode.cardBackground};
    overflow-x: hidden;
    overflow-y: scroll;
    box-sizing: border-box;
    padding: 20px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
);

export const ModalHeaderLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const WriteModalContainer = styled(Container)`
  width: 100%;
  flex-direction: column;
  justify-content: center;
`;
