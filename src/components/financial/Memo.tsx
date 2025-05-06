import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { PaginationResponse } from "../../model/pagination";
import { useState } from "react";
import { css, Theme, useTheme } from "@emotion/react";
import { ConfirmAlert, SuccessAlert } from "../Alert/Alerts";
import { updateMemo } from "../../api/financial";
import { ModalHeaderLine, WriteModalContainer } from "../Modal/Modal";
import styled from "@emotion/styled";
import { PlusButton } from "../styled/Button";
import { Editor } from "../Lexical/Editor";
import { TetherAccountType } from "../../model/financial";

export function WriteTetherMemo(props: {
  accountId: number;
  prevContents?: string | null;
  close: () => void;
  refetch: (
    _options?: RefetchOptions,
  ) => Promise<
    QueryObserverResult<PaginationResponse<TetherAccountType>, Error>
  >;
}) {
  const { accountId, prevContents, close, refetch } = props;
  const [contents, setContents] = useState<string>("");
  const theme = useTheme();

  const save = () => {
    ConfirmAlert("저장하시겠습니까?", () =>
      updateMemo({ id: accountId, memo: contents }).then(() => {
        close();
        refetch().then();
        SuccessAlert("저장 완료");
      }),
    );
  };

  return (
    <WriteModalContainer>
      <StyledModalHeaderLine>
        <MemoSaveButton func={save} theme={theme} />
      </StyledModalHeaderLine>
      <Editor prevContents={prevContents} setContents={setContents} />
    </WriteModalContainer>
  );
}

const StyledModalHeaderLine = styled(ModalHeaderLine)`
  justify-content: flex-end;
`;

const MemoSaveButton = styled(PlusButton)<{ theme: Theme }>(
  ({ theme }) => css`
    position: relative;
    right: 10px;

    circle {
      fill: ${theme.mode.textSecondary} !important;
    }
  `,
);
