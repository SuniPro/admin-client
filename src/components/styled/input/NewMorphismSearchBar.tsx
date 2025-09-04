import {
  Dispatch,
  FormEvent,
  RefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";
import styled from "@emotion/styled";
import { css, keyframes, Theme, useTheme } from "@emotion/react";
import isPropValid from "@emotion/is-prop-valid";
import { ErrorAlert } from "@/components/Alert";
import { useDarkMode } from "usehooks-ts";

export interface searchStateProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

type FinderIconProps = {
  active?: boolean;
  processing?: boolean;
};

const SpinnerKeyFrames = keyframes`
    0% {
        transform: rotateZ(45deg);
    }
    100% {
        transform: rotateZ(405deg);
    }
`;
const SpinnerLiftKeyFrames = keyframes`
    0% {
        transform: translateY(-5px) rotateZ(45deg);
    }
    100% {
        transform: translateY(-5px) rotateZ(405deg);
    }
`;

export function NewMorphismSearchBar(props: {
  searchInputRef: RefObject<HTMLInputElement | null>;
  searchState: searchStateProps;
  submitChain: (_searchValue: string) => Promise<void>;
}) {
  const { searchInputRef, submitChain } = props;
  const { search, setSearch } = props.searchState;
  const { isDarkMode } = useDarkMode();
  const theme = useTheme();

  const [active, setActive] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const searchSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!searchInputRef.current) return;
    event.preventDefault();
    setProcessing(true);
    setActive(false);
    searchInputRef.current.disabled = true;
    submitChain(search)
      .then(() => {
        searchInputRef.current!.disabled = false;
        setProcessing(false);
      })
      .catch(() => ErrorAlert("지갑 거래내역 조회 실패"))
      .finally(() => {
        if (search === "") {
          setActive(true);
        }
      });
  };

  const iconRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Container>
        <FinderForm autoComplete="off" onSubmit={(e) => searchSubmit(e)}>
          <Finder className="finder" theme={theme} boxShadow={isDarkMode}>
            <FinderOuter
              className="finder__outer"
              boxShadow={isDarkMode}
              backgroundColor={
                isDarkMode ? theme.colors.midnightBlack : undefined
              }
            >
              <FinderInner className="finder__inner">
                <FinderIcon
                  className="finder__icon"
                  ref={iconRef}
                  active={active}
                  processing={processing}
                />
                <FinderInput
                  className="finder__input"
                  type="text"
                  placeholder="지갑주소를 입력하세요."
                  name="q"
                  onBlur={() => setActive(false)}
                  onFocus={() => setActive(true)}
                  onChange={(e) => setSearch(e.target.value)}
                  ref={searchInputRef}
                />
              </FinderInner>
            </FinderOuter>
          </Finder>
        </FinderForm>
      </Container>
    </>
  );
}

const Container = styled.div(
  ({ theme }) => css`
    text-align: center;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    color: ${theme.mode.textPrimary};

    form {
      transition: all 0.5s;
    }
  `,
);

const FinderForm = styled.form`
  flex: 1;
  width: 100%;
`;

const Finder = styled.div<{ theme: Theme; boxShadow: boolean }>(
  ({ theme, boxShadow }) => css`
    border: 1px solid ${theme.mode.cardBackground};
    background-color: ${theme.mode.cardBackground};
    border-radius: ${theme.borderRadius.softBox};
    padding: 8px;
    width: 100%;
    ${boxShadow &&
    css`
      box-shadow:
        1px 1px 16px rgba(189, 189, 189, 0.6),
        -9px -9px 16px rgba(255, 255, 255, 0.5);
    `}
  `,
);

const FinderOuter = styled.div<{
  backgroundColor?: string;
  boxShadow: boolean;
}>(
  ({ backgroundColor, boxShadow }) => css`
    display: flex;
    padding: 14px 20px;
    border-radius: 10px;
    background-color: ${backgroundColor};
    ${boxShadow &&
    css`
      box-shadow:
        inset 10px 10px 15px -10px #e9e9e9,
        inset -10px -10px 15px -10px #ffffff;
    `}
  `,
);

const FinderInner = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
`;

const FinderInput = styled.input(
  ({ theme }) => css`
    width: 100%;
    height: calc(100% + 3rem);
    border: none;
    background-color: transparent;
    outline: none;
    font-size: 1.5rem;
    letter-spacing: 0.75px;
    font-family: ${theme.mode.font.search};
  `,
);

const FinderIcon = styled("div", {
  // active/processing 같은 커스텀 prop이 DOM 속성으로 나가지 않게 차단
  shouldForwardProp: (prop) =>
    isPropValid(prop) && prop !== "active" && prop !== "processing",
})<FinderIconProps>(
  ({ active, processing }) => css`
    width: 30px;
    height: 30px;
    margin-right: 1rem;
    transition: all 0.2s;
    box-shadow: inset 0 0 0 20px #292929;
    border-radius: 50%;
    position: relative;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    &:after {
      width: 12px;
      height: 12px;
      background-color: #292929;
      border: 3px solid #f6f5f0;
      top: 50%;
      position: absolute;
      transform: translateY(-50%);
      left: 0;
      right: 0;
      margin: auto;
      border-radius: 50%;

      ${active &&
      css`
        border-width: 8px;
        background-color: #f6f5f0;
      `}
    }

    &:before {
      width: 4px;
      height: 10px;
      background-color: #f6f5f0;
      top: 50%;
      left: 20px;
      transform: rotateZ(45deg) translate(-80%, 20%);
      transform-origin: 0 0;
      border-radius: 4px;

      ${active &&
      css`
        background-color: #292929;
        width: 6px;
        transform: rotateZ(45deg) translate(-50%, 20px);
      `}
    }

    ${processing &&
    css`
      transform-origin: 50%;
      animation: ${active ? SpinnerLiftKeyFrames : SpinnerKeyFrames} 0.3s linear
        infinite;
      animation-delay: 0.5s;
      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    `}

    ${active &&
    !processing &&
    css`
      transform: translateY(-5px);
    `}
  `,
);
