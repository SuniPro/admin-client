/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import {
  departmentLabelMap,
  departmentList,
  DepartmentType,
  EmployeeType,
  levelLabelMap,
  LevelType,
} from "../../model/employee";
import { useMemo, useState } from "react";
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
import { useWindowContext } from "../../context/WindowContext";
import { useQuery } from "@tanstack/react-query";
import { PaginationResponse } from "../../model/pagination";
import { createReport, getReportsByLevel } from "../../api/report";
import DateRangePicker, { ValueType } from "rsuite/DateRangePicker";
import { ReportType } from "../../model/report";
import { iso8601ToYYMMDDHHMM } from "../styled/Date/DateFomatter";
import {
  HeaderLine,
  Pagination,
  StyledContainer,
  TableBody,
  TableContainer,
  TableHeader,
  TableHeaderFuncButton,
} from "../Table";
import { EmailSearch, HorizontalDivider } from "../layouts";
import { Accordion, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ConfirmAlert, SuccessAlert } from "../Alert";
import { DateTime } from "luxon";
import { LexicalEditor } from "../../modules/lexical-editor/lexical/src/LexicalEditor";
import { PlusButton } from "../styled/Button";
import { Container } from "../layouts/Frames";
import { CustomModal, ModalHeaderLine } from "../Modal";
import { LexicalViewer } from "../../modules/lexical-editor/lexical/src/Editor";

export function ViewReport(props: { report: ReportType; close: () => void }) {
  const { report } = props;
  const theme = useTheme();

  return (
    <ViewerModalContainer>
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
        <StyledInput
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
    </ViewerModalContainer>
  );
}

export function ReportList(props: { user: EmployeeType }) {
  const { user } = props;
  const theme = useTheme();

  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [open, setOpen] = useState<boolean>(false);
  const close = () => setOpen(false);

  const { windowWidth } = useWindowContext();

  const [expanded, setExpanded] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [contents, setContents] = useState<string>("");

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const lastWeekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 현재로부터 정확히 7일 전
  const [dateRange, setDateRange] = useState<ValueType>([
    lastWeekStart,
    new Date(),
  ]);

  const { data, refetch } = useQuery<PaginationResponse<ReportType>>({
    queryKey: ["getReportsByLevel"],
    queryFn: () =>
      getReportsByLevel(user.level, user.id, pageIndex, pageSize, dateRange),
    refetchInterval: 10000,
  });

  const reportList = data?.content;

  const [selectedReport, setSelectedReport] = useState<ReportType>({
    id: 0,
    employee: user,
    title: "",
    reportContents: "",
    insertDateTime: "",
  });

  const columns = useMemo<ColumnDef<ReportType>[]>(
    () => [
      {
        id: "No.",
        header: "번호",
        size: 50,
        accessorKey: "id",
      },
      {
        id: "title",
        header: "제목",
        accessorKey: "title",
        cell: ({ row }) => (
          <span
            onClick={() => {
              setSelectedReport(row.original);
              setOpen(true);
            }}
          >
            {row.getValue("title")}
          </span>
        ),
        size: 500,
      },
      {
        id: "department",
        header: "부서",
        accessorKey: "department",
        cell: ({ row }) => (
          <span>
            {
              departmentLabelMap[
                row.original.employee.department as DepartmentType
              ]
            }
          </span>
        ),
        size: 50,
      },
      {
        id: "level",
        header: "직급",
        accessorKey: "level",
        cell: ({ row }) => (
          <span>{levelLabelMap[row.original.employee.level as LevelType]}</span>
        ),
        size: 50,
      },
      {
        id: "writer",
        header: "작성자",
        accessorKey: "writer",
        cell: ({ row }) => <span>{row.original.employee.name}</span>,
        size: 50,
      },
      {
        id: "insertDateTime",
        header: "작성 일자",
        accessorKey: "insertDateTime",
        enableSorting: true,
        size: 80,
        cell: ({ row }) => (
          <span>{iso8601ToYYMMDDHHMM(row.getValue("insertDateTime"))}</span>
        ),
      },
    ],
    [setSelectedReport],
  );

  const table = useReactTable<ReportType>({
    data: reportList ?? [],
    columns,
    pageCount: data?.totalPages ?? 0,
    state: {
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
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
    }
  };

  return (
    <>
      <StyledAccordion
        theme={theme}
        expanded={expanded}
        onChange={() => setExpanded((prev) => !prev)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <span
            css={css`
              font-size: 1.2em;
              font-weight: 600;
              padding: 0 1vw;
              font-family: ${theme.mode.font.component.itemTitle};
            `}
          >
            일일보고 작성 패널
          </span>
        </AccordionSummary>
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
              max-width: ${windowWidth}px;
              font-family: ${theme.mode.font.component.itemDescription};
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
            <StyledInput
              theme={theme}
              placeholder="제목을 입력하세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <StyledPlusButton
              func={() =>
                ConfirmAlert("저장하시겠습니까?", () =>
                  createReport({
                    id: 0,
                    employee: user,
                    title,
                    reportContents: contents,
                    insertDateTime: DateTime.now()
                      .setZone("Asia/Singapore")
                      .toISO({ includeOffset: false })!,
                  }).then(() => {
                    setTitle("");
                    setContents("");
                    SuccessAlert("저장완료");
                    refetch().then(() => setExpanded(false));
                  }),
                )
              }
              theme={theme}
            />
          </article>
          <LexicalEditor setContents={setContents} />
        </div>
      </StyledAccordion>
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
                background-color: ${theme.mode.cardBackground};
              `}
              value={safeGetColumn("department")?.getFilterValue() as string}
              onChange={(e) =>
                table
                  .getColumn("department")
                  ?.setFilterValue(e.target.value || undefined)
              }
            >
              <option value="">전체 부서</option>
              {departmentList.map((value) => (
                <option key={value} value={value}>
                  {departmentLabelMap[value as DepartmentType]}
                </option>
              ))}
            </select>
            <EmailSearch
              theme={theme}
              placeholder="이름 검색"
              value={table.getColumn("writer")?.getFilterValue() as string}
              onChange={(e) =>
                table.getColumn("writer")?.setFilterValue(e.target.value)
              }
            />
          </div>
          <div
            css={css`
              display: flex;
              flex-direction: row;
              flex-wrap: nowrap;
              justify-content: center;
              align-items: center;
              gap: 10px;
            `}
          >
            <DateRangePicker
              container={document.getElementById("date-area")!}
              format="yyyy.MM.dd"
              showOneCalendar
              // @ts-ignore
              value={dateRange}
              onChange={(value) => {
                setDateRange(value);
              }}
            />
            <TableHeaderFuncButton
              label="초기화"
              func={() => {
                setDateRange([lastWeekStart, new Date()]);
              }}
              theme={theme}
              css={css`
                font-size: 12px;
                border: 1px solid ${theme.mode.textSecondary};

                &:hover {
                  color: ${theme.mode.textRevers};
                }
              `}
            />
          </div>
        </HeaderLine>
        <HorizontalDivider width={95} />
        <TableContainer width={(windowWidth / 100) * 92}>
          <TableHeader
            table={table}
            headerBorder="none"
            columnResizeMode={columnResizeMode}
          />
          <TableBody table={table} />
        </TableContainer>
        <Pagination table={table} />
      </StyledContainer>
      <StyledModal
        width={windowWidth * 0.8}
        open={open}
        close={close}
        children={<ViewReport close={close} report={selectedReport} />}
      />
    </>
  );
}

const StyledAccordion = styled(Accordion)<{ theme: Theme }>(
  ({ theme }) => css`
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;

    border-radius: ${theme.borderRadius.softBox};

    background-color: ${theme.mode.cardBackground};

    --Paper-shadow: none !important;
  `,
);

const StyledInput = styled.input<{
  theme: Theme;
}>(
  ({ theme }) => css`
    width: 98%;
    font-size: 18px;
    color: ${theme.mode.textPrimary};
    box-sizing: border-box;
    padding: 10px 1vw;
    font-family: ${theme.mode.font.component.itemDescription};
    font-weight: 600;
    border: 1px solid ${theme.mode.textSecondary};
    border-radius: ${theme.borderRadius.softBox};

    &:focus-visible {
      outline: none;
    }
  `,
);

const StyledPlusButton = styled(PlusButton)`
  position: relative;
`;

export const ViewerModalContainer = styled(Container)`
  width: 100%;
  flex-direction: column;
  justify-content: center;
`;

const StyledModal = styled(CustomModal)`
  justify-content: flex-start;
  align-items: center;
  top: 50%;
  height: 90vh;
`;
