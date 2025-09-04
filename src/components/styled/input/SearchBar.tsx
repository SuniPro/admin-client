/** @jsxImportSource @emotion/react */
import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import styled from "@emotion/styled";
import { css, keyframes, Theme, useTheme } from "@emotion/react";
import isPropValid from "@emotion/is-prop-valid";
import { Select, SelectItem } from "@heroui/react";
import { VerticalDivider } from "@/components/layouts";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export interface searchBarProps {
  key: string;
  label: string;
}

export type searchStateType = { value: string; type: string };

export interface searchStateProps {
  search: searchStateType;
  setSearch: Dispatch<SetStateAction<searchStateType>>;
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

export function SearchBar(props: {
  searchState: searchStateProps;
  searchProps: searchBarProps[];

  refetch: (
    _options?: RefetchOptions,
    //eslint-disable-next-line
  ) => Promise<QueryObserverResult<any, Error>>;
}) {
  const theme = useTheme();
  const { search, setSearch } = props.searchState;
  const { searchProps, refetch } = props;

  const [active, setActive] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const searchSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!inputRef.current || !iconRef.current) return;
    event.preventDefault();
    setProcessing(true);
    setActive(false);
    inputRef.current.disabled = true;
    // setSearch((prev) => ({ ...prev, search: "" }));
    refetch().then(() => {
      setProcessing(false);
      inputRef.current!.disabled = false;
      if (search.value === "") {
        setActive(true);
      }
    });
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Container>
        <FinderForm autoComplete="off" onSubmit={(e) => searchSubmit(e)}>
          <Finder className="finder" theme={theme}>
            <FinderOuter className="finder__outer">
              <FinderInner className="finder__inner">
                <div className="w-[80%] flex flex-row justify-start items-center">
                  <FinderIcon
                    className="finder__icon"
                    ref={iconRef}
                    active={active}
                    processing={processing}
                  />
                  <FinderInput
                    className="finder__input"
                    type="text"
                    name="q"
                    placeholder="지갑주소를 입력하세요."
                    onBlur={() => setActive(false)}
                    onFocus={() => setActive(true)}
                    onChange={(e) =>
                      setSearch((prev) => ({ ...prev, value: e.target.value }))
                    }
                    ref={inputRef}
                    theme={theme}
                  />
                </div>
                <div className="flex flex-row justify-end items-center w-[20%]">
                  <VerticalDivider className="mr-5" height={30} />
                  <Select
                    className="w-[140px]"
                    aria-labelledby="search-type-label"
                    variant="underlined"
                    selectedKeys={new Set([search.type])}
                    // onChange={(e) =>
                    //   setSearch((prev) => ({ ...prev, type: e.target.value }))
                    // }
                    onSelectionChange={(keys) => {
                      const val = Array.from(keys)[0] as string | undefined; // keys는 Selection(Set)
                      setSearch((prev) => ({ ...prev, type: val ?? "" }));
                    }}
                    css={css`
                      span {
                        color: ${theme.mode.textPrimary};
                      }
                    `}
                  >
                    {searchProps.map((object) => (
                      <SelectItem key={object.key}>{object.label}</SelectItem>
                    ))}
                  </Select>
                </div>
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
    display: flex;
    width: 100%;
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

const Finder = styled.div<{ theme: Theme }>(
  ({ theme }) => css`
    border: 1px solid ${theme.mode.textSecondary};
    border-radius: ${theme.borderRadius.softBox};
    background-color: ${theme.mode.cardBackground};
    padding: 2px;
    width: 100%;
    box-sizing: border-box;
  `,
);

const FinderOuter = styled.div`
  display: flex;
  padding: 10px 0 10px 10px;
  border-radius: 10px;
`;

const FinderInner = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    position: relative;
    justify-content: space-between;
    flex: 1;
    width: 100%;
    background-color: ${theme.mode.cardBackground};
  `,
);

const FinderInput = styled.input(
  ({ theme }) => css`
    width: 80%;
    height: 30px;
    border: none;
    background-color: transparent;
    outline: none;
    font-size: 16px;
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
        transform: rotateZ(45deg) translate(-50%, 25px);
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
