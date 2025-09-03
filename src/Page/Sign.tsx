import styled from "@emotion/styled";
import { Container } from "@/components/layouts/Frames";
import { useRef, useState } from "react";
import { css, Theme, useTheme } from "@emotion/react";
import { FingerPrint } from "@/components/styled/Button";
import { ErrorAlert, SuccessAlert } from "@/components/Alert";
import { SignInType } from "../model/sign";
import { login } from "../api/sign";
import { LogoText } from "../components/Logo/Logo";
import { useNavigate } from "react-router-dom";

export function SignIn() {
  const theme = useTheme();
  const [signInInfo, setSignInInfo] = useState<SignInType>({
    name: "",
    password: "",
  });

  const navigate = useNavigate();

  const pwRef = useRef<HTMLInputElement>(null);

  const autoWritingFocus = () => {
    // 비밀번호 필드에 포커스를 줘서 브라우저 자동완성 유도
    pwRef.current?.focus();
  };

  const signIn = () => {
    login(signInInfo)
      .then(() => {
        SuccessAlert("로그인 되었습니다.");
        navigate("/");
      })
      .catch(() => ErrorAlert("로그인 실패"));
  };

  return (
    <SignContainer theme={theme} height={80}>
      <StyledLogoText fontSize={50} />
      <InputLine>
        <Label>이름</Label>
        <StyledInput
          maxLength={20}
          onChange={(e) =>
            setSignInInfo((prev) => ({ ...prev, name: e.target.value }))
          }
          isCorrect={true}
          backgroundColor={theme.mode.bodyBackground}
          name="username"
          autoComplete="username"
          placeholder="이름을 입력하세요."
          theme={theme}
        />
      </InputLine>
      <InputLine>
        <Label>비밀번호</Label>
        <StyledInput
          ref={pwRef}
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호를 입력하세요."
          backgroundColor={theme.mode.bodyBackground}
          onChange={(e) =>
            setSignInInfo((prev) => ({ ...prev, password: e.target.value }))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") signIn();
          }}
          theme={theme}
        />
      </InputLine>
      <FingerPrint checkFunc={autoWritingFocus} mainFunc={signIn} />
    </SignContainer>
  );
}

const InputLine = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;

  width: 500px;
`;

const Label = styled.span``;

const StyledInput = styled.input<{
  theme: Theme;
  isCorrect?: boolean;
  backgroundColor?: string;
}>(
  ({
    theme,
    isCorrect = true,
    backgroundColor = theme.mode.cardBackground,
  }) => css`
    border: none;
    font-size: 18px;
    width: 300px;
    color: ${isCorrect ? theme.mode.textPrimary : theme.mode.error};
    background-color: ${backgroundColor};

    &:focus-visible {
      outline: none;
    }
  `,
);

const StyledLogoText = styled(LogoText)`
  margin-bottom: 20px;
`;

const SignContainer = styled(Container)<{ theme: Theme; height?: number }>(
  ({ theme, height }) => css`
    height: ${height}vh;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-family: ${theme.mode.font.component.itemDescription};

    font-size: 18px;

    gap: 20px;
  `,
);
