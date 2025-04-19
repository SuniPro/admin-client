import { DashboardMenu, DashboardMenuType } from "../../model/menu";
import { Dispatch, SetStateAction } from "react";
import { css, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { LogoContainer, LogoText } from "../Logo/Logo";
import { FuncItem } from "../styled/Button/Button";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { levelLabelMap } from "../../model/employee";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IconButton } from "@mui/material";
import { StyledBadge } from "./Layouts";

export function Header(props: {
  activeMenu: DashboardMenuType;
  setActiveMenu: Dispatch<SetStateAction<DashboardMenuType>>;
}) {
  const { activeMenu, setActiveMenu } = props;
  const { user } = useUserContext();
  const navigate = useNavigate();

  const theme = useTheme();

  if (!user) return;

  return (
    <HeaderWrapper theme={theme}>
      <LogoContainer width={40 * 1.3} height={40} onClick={() => navigate("/")}>
        <LogoText />
      </LogoContainer>
      <MenuLine>
        {DashboardMenu.map((menu) => (
          <li>
            <StyledFuncItem
              label={menu.label}
              func={() => setActiveMenu(menu.type)}
              isActive={activeMenu === menu.type}
              theme={theme}
            />
          </li>
        ))}
      </MenuLine>
      <UserLine>
        <UserProfile>
          {user.name} {levelLabelMap[user.level]}
        </UserProfile>
        <IconButton>
          <StyledNotifyIcon fontSize="medium" color="success" theme={theme} />
          <StyledBadge badgeContent={2} color="error" overlap="circular" />
        </IconButton>
      </UserLine>
    </HeaderWrapper>
  );
}

const UserProfile = styled.div`
  padding-right: 10px;
`;

const StyledNotifyIcon = styled(NotificationsIcon)<{ theme: Theme }>(
  ({ theme }) => css`
    fill: ${theme.colors.honeyHaze};
    position: absolute;
  `,
);

const HeaderWrapper = styled.div<{ theme: Theme }>(
  ({ theme }) => css`
    // 항상 하위요소들의 최상위에 존재하기 위해 z-index를 추가합니다.
    height: 70px;
    z-index: 1;
    top: 0;
    position: fixed;
    width: 100%;
    box-sizing: border-box;

    font-family: ${theme.mode.font.header.user};
    background-color: ${theme.mode.cardBackground};
    padding: 10px 2rem;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;

      gap: 10px;

      li {
        padding: 0;
      }
    }

    @media ${theme.deviceSize.phone} {
      padding: 10px 4px;
    }
  `,
);

const StyledFuncItem = styled(FuncItem)<{ theme: Theme }>(
  ({ theme }) => css`
    background-color: ${theme.mode.cardBackground};
    font-family: ${theme.mode.font.header.menuItem};
    font-weight: 600;

    color: ${theme.mode.textPrimary};

    &:hover {
      border-color: ${theme.mode.cardBackground};
      color: ${theme.mode.textAccent};
      background-color: ${theme.mode.cardBackground};
    }
  `,
);

const MenuLine = styled.section`
  display: flex;
  flex-direction: row;
  gap: 10px;

  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

const UserLine = styled.section`
  display: flex;
  flex-direction: row;
  gap: 4px;
`;
