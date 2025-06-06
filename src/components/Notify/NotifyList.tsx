/** @jsxImportSource @emotion/react */
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnResizeMode,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { NotifyType } from "../../model/notify";
import {
  EmployeeType,
  levelLabelMap,
  levelList,
  LevelType,
} from "../../model/employee";
import { iso8601ToYYMMDDHHMM } from "../styled/Date/DateFomatter";
import { Container } from "../layouts/Frames";
import { css, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { FuncItem, PlusButton } from "../styled/Button";
import { EllipsisCase, EmailSearch, HorizontalDivider } from "../layouts";
import { Pagination, TableBody, TableHeader } from "../Table";
import { CustomModal, EditorModalContainer, ModalHeaderLine } from "../Modal";
import { createNotify } from "../../api/notify";
import { ErrorAlert, SuccessAlert } from "../Alert";
import { LexicalEditor } from "../../modules/lexical-editor/lexical/src/LexicalEditor";
import { Viewer } from "../Lexical/Editor";
import { useWindowContext } from "../../context/WindowContext";
import { useProportionHook } from "../../hooks/useWindowHooks";
import { DateTime } from "luxon";

export function ViewNotify(props: { notify: NotifyType; close: () => void }) {
  const { notify } = props;
  const theme = useTheme();

  return (
    <EditorModalContainer>
      <ModalHeaderLine>
        <StyledInput
          theme={theme}
          placeholder="제목을 입력해주세요."
          value={notify.title}
          readOnly
        />
      </ModalHeaderLine>
      <Viewer contents={notify.contents}></Viewer>
    </EditorModalContainer>
  );
}

function WriteNotify(props: {
  user: EmployeeType;
  close: () => void;
  width: number;
}) {
  const { user, close, width } = props;
  const [title, setTitle] = useState<string>("");
  const [contents, setContents] = useState<string>("");
  const theme = useTheme();

  const saveNotify = () => {
    const notify: NotifyType = {
      id: 0,
      level: user.level,
      writer: user.name,
      title,
      contents,
      insertDateTime: DateTime.now()
        .setZone("Asia/Seoul")
        .toISO({ includeOffset: false })!,
    };

    createNotify(notify)
      .then(() => {
        SuccessAlert("저장 완료");
        close();
      })
      .catch((e) => ErrorAlert(e.message));
  };

  return (
    <LexicalModalContainer toolbarSize={width}>
      <ModalHeaderLine>
        <StyledInput
          theme={theme}
          placeholder="제목을 입력해주세요."
          onChange={(e) => setTitle(e.target.value)}
        />
        <StyledPlusButton func={saveNotify} theme={theme} />
      </ModalHeaderLine>
      <LexicalEditor setContents={setContents} />
    </LexicalModalContainer>
  );
}

const StyledPlusButton = styled(PlusButton)<{ theme: Theme }>(
  ({ theme }) => css`
    position: relative;
    right: 10px;

    circle {
      fill: ${theme.mode.textSecondary} !important;
    }
  `,
);

const StyledInput = styled.input<{
  theme: Theme;
}>(
  ({ theme }) => css`
    width: 100%;
    border: none;
    font-size: 18px;
    color: ${theme.mode.textPrimary};
    box-sizing: border-box;
    padding: 0 15px;
    font-family: ${theme.mode.font.component.itemTitle};
    font-weight: 600;
    background-color: ${theme.mode.cardBackground};
    &:focus-visible {
      outline: none;
    }
  `,
);

export function NotifyList(props: {
  user: EmployeeType;
  notifyList: NotifyType[];
}) {
  const { user, notifyList } = props;
  const theme = useTheme();
  const [selectedNotify, setSelectedNotify] = useState<NotifyType>(
    notifyList[0],
  );

  const { windowWidth } = useWindowContext();
  const { size } = useProportionHook(
    windowWidth,
    1000,
    theme.windowSize.tablet,
  );

  const [writeOpen, setWriteOpen] = useState<boolean>(false);
  const [viewerOpen, setViewerOpen] = useState<boolean>(false);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo<ColumnDef<NotifyType>[]>(
    () => [
      {
        id: "No.",
        header: "번호",
        size: 50,
        accessorKey: "id",
      },
      {
        id: "level",
        header: "직급",
        accessorKey: "level",
        cell: ({ row }) => (
          <span>{levelLabelMap[row.getValue("level") as LevelType]}</span>
        ),
      },
      {
        id: "writer",
        header: "작성자",
        accessorKey: "writer",
        cell: ({ row }) => (
          <span
            onClick={() => {
              setSelectedNotify(row.getValue("id"));
            }}
          >
            {row.getValue("writer")}
          </span>
        ),
      },
      {
        id: "title",
        header: "제목",
        accessorKey: "title",
        size: 350,
        cell: ({ row }) => (
          <EllipsisCase
            func={() => {
              setSelectedNotify(row.original);
              setViewerOpen(true);
            }}
            text={row.getValue("title")}
            testAlign="center"
            width={350}
          />
        ),
      },
      {
        id: "insertDateTime",
        header: "작성일자",
        accessorKey: "insertDateTime",
        enableSorting: true,
        cell: ({ row }) => (
          <span>{iso8601ToYYMMDDHHMM(row.getValue("insertDateTime"))}</span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable<NotifyType>({
    data: notifyList,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  const safeGetColumn = (value: string) => {
    if (table.getColumn(value)) {
      return table.getColumn(value);
    } else {
    }
  };

  return (
    <>
      <StyledContainer theme={theme}>
        <HeaderLine theme={theme}>
          <div
            css={css`
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
            `}
          >
            <select
              css={css`
                border: none;
                font-size: 16px;
                margin-right: 20px;
              `}
              value={safeGetColumn("level")?.getFilterValue() as string}
              onChange={(e) =>
                table
                  .getColumn("level")
                  ?.setFilterValue(e.target.value || undefined)
              }
            >
              <option value="">전체 부서</option>
              {levelList.map((value) => (
                <option key={value} value={value}>
                  {levelLabelMap[value as LevelType]}
                </option>
              ))}
            </select>
            <EmailSearch
              placeholder="이름 검색"
              value={table.getColumn("writer")?.getFilterValue() as string}
              onChange={(e) =>
                table.getColumn("writer")?.setFilterValue(e.target.value)
              }
              theme={theme}
            />
          </div>
          <AddNotifyButton
            label="공지 작성"
            isActive={true}
            activeBackgroundColor={theme.mode.cardBackground}
            inActiveBackgroundColor={theme.mode.cardBackground}
            func={() => setWriteOpen(true)}
            theme={theme}
          />
        </HeaderLine>
        <HorizontalDivider width={95} />
        <TableContainer>
          <TableHeader
            table={table}
            headerBorder="none"
            columnResizeMode={columnResizeMode}
          />
          <TableBody table={table} />
        </TableContainer>
        <Pagination table={table} />
        <StyledModal
          open={viewerOpen}
          close={() => setViewerOpen(false)}
          children={
            <ViewNotify
              notify={selectedNotify}
              close={() => setWriteOpen(false)}
            />
          }
        />
        <StyledModal
          width={size}
          open={writeOpen}
          close={() => setWriteOpen(false)}
          children={
            <WriteNotify
              user={user}
              close={() => setWriteOpen(false)}
              width={size}
            />
          }
        />
      </StyledContainer>
    </>
  );
}

const StyledContainer = styled(Container)<{ theme: Theme }>(
  ({ theme }) => css`
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;

    border-radius: ${theme.borderRadius.softBox};

    background-color: ${theme.mode.cardBackground};
  `,
);

const HeaderLine = styled.div<{ theme: Theme }>(
  ({ theme }) => css`
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 16px;

    padding: 14px 0 8px 0;

    font-family: ${theme.mode.font.component.itemTitle};
  `,
);

const TableContainer = styled.table`
  border-spacing: 0;
  width: 100%;

  thead {
    border: none;
  }
`;

const AddNotifyButton = styled(FuncItem)<{ theme: Theme }>(
  ({ theme }) => css`
    cursor: pointer;
    font-family: ${theme.mode.font.button.default};
    color: ${theme.mode.textPrimary};

    &:hover {
      color: ${theme.mode.textPrimary};
    }
  `,
);

const StyledModal = styled(CustomModal)`
  justify-content: flex-start;
  align-items: center;
`;

const LexicalModalContainer = styled(Container)<{ toolbarSize: number }>(
  ({ toolbarSize }) => css`
    width: 100%;
    flex-direction: column;
    justify-content: center;

    .toolbar {
      width: ${toolbarSize}px !important;
    }
  `,
);
