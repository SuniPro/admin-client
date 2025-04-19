/** @jsxImportSource @emotion/react */
import { ModalContainer } from "../components/layouts/Frames/FrameLayouts";
import styled from "@emotion/styled";
import { Employee } from "./manage/Employee";
import CampaignIcon from "@mui/icons-material/Campaign";
import { css, Theme, useTheme } from "@emotion/react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useWindowContext } from "../context/WindowContext";
import { useProportionHook } from "../hooks/useWindowHooks";
import Modal from "@mui/material/Modal";
import { ContentsContainer } from "../components/layouts/Layouts";
import { DashboardMenuType } from "../model/menu";
import { Notice } from "./Notice";
import { Financial } from "./manage/Financial";

export function Dashboard(props: { activeMenu: DashboardMenuType }) {
  const { activeMenu } = props;
  const [notifyOpen, setNotifyOpen] = useState<boolean>(false);
  const { user } = useUserContext();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  if (!user) return;

  const menuMatcher = () => {
    switch (activeMenu) {
      case "employeeList":
        return <Employee user={user} />;

      case "notice":
        return <Notice user={user} />;

      case "workTable":
        return <Financial user={user} />;
    }
  };

  return (
    <DashboardContainer>
      <ContentsContainer>
        <NotifyContainer theme={theme} onClick={() => setNotifyOpen(true)}>
          <NotifyArea>
            <i>
              <CampaignIcon color="error" />
            </i>
            <span>공지사항 테스트</span>
          </NotifyArea>
          <div>24.01.01</div>
        </NotifyContainer>
      </ContentsContainer>
      <ContentsContainer>{menuMatcher()}</ContentsContainer>
      <FirstNotifyModal open={notifyOpen} close={() => setNotifyOpen(false)} />
    </DashboardContainer>
  );
}

const NotifyContainer = styled.div<{ theme: Theme }>(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background-color: ${theme.mode.cardBackground};
    box-sizing: border-box;
    padding: 4px 20px;
    border-radius: ${theme.borderRadius.softBox};
    font-family: ${theme.mode.font.component.mainTitle};
    font-weight: bold;
  `,
);

const NotifyArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;

  i {
    transform: translateY(10%);
  }
`;

const DashboardContainer = styled.main`
  width: 100%;
  margin-top: 5.2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;

  box-sizing: border-box;
`;

function FirstNotifyModal(props: { open: boolean; close: () => void }) {
  const { open, close } = props;
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
        <ModalContainer width={size} theme={theme}>
          <div
            css={css`
              height: 40vh;
            `}
          >
            공지사항 테스트
          </div>
        </ModalContainer>
      </>
    </Modal>
  );
}
