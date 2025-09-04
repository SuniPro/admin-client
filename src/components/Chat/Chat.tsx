import { css, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { SendIcon } from "../styled/icons";
import { Container } from "../layouts/Frames";
import Button from "@mui/material/Button";

export function Chat() {
  const theme = useTheme();

  const telegramUrl = import.meta.env.VITE_TELEGRAM_URL;

  const telegramOpen = () => {
    window.open(telegramUrl, "_blank");
  };

  return (
    <ChatContainer>
      <DMButton theme={theme}>
        <label onClick={telegramOpen}>
          <StyledSendIcon theme={theme} />
        </label>
      </DMButton>
    </ChatContainer>
  );
}

const StyledSendIcon = styled(SendIcon)`
  transform: translateX(-3%);
`;

// const NotifyBadge = styled(StyledBadge)`
//   & .${badgeClasses.badge} {
//     font-size: 12px;
//     position: absolute;
//     top: -24px;
//     right: -16px;
//   }
// `;

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
