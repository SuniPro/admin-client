/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Employee } from "./manage/Employee";
import CampaignIcon from "@mui/icons-material/Campaign";
import { css, Theme, useTheme } from "@emotion/react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ContentsContainer } from "../components/layouts/Layouts";
import { DashboardMenuType } from "../model/menu";
import { Financial } from "./manage/Financial";
import { Notify } from "./Notify";
import { useQuery } from "@tanstack/react-query";
import { getLatestNotify } from "../api/notify";
import { CustomModal } from "../components/Modal/Modal";
import { ViewNotify } from "../components/Notify/NotifyList";

export function Dashboard(props: { activeMenu: DashboardMenuType }) {
  const { activeMenu } = props;
  const [notifyOpen, setNotifyOpen] = useState<boolean>(false);
  const { user } = useUserContext();
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: lastNotify } = useQuery({
    queryKey: ["getLatestNotify"],
    queryFn: () => getLatestNotify(),
    refetchInterval: 10000,
  });

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
        return <Notify user={user} />;

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
            <span>{lastNotify?.title}</span>
          </NotifyArea>
          <div>24.01.01</div>
        </NotifyContainer>
      </ContentsContainer>
      <ContentsContainer>{menuMatcher()}</ContentsContainer>
      {lastNotify && (
        <StyledModal
          open={notifyOpen}
          close={() => setNotifyOpen(false)}
          children={
            <ViewNotify
              notify={lastNotify}
              close={() => setNotifyOpen(false)}
            />
          }
        />
      )}
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
  overflow: hidden;
  width: 100%;
  margin-top: 5.2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;

  box-sizing: border-box;
`;

const StyledModal = styled(CustomModal)`
  justify-content: flex-start;
  align-items: center;
`;
