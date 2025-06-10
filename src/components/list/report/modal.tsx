/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import { ReportType } from "../../../model/report";
import styled from "@emotion/styled";
import { Container } from "../../layouts/Frames";
import { ModalHeaderLine } from "../../Modal";
import {
  departmentLabelMap,
  DepartmentType,
  EmployeeType,
  levelLabelMap,
  LevelType,
} from "../../../model/employee";
import { iso8601ToYYMMDDHHMM } from "../../styled/Date/DateFomatter";
import { StyledTitleInput } from "./ReportList";
import { LexicalViewer } from "../../../modules/lexical-editor/lexical/src/Editor";
import { useState } from "react";
import { PlusButton } from "../../styled/Button";
import { ConfirmAlert, ErrorAlert, SuccessAlert } from "../../Alert";
import { updateReport } from "../../../api/report";
import { DateTime } from "luxon";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { PaginationResponse } from "../../../model/pagination";
import { LexicalEditor } from "../../../modules/lexical-editor/lexical/src/LexicalEditor";

const ModalContainer = styled(Container)`
  width: 100%;
  flex-direction: column;
  justify-content: center;
`;

const StyledPlusButton = styled(PlusButton)`
  position: relative;
`;

export function EditReport(props: {
  user: EmployeeType;
  refetch: (
    _options?: RefetchOptions,
  ) => Promise<QueryObserverResult<PaginationResponse<ReportType>, Error>>;
  report?: ReportType;
  close: () => void;
}) {
  const { user, refetch, report, close } = props;
  const [title, setTitle] = useState<string>(report?.title ?? "");
  const [contents, setContents] = useState<string>("");
  const theme = useTheme();

  if (!report) return;

  return (
    <ModalContainer>
      <div
        css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 1vw;
          box-sizing: border-box;
          gap: 2vh;

          > div {
            width: 100%;
            margin: 0;
            border: 1px solid ${theme.mode.textSecondary};
            border-radius: ${theme.borderRadius.softBox};
          }

          .editor-shell {
            max-width: none !important;
          }

          .actions {
            margin: 0 !important;
          }
        `}
      >
        <article
          css={css`
            display: flex;
            flex-direction: row;
            align-items: center;
          `}
        >
          <StyledTitleInput
            theme={theme}
            placeholder="제목을 입력하세요."
            defaultValue={report.title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <StyledPlusButton
            func={() =>
              ConfirmAlert("수정하시겠습니까?", () =>
                updateReport({
                  id: report.id,
                  employee: user,
                  title,
                  reportContents: contents,
                  insertDateTime: report.insertDateTime,
                  updateDateTime: DateTime.now()
                    .setZone("Asia/Singapore")
                    .toISO({ includeOffset: false })!,
                }).then(() => {
                  setTitle("");
                  setContents("");
                  SuccessAlert("저장완료");
                  refetch().then(() => close());
                }),
              )
            }
            theme={theme}
          />
        </article>
        <LexicalEditor
          contents={report.reportContents}
          setContents={setContents}
        />
      </div>
    </ModalContainer>
  );
}

export function ViewReport(props: { report?: ReportType; close: () => void }) {
  const { report } = props;
  const theme = useTheme();

  if (!report) return;

  try {
    JSON.parse(report.reportContents);
    // eslint-disable-next-line no-unused-vars
  } catch (_) {
    ErrorAlert("리포트 내용을 불러오는 데 실패했습니다.");
    return null;
  }

  return (
    <ModalContainer>
      <ModalHeaderLine
        css={css`
          position: absolute;
          gap: 1vw;
          justify-content: flex-end;
          top: 4%;
          right: 2%;
          font-size: 1.2em;
        `}
      >
        <span>
          {departmentLabelMap[report.employee.department as DepartmentType]}
        </span>
        <span>{levelLabelMap[report.employee.level as LevelType]}</span>
        <span>{report.employee.name}</span>
        <span>{iso8601ToYYMMDDHHMM(report.insertDateTime)}</span>
      </ModalHeaderLine>
      <ModalHeaderLine>
        <StyledTitleInput
          theme={theme}
          placeholder="제목을 입력해주세요."
          value={report.title}
          css={css`
            border: none;
          `}
          readOnly
        />
      </ModalHeaderLine>
      <LexicalViewer initialEditorState={report.reportContents} />
    </ModalContainer>
  );
}
