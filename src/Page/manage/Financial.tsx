/** @jsxImportSource @emotion/react */
import { EmployeeType } from "../../model/employee";
import { FinancialAnalysisPanel } from "../../components/analysis/Financial";
import { css, Theme, useTheme } from "@emotion/react";
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
  useReactTable,
} from "@tanstack/react-table";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import {
  approveDeposit,
  deleteDepositById,
  getDepositsByStatus,
} from "../../api/financial";
import {
  statusNavigationMenu,
  TetherDepositAcceptType,
  TetherDepositType,
  transactionStatusLabelMap,
  TransactionStatusType,
} from "../../model/financial";
import { Container } from "../../components/layouts/Frames/FrameLayouts";
import styled from "@emotion/styled";
import {
  Pagination,
  TableBody,
  TableHeader,
} from "../../components/Table/Table";
import {
  ConfirmAlert,
  ErrorAlert,
  SuccessAlert,
} from "../../components/Alert/Alerts";
import Switch from "@mui/material/Switch";
import { Navigation } from "../../components/Navigation/Navigation";
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

export function Financial(props: { user: EmployeeType }) {
  const { user } = props;
  const navigate = useNavigate();

  if (user.level === "STAFF" || user.level === "ASSOCIATE") {
    navigate("/");
    ErrorAlert("현재 업무관리는 차장급 이상만 접근 가능합니다.");
  }

  const theme = useTheme();
  const [play] = useSound(alertSound);

  const { windowWidth } = useWindowContext();

  const isTablet = windowWidth <= 960;

  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [depositStatus, setDepositStatus] =
    useState<TransactionStatusType>("PENDING");

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, refetch } = useQuery<PaginationResponse<TetherDepositType>>({
    queryKey: ["getDepositsByStatus", depositStatus, pageIndex, pageSize],
    queryFn: () => getDepositsByStatus(depositStatus, pageIndex, pageSize),
    placeholderData: (previousData) => previousData,
  });

  const depositList = data?.content;

  const previousLengthRef = useRef<number>(depositList?.length || 0);

  useEffect(() => {
    const currentLength = depositList?.length || 0;

    if (depositList && depositList.length > 0) {
      setSelectedWallet(depositList[0].tetherWallet);
      if (
        depositStatus === "PENDING" &&
        currentLength > previousLengthRef.current
      ) {
        play();
      }
    }

    previousLengthRef.current = currentLength;
  }, [depositList, depositStatus, play]);

  const [selectedWallet, setSelectedWallet] = useState<string>("");

  const columns = useMemo<ColumnDef<TetherDepositType>[]>(
    () => [
      {
        id: "No.",
        header: "번호",
        size: 50,
        accessorKey: "id",
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
        id: "insertDateTime",
        header: "등록일시",
        accessorKey: "insertDateTime",
        size: 100,
        cell: ({ row }) => (
          <span>{iso8601ToYYMMDDHHMM(row.getValue("insertDateTime"))}</span>
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
      {
        id: "acceptedAt",
        header: "승인일시",
        accessorKey: "acceptedAt",
        size: 100,
        cell: ({ row }) => (
          <span>
            {row.getValue("acceptedAt") !== null
              ? iso8601ToYYMMDDHHMM(row.getValue("acceptedAt"))
              : "승인대기"}
          </span>
        ),
      },
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

  if (!depositList)
    return (
      <>
        <StyledContainer theme={theme}>
          <Spinner />
        </StyledContainer>
      </>
    );

  return (
    <>
      <FinancialAnalysisPanel
        user={user}
        depositList={depositList}
        selectedWallet={selectedWallet}
      />
      <Navigation
        navigationItemWidth={120}
        navigationContainerWidth={95 * (windowWidth / 100)}
        menuList={statusNavigationMenu}
        activeStatus={depositStatus}
        setActiveStatus={setDepositStatus}
        justifyContent="center"
      />
      <StyledContainer width={(windowWidth / 100) * 95} theme={theme}>
        {depositList.length === 0 ? (
          <>
            <StyledContainer theme={theme}>
              <ContentsEmptyState />
            </StyledContainer>
          </>
        ) : (
          <>
            {depositStatus === "PENDING" ? <></> : null}
            <TableContainer>
              <TableHeader
                table={table}
                headerBorder="none"
                columnResizeMode={columnResizeMode}
              />
              <TableBody
                table={table}
                fontSize={isTablet ? "10px" : undefined}
              />
            </TableContainer>
            <Pagination table={table} />
          </>
        )}
      </StyledContainer>
    </>
  );
}

const TableContainer = styled.table`
  border-spacing: 0;
  width: 100%;
  overflow-x: scroll;

  thead {
    border: none;
  }
`;

// const HeaderLine = styled.div<{ theme: Theme }>(
//   ({ theme }) => css`
//     width: 95%;
//     display: flex;
//     flex-direction: row;
//     justify-content: space-between;
//     gap: 16px;
//
//     padding: 14px 0 8px 0;
//
//     font-family: ${theme.mode.font.component.itemTitle};
//   `,
// );

const StyledContainer = styled(Container)<{ theme: Theme; width?: number }>(
  ({ theme, width }) => css`
    flex-direction: column;
    width: ${width ? `${width}px` : "100%"};
    height: 100%;
    align-items: center;
    justify-content: center;

    overflow-x: scroll;

    border-radius: ${theme.borderRadius.softBox};

    background-color: ${theme.mode.cardBackground};
  `,
);

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
    const requestDeposit: TetherDepositAcceptType = {
      depositId: depositInfo.id,
      tetherWallet: depositInfo.tetherWallet,
      amount: depositInfo.amount,
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
