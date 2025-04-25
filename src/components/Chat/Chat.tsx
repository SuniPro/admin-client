import { css, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { SendIcon } from "../styled/icons";
import { badgeClasses } from "@mui/material";
import { StyledBadge } from "../layouts/Layouts";
import { Container } from "../layouts/Frames/FrameLayouts";
import Button from "@mui/material/Button";

export function Chat() {
  const theme = useTheme();

  return (
    <ChatContainer>
      <DMButton theme={theme}>
        <StyledSendIcon theme={theme} />
        <NotifyBadge badgeContent={2} color="error" overlap="circular" />
      </DMButton>
    </ChatContainer>
  );
}

const StyledSendIcon = styled(SendIcon)<{ theme: Theme }>(
  ({ theme }) => css`
    path {
      stroke: ${theme.mode.cardBackground};
    }

    transform: translateX(-3%);
  `,
);

const NotifyBadge = styled(StyledBadge)`
  & .${badgeClasses.badge} {
    font-size: 12px;
    position: absolute;
    top: -24px;
    right: -16px;
  }
`;

const DMButton = styled(Button)<{ theme: Theme }>(
  ({ theme }) => css`
    width: 50px;
    min-width: 50px;
    height: 50px;
    min-height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${theme.mode.highlight};
    border-radius: 50%;
  `,
);

const ChatContainer = styled(Container)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
`;
