/** @jsxImportSource @emotion/react */
import { ConfirmAlert, SuccessAlert } from "@/components/Alert";
import { HorizontalDivider } from "@/components/layouts";
import { CryptoAccountType } from "@/model/financial";
import { css, useTheme } from "@emotion/react";
import { useState } from "react";
import { Editor } from "../Editor";
import { updateMemo } from "@/api/financial";

export function WriteMemo(props: {
  account: CryptoAccountType;
  memo: string;
  close: () => void;
  refetch: () => void;
}) {
  const { account, memo, close, refetch } = props;
  const [contents, setContents] = useState<string>("");
  const theme = useTheme();

  const submit = () => {
    ConfirmAlert("저장하시겠습니까?", () =>
      updateMemo({ id: account.id, memo: contents }).then(() => {
        close();
        refetch();
        SuccessAlert("저장 완료");
      }),
    );
  };

  return (
    <div
      css={css`
        width: 500px;
        background-color: ${theme.mode.textRevers};
        border-radius: ${theme.borderRadius.softBox};
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          padding: 0 4px;
          height: 40px;

          span {
            width: 50px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            text-wrap: nowrap;
          }
        `}
      >
        <span className="cursor-pointer" onClick={close}>
          취소
        </span>
        <span
          className="cursor-pointer"
          css={css`
            font-weight: 500 !important;
          `}
        >
          메모
        </span>
        <span className="cursor-pointer" onClick={submit}>
          저장
        </span>
      </div>
      <HorizontalDivider width={100} />

      <div
        css={css`
          width: 100%;

          display: flex;
          flex-direction: column;
          gap: 8px;

          overflow-y: scroll;
        `}
      >
        <Editor prevContents={memo} setContents={setContents} />
      </div>
    </div>
  );
}
