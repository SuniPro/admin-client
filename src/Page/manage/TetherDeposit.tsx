/** @jsxImportSource @emotion/react */
import "rsuite/dist/rsuite.css";
import { EmployeeType } from "../../model/employee";
import { FinancialAnalysisPanel } from "../../components/analysis/Financial";
import { css, useTheme } from "@emotion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnResizeMode,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import {
  approveDeposit,
  cancelDeposit,
  deleteDepositById,
  getDepositsByStatusOrEmailOrRange,
  getTotalDepositSummaryByStatusAndEmail,
} from "../../api/financial";
import {
  statusNavigationMenu,
  TetherAccountType,
  TetherDepositChangeStatusType,
  TetherDepositType,
  transactionStatusLabelMap,
  TransactionStatusType,
} from "../../model/financial";
import {
  HeaderLine,
  Pagination,
  StyledContainer,
  TableBody,
  TableContainer,
  TableHeader,
  TableHeaderFuncButton,
  TableWrapper,
} from "../../components/Table";
import {
  ConfirmAlert,
  ErrorAlert,
  SuccessAlert,
} from "../../components/Alert/Alerts";
import Switch from "@mui/material/Switch";
import { Navigation } from "../../components/Navigation";
import { useWindowContext } from "../../context/WindowContext";
import { iso8601ToYYMMDDHHMM } from "../../components/styled/Date/DateFomatter";
import { Spinner } from "../../components/Empty/Spinner";
import { ContentsEmptyState } from "../../components/Empty/ContentsEmptyState";
import { Tooltip } from "@mui/material";
import { PaginationResponse } from "../../model/pagination";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import useSound from "use-sound";
import alertSound from "../../assets/sound/alert/alert.mp3";
import DateRangePicker, { ValueType } from "rsuite/DateRangePicker";
import {
  EmailSearch,
  HorizontalDivider,
} from "../../components/layouts/Layouts";
import { useDebounceCallback } from "usehooks-ts";
import { CustomModal } from "../../components/Modal/Modal";
import styled from "@emotion/styled";
import { Decimal } from "decimal.js";
import { WriteTetherMemo } from "../../components/financial/Memo";
import { EditNoteIcon } from "../../components/styled/icons";

export function TetherDeposit(props: { user: EmployeeType }) {
  const { user } = props;
  const navigate = useNavigate();

  if (user.level === "STAFF" || user.level === "ASSOCIATE") {
    navigate("/");
    ErrorAlert("현재 업무관리는 차장급 이상만 접근 가능합니다.");
  }

  const theme = useTheme();
  const [play] = useSound(alertSound);

  const { windowWidth } = useWindowContext();

  const [memoViewOpen, setWriteOpen] = useState(false);

  const [searchEmail, setSearchEmail] = useState<string | undefined>();

  const searchInputRef = useRef<HTMLInputElement>(null);

  // 검색 실행 함수
  const handleSearch = useDebounceCallback((email: string) => {
    setSearchEmail(email); // 실제 검색 상태 업데이트
  }, 800);

  const lastWeekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 현재로부터 정확히 7일 전
  const [dateRange, setDateRange] = useState<ValueType>([
    lastWeekStart,
    new Date(),
  ]);

  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "requestedAt", desc: true }, // 기본 정렬 상태
  ]);

  const [depositStatus, setDepositStatus] =
    useState<TransactionStatusType>("PENDING");

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, refetch } = useQuery<PaginationResponse<TetherDepositType>>({
    queryKey: [
      "getDepositsByStatus",
      searchEmail,
      depositStatus,
      pageIndex,
      pageSize,
      dateRange,
    ],
    queryFn: () =>
      getDepositsByStatusOrEmailOrRange(
        depositStatus,
        pageIndex,
        pageSize,
        searchEmail,
        dateRange,
      ),
    placeholderData: (previousData) => previousData,
    refetchInterval: 30000,
  });

  const depositList = data?.content;

  const previousLengthRef = useRef<number>(depositList?.length || 0);

  useEffect(() => {
    const currentLength = depositList?.length || 0;
    if (depositList && depositList.length > 0) {
      setSelectedWallet(depositList[0].tetherWallet);
      if (depositStatus === "PENDING") {
        play(); // depositStatus가 PENDING이고 depositList 길이가 0이 아니면 항상 play 실행
      }
    }

    previousLengthRef.current = currentLength;
  }, [depositList, depositStatus, play]);

  const { data: totalDepositsCost } = useQuery({
    queryKey: ["totalDepositsCost", depositStatus],
    queryFn: () =>
      getTotalDepositSummaryByStatusAndEmail(
        depositStatus,
        searchEmail,
        dateRange,
      ),
    refetchInterval: 60000,
  });

  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<TetherAccountType>({
    id: 0,
    tetherWallet: "",
    email: "",
    insertDateTime: "",
  });

  const columns = useMemo<ColumnDef<TetherDepositType>[]>(
    () => [
      {
        id: "No.",
        header: "번호",
        size: 50,
        accessorKey: "id",
      },
      {
        id: "site",
        header: "사이트",
        size: 50,
        accessorKey: "site",
      },
      {
        id: "email",
        header: "이메일",
        accessorKey: "email",
        size: 120,
      },
      {
        id: "tetherWallet",
        header: "지갑주소",
        accessorKey: "tetherWallet",
        cell: ({ row }) => (
          <Tooltip
            placement="top"
            title="지갑주소를 누르면 통계를 볼 수 있습니다."
          >
            <span
              onClick={() => setSelectedWallet(row.getValue("tetherWallet"))}
            >
              {row.getValue("tetherWallet")}
            </span>
          </Tooltip>
        ),
      },
      {
        id: "amount",
        header: "요청금액",
        accessorKey: "amount",
        size: 100,
        cell: ({ row }) => (
          <span>
            {parseFloat(row.getValue("amount")).toLocaleString("ko-KR")} 원
          </span>
        ),
      },
      {
        id: "usdtAmount",
        header: "입금할 테더",
        accessorKey: "usdtAmount",
        size: 100,
        cell: ({ row }) => (
          <span>
            {parseFloat(row.getValue("usdtAmount")).toLocaleString("en-US")}{" "}
            USDT
          </span>
        ),
      },
      {
        id: "requestedAt",
        header: "요청일시",
        accessorKey: "requestedAt",
        size: 100,
        cell: ({ row }) => (
          <span>{iso8601ToYYMMDDHHMM(row.getValue("requestedAt"))}</span>
        ),
      },
      ...(depositStatus === "CONFIRMED"
        ? [
            {
              id: "acceptedAt",
              header: "승인일시",
              accessorKey: "acceptedAt",
              size: 100,
              cell: ({ row }: { row: Row<TetherDepositType> }) => (
                <span>
                  {row.getValue("acceptedAt") !== null
                    ? iso8601ToYYMMDDHHMM(row.getValue("acceptedAt"))
                    : transactionStatusLabelMap[
                        row.getValue("status") as TransactionStatusType
                      ]}
                </span>
              ),
            },
          ]
        : []),
      {
        id: "status",
        header: "상태",
        accessorKey: "status",
        size: 50,
        cell: ({ row }) => (
          <span>
            {
              transactionStatusLabelMap[
                row.getValue("status") as TransactionStatusType
              ]
            }
          </span>
        ),
      },
      ...(depositStatus === "PENDING"
        ? [
            {
              id: "cancelled",
              header: "반려",
              accessorKey: "cancelled",
              size: 50,
              cell: ({ row }: { row: Row<TetherDepositType> }) => (
                <CancelledControl
                  refetch={refetch}
                  depositInfo={row.original}
                />
              ),
            },
          ]
        : []),
      ...(depositStatus === "PENDING"
        ? [
            {
              id: "accepted",
              header: "승인",
              accessorKey: "accepted",
              size: 50,
              cell: ({ row }: { row: Row<TetherDepositType> }) => (
                <AcceptControl refetch={refetch} depositInfo={row.original} />
              ),
            },
          ]
        : []),
      {
        id: "func",
        header: "기능",
        size: 50,
        cell: ({ row }) => (
          <div
            css={css`
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              gap: 10px;

              cursor: pointer;
            `}
          >
            <EditNoteIcon
              color={row.original.memo !== null ? "primary" : "disabled"}
              onClick={() => {
                setSelectedAccount(row.original);
                setWriteOpen(true);
              }}
            />
            <DeleteIcon
              onClick={() =>
                ConfirmAlert("삭제하시겠습니까 ?", () =>
                  deleteDepositById(row.original.id)
                    .then(() => refetch().then(() => SuccessAlert("삭제 완료")))
                    .catch((e) => ErrorAlert(e.message)),
                )
              }
            />
          </div>
        ),
      },
    ],
    [depositStatus, refetch],
  );

  const table = useReactTable<TetherDepositType>({
    data: depositList ?? [],
    columns,
    pageCount: data?.totalPages ?? 0,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
    onSortingChange: setSorting,
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

  if (!depositList)
    return (
      <>
        <StyledContainer theme={theme}>
          <Spinner />
        </StyledContainer>
      </>
    );

  function HeaderLineRender() {
    return (
      <HeaderLine theme={theme}>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <EmailSearch
            ref={searchInputRef}
            defaultValue={searchEmail} // 초기값만 설정
            placeholder="이메일 검색"
            onChange={(e) => handleSearch(e.target.value)}
            theme={theme}
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
              setSearchEmail(undefined);
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
    );
  }

  return (
    <>
      <FinancialAnalysisPanel
        user={user}
        depositList={depositList}
        selectedWallet={selectedWallet}
        totalDepositsCost={totalDepositsCost}
      />
      <Navigation
        navigationItemWidth={120}
        navigationContainerWidth={95 * (windowWidth / 100)}
        menuList={statusNavigationMenu}
        activeStatus={depositStatus}
        setActiveStatus={setDepositStatus}
        justifyContent="center"
      />
      <StyledContainer theme={theme}>
        {depositList.length === 0 ? (
          <>
            <StyledContainer theme={theme}>
              <HeaderLineRender />
              <ContentsEmptyState />
            </StyledContainer>
          </>
        ) : (
          <>
            <HeaderLineRender />
            <HorizontalDivider width={95} />
            {depositStatus === "PENDING" ? <></> : null}
            <TableWrapper width={(windowWidth / 100) * 92} theme={theme}>
              <TableContainer>
                <TableHeader
                  table={table}
                  headerBorder="none"
                  columnResizeMode={columnResizeMode}
                />
                <TableBody table={table} />
              </TableContainer>
            </TableWrapper>
            <Pagination table={table} viewSizeBox={true} />
          </>
        )}
        <StyledModal
          open={memoViewOpen}
          close={() => setWriteOpen(false)}
          children={
            <WriteTetherMemo
              accountId={selectedAccount.id}
              prevContents={selectedAccount.memo}
              close={() => setWriteOpen(false)}
              refetch={refetch}
            />
          }
        />
      </StyledContainer>
    </>
  );
}

function AcceptControl(props: {
  refetch: (
    _options?: RefetchOptions,
  ) => Promise<
    QueryObserverResult<PaginationResponse<TetherDepositType>, Error>
  >;
  depositInfo: TetherDepositType;
}) {
  const { refetch, depositInfo } = props;
  const [isAccept, setIsAccept] = useState<boolean>(depositInfo.accepted);

  const accept = () => {
    const requestDeposit: TetherDepositChangeStatusType = {
      depositId: depositInfo.id,
      tetherWallet: depositInfo.tetherWallet,
      amount: new Decimal(depositInfo.amount).toFixed(4),
    };
    approveDeposit(requestDeposit)
      .then(() => refetch().then(() => SuccessAlert("변경 완료")))
      .then(() => setIsAccept((prev) => !prev));
  };

  const importantChange = (value: boolean) => {
    if (value) {
      ConfirmAlert("승인하시겠습니까?", accept);
    } else {
      ErrorAlert("이미 승인된 입금은 취소할 수 없습니다.");
    }
  };

  return (
    <div>
      <Switch
        onChange={(e) => importantChange(e.target.checked)}
        defaultChecked={isAccept}
      />
    </div>
  );
}

function CancelledControl(props: {
  refetch: (
    _options?: RefetchOptions,
  ) => Promise<
    QueryObserverResult<PaginationResponse<TetherDepositType>, Error>
  >;
  depositInfo: TetherDepositType;
}) {
  const { refetch, depositInfo } = props;
  const [isCancel, setIsCancel] = useState<boolean>(false);

  const cancel = () => {
    const requestDeposit: TetherDepositChangeStatusType = {
      depositId: depositInfo.id,
      tetherWallet: depositInfo.tetherWallet,
      amount: new Decimal(depositInfo.amount).toFixed(4),
    };
    cancelDeposit(requestDeposit)
      .then(() => refetch().then(() => SuccessAlert("변경 완료")))
      .then(() => setIsCancel((prev) => !prev));
  };

  const cancelledChange = (value: boolean) => {
    if (value) {
      ConfirmAlert("반려하시겠습니까?", cancel);
    } else {
      ErrorAlert("이미 반려된 입금은 취소할 수 없습니다.");
    }
  };

  return (
    <div>
      <Switch
        checked={isCancel}
        onChange={(e) => cancelledChange(e.target.checked)}
        defaultChecked={isCancel}
      />
    </div>
  );
}

const StyledModal = styled(CustomModal)`
  justify-content: flex-start;
  align-items: center;
`;
