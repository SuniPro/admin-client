import { DashboardMenu, DashboardMenuType } from "../../model/menu";
import { Dispatch, SetStateAction, useEffect } from "react";
import { css, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { FuncItem } from "../styled/Button";
import { useNavigate } from "react-router-dom";
import { useEmployeeContext } from "../../context/EmployeeContext";
import { levelLabelMap } from "@/model/employee";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IconButton } from "@mui/material";
import { StyledBadge } from "./Layouts";
import { useQuery } from "@tanstack/react-query";
import { getUnreadNotifyCount } from "@/api/notify";
import { ConfirmAlert, SuccessAlert } from "../Alert";
import { logout } from "@/api/sign";
import notifyAlert from "../../assets/sound/alert/notify.wav";
import useSound from "use-sound";

export function Header(props: {
  activeMenu: DashboardMenuType;
  setActiveMenu: Dispatch<SetStateAction<DashboardMenuType>>;
}) {
  const { activeMenu, setActiveMenu } = props;
  const { employee, isError } = useEmployeeContext();
  const navigate = useNavigate();

  const { data: notifyCount } = useQuery({
    queryKey: ["getCountUnReadAboutNotify"],
    queryFn: () => getUnreadNotifyCount(),
    refetchInterval: 300000,
    enabled: Boolean(employee),
  });

  const [play] = useSound(notifyAlert);
  useEffect(() => {
    if (notifyCount && notifyCount > 0) {
      play(); // depositStatus가 PENDING이고 depositList 길이가 0이 아니면 항상 play 실행
    }
  }, [notifyCount, play]);

  const theme = useTheme();

  if (!employee) return;

  if (isError) return;

  const dashboardMenuHandle = () => {
    if (
      employee.level === "ADMINISTRATOR" ||
      employee.level === "DEVELOPER" ||
      employee.level === "MANAGER"
    ) {
      return DashboardMenu;
    } else {
      return DashboardMenu.slice(0, 3);
    }
  };

  return (
    <HeaderWrapper theme={theme}>
      <HeaderLogo className="text-3xl" theme={theme}>
        i coins
      </HeaderLogo>
      <MenuLine>
        {dashboardMenuHandle().map((menu) => (
          <li key={menu.label}>
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
        <UserProfile
          onClick={() =>
            ConfirmAlert("로그아웃하시겠습니까?", () =>
              logout().then(() => {
                SuccessAlert("로그아웃 되었습니다.");
                navigate("/login");
                window.location.reload();
              }),
            )
          }
        >
          {employee.name} {levelLabelMap[employee.level]}
        </UserProfile>
        <IconButton>
          <StyledNotifyIcon
            fontSize="medium"
            color="success"
            theme={theme}
            onClick={() => setActiveMenu("notice")}
          />
          <StyledBadge
            badgeContent={notifyCount ? notifyCount : 0}
            color="error"
            overlap="circular"
          />
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

const HeaderLogo = styled.span<{ theme: Theme }>(
  ({ theme }) => css`
    font-weight: 800;
    transform: translateY(6%);

    color: ${theme.colors.azure};
    font-family: ${theme.mode.font.logo};
  `,
);
