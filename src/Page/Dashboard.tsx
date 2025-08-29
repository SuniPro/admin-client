/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { css, Theme, useTheme } from "@emotion/react";
import { useEmployeeContext } from "../context/UserContext";
import { ContentsContainer } from "@/components/layouts";
import { DashboardMenuType } from "../model/menu";
import { CustomModal } from "@/components/Modal";
import { CryptoAccount } from "./manage/CryptoAccount";
import { CryptoDeposit } from "./manage/CryptoDeposit";
import { Site } from "./manage/Site";
import { Notify } from "./Notify";
import { getLatestNotify } from "@/api/notify";
import { useQuery } from "@tanstack/react-query";
import CampaignIcon from "@mui/icons-material/Campaign";
import { useState } from "react";
import { iso8601ToYYMMDDHHMM } from "@/components/styled/Date/DateFomatter";
import { ViewNotify } from "@/components/Notify/NotifyList";

export function Dashboard(props: { activeMenu: DashboardMenuType }) {
  const { activeMenu } = props;

  const [notifyOpen, setNotifyOpen] = useState<boolean>(false);
  const { employee } = useEmployeeContext();
  const theme = useTheme();

  const { data: lastNotify } = useQuery({
    queryKey: ["getLatestNotify"],
    queryFn: () => getLatestNotify(),
    refetchInterval: 300000,
  });

  if (!employee) return;

  const menuMatcher = () => {
    switch (activeMenu) {
      case "userManage":
        return <CryptoAccount />;

      case "depositManage":
        return <CryptoDeposit />;

      case "siteManage":
        return <Site employee={employee} />;
      case "notice":
        return <Notify />;
    }
  };
  return (
    <DashboardContainer>
      <ContentsContainer>
        {lastNotify && (
          <NotifyContainer theme={theme} onClick={() => setNotifyOpen(true)}>
            <NotifyArea>
              <i>
                <CampaignIcon color="error" />
              </i>
              <span>{lastNotify.title}</span>
            </NotifyArea>
            <div>{iso8601ToYYMMDDHHMM(lastNotify.insertDateTime)}</div>
          </NotifyContainer>
        )}
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
