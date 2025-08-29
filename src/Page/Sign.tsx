import styled from "@emotion/styled";
import { Container } from "../components/layouts/Frames";
import { useRef, useState } from "react";
import { css, Theme, useTheme } from "@emotion/react";
import {
  departmentLabelMap,
  departmentList,
  DepartmentType,
  EmployeeType,
  levelLabelMap,
  levelList,
  LevelType,
  SignUpFormType,
  UpdateEmployeeType,
} from "../model/employee";
import { FingerPrint } from "../components/styled/Button";
import { ErrorAlert, SuccessAlert } from "../components/Alert";
import { createEmployee, updateEmployee } from "../api/employee";
import { SignInType } from "../model/sign";
import { login } from "../api/sign";
import { LogoText } from "../components/Logo/Logo";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { PaginationResponse } from "../model/pagination";
import { DateTime } from "luxon";
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

export function SignUp(props: {
  user: EmployeeType;
  close: () => void;
  refetch: (
    _options?: RefetchOptions,
  ) => Promise<QueryObserverResult<PaginationResponse<EmployeeType>, Error>>;
}) {
  const { user, close, refetch } = props;
  const theme = useTheme();
  const [employee, setEmployee] = useState<SignUpFormType>({
    name: "",
    password: "",
    department: "OFFICE",
    level: "STAFF",
    insertName: user.name,
  });
  const [passwordCorrect, setPasswordCorrect] = useState<string>("");

  const check = () => {
    if (employee.password.length < 8) {
      ErrorAlert("비밀번호가 8자 미만입니다.");
    } else if (employee.password !== passwordCorrect) {
      ErrorAlert("비밀번호가 일치하지 않습니다.");
    } else if (employee.name.length < 2) {
      ErrorAlert("이름은 최소 2글자 이상이어야합니다.");
    }
  };

  const register = () => {
    createEmployee(employee).then(() => {
      close();
      refetch().then(() => SuccessAlert("가입되었습니다."));
    });
  };

  return (
    <SignContainer theme={theme}>
      <InputLine>
        <Label>이름</Label>
        <StyledInput
          maxLength={20}
          onChange={(e) =>
            setEmployee((prev) => ({ ...prev, name: e.target.value }))
          }
          isCorrect={employee.name.length > 1}
          placeholder="사용할 이름을 작성하세요."
          theme={theme}
        />
      </InputLine>
      <InputLine>
        <Label>비밀번호</Label>
        <StyledInput
          type="password"
          placeholder="비밀번호는 8자 이상으로 작성하세요."
          isCorrect={employee.password.length > 7}
          onChange={(e) => {
            setEmployee((prev) => ({ ...prev, password: e.target.value }));
          }}
          theme={theme}
        />
      </InputLine>
      <InputLine>
        <Label>비밀번호 확인</Label>
        <StyledInput
          type="password"
          placeholder="비밀번호를 한번 더 작성하세요."
          onChange={(e) => setPasswordCorrect(e.target.value)}
          isCorrect={passwordCorrect === employee.password}
          theme={theme}
        />
      </InputLine>
      <InputLine>
        <Label>부서</Label>
        <StyledSelect
          theme={theme}
          onChange={(e) =>
            setEmployee((prev) => ({
              ...prev,
              department: e.target.value as DepartmentType,
            }))
          }
        >
          {departmentList.map((value) => (
            <option value={value}>
              {departmentLabelMap[value as DepartmentType]}
            </option>
          ))}
        </StyledSelect>
      </InputLine>
      <InputLine>
        <Label>직책</Label>
        <StyledSelect
          theme={theme}
          onChange={(e) =>
            setEmployee((prev) => ({
              ...prev,
              level: e.target.value as LevelType,
            }))
          }
        >
          {levelList.map((value) => (
            <option value={value}>{levelLabelMap[value as LevelType]}</option>
          ))}
        </StyledSelect>
      </InputLine>
      <FingerPrint checkFunc={check} mainFunc={register} />
    </SignContainer>
  );
}

export function UpdateEmployee(props: {
  user: EmployeeType;
  targetEmployee: EmployeeType;
  close: () => void;
  refetch: (
    _options?: RefetchOptions,
  ) => Promise<QueryObserverResult<PaginationResponse<EmployeeType>, Error>>;
}) {
  const { user, targetEmployee, close, refetch } = props;
  const theme = useTheme();
  const [passwordCorrect, setPasswordCorrect] = useState<string>("");
  const [employee, setEmployee] = useState<UpdateEmployeeType>({
    id: targetEmployee.id,
    name: targetEmployee.name,
    password: "",
    department: targetEmployee.department,
    level: targetEmployee.level,
    insertName: targetEmployee.insertName,
    insertDateTime: targetEmployee.insertDateTime,
    updateName: user.name,
    updateDateTime: DateTime.now()
      .setZone("Asia/Singapore")
      .toISO({ includeOffset: false })!,
  });

  const check = () => {
    if (employee.password !== "" && passwordCorrect.length < 8) {
      ErrorAlert("비밀번호가 8자 미만입니다.");
    } else if (employee.name.length < 2) {
      ErrorAlert("이름은 최소 2글자 이상이어야합니다.");
    }
  };

  const update = () => {
    updateEmployee(employee)
      .then(() => {
        close();
        refetch().then(() => SuccessAlert("수정되었습니다."));
      })
      .catch((e) => ErrorAlert(e.message));
  };

  return (
    <SignContainer theme={theme}>
      <InputLine>
        <Label>이름</Label>
        <StyledInput
          maxLength={20}
          defaultValue={targetEmployee.name}
          onChange={(e) =>
            setEmployee((prev) => ({ ...prev, name: e.target.value }))
          }
          isCorrect={employee.name.length > 1}
          placeholder="사용할 이름을 작성하세요."
          theme={theme}
        />
      </InputLine>
      <InputLine>
        <Label>비밀번호</Label>
        <StyledInput
          type="password"
          placeholder="비밀번호는 8자 이상으로 작성하세요."
          isCorrect={employee.password.length > 7}
          onChange={(e) => {
            setEmployee((prev) => ({ ...prev, password: e.target.value }));
          }}
          theme={theme}
        />
      </InputLine>
      <InputLine>
        <Label>비밀번호 확인</Label>
        <StyledInput
          type="password"
          placeholder="비밀번호를 한번 더 작성하세요."
          onChange={(e) => setPasswordCorrect(e.target.value)}
          isCorrect={passwordCorrect === employee.password}
          theme={theme}
        />
      </InputLine>
      <InputLine>
        <Label>부서</Label>
        <StyledSelect
          theme={theme}
          defaultValue={targetEmployee.department}
          onChange={(e) =>
            setEmployee((prev) => ({
              ...prev,
              department: e.target.value as DepartmentType,
            }))
          }
        >
          {departmentList.map((value) => (
            <option value={value}>
              {departmentLabelMap[value as DepartmentType]}
            </option>
          ))}
        </StyledSelect>
      </InputLine>
      <InputLine>
        <Label>직책</Label>
        <StyledSelect
          theme={theme}
          defaultValue={targetEmployee.level}
          onChange={(e) =>
            setEmployee((prev) => ({
              ...prev,
              level: e.target.value as LevelType,
            }))
          }
        >
          {levelList.map((value) => (
            <option value={value}>{levelLabelMap[value as LevelType]}</option>
          ))}
        </StyledSelect>
      </InputLine>
      <FingerPrint checkFunc={check} mainFunc={update} />
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

const StyledSelect = styled.select<{ theme: Theme }>(
  ({ theme }) => css`
    border: none;
    font-size: 18px;
    width: 300px;
    background: ${theme.mode.cardBackground};

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
