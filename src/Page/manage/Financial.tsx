/** @jsxImportSource @emotion/react */
import { EmployeeType } from "../../model/employee";
import { FinancialAnalysisPanel } from "../../components/analysis/Financial";
import { css, Theme, useTheme } from "@emotion/react";
import { useEffect, useMemo, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import {
  approveDeposit,
  getDepositsByStatus,
  getUsdToKrwRate,
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

const formatNumber = (value: number): number => parseFloat(value.toFixed(2));

export function Financial(props: { user: EmployeeType }) {
  const { user } = props;
  const navigate = useNavigate();

  if (user.level === "STAFF" || user.level === "ASSOCIATE") {
    navigate("/");
    ErrorAlert("현재 업무관리는 차장급 이상만 접근 가능합니다.");
  }

  const theme = useTheme();
  const { windowWidth } = useWindowContext();

  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [depositStatus, setDepositStatus] =
    useState<TransactionStatusType>("PENDING");

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // const { data: depositList } = useQuery({
  //   queryKey: ["getDepositsByStatus", depositStatus],
  //   queryFn: () => getDepositsByStatus(depositStatus),
  //   refetchInterval: 10000,
  // });

  const { data } = useQuery<PaginationResponse<TetherDepositType>>({
    queryKey: ["getDepositsByStatus", depositStatus, pageIndex, pageSize],
    queryFn: () => getDepositsByStatus(depositStatus, pageIndex, pageSize),
    placeholderData: (previousData) => previousData,
  });

  const depositList = data?.content;

  const { data: exchangeData } = useQuery({
    queryKey: ["getUsdToKrwRate"],
    queryFn: () => getUsdToKrwRate(),
    refetchInterval: 300000,
  });

  useEffect(() => {
    if (depositList && depositList.length > 0) {
      setSelectedWallet(depositList[0].tetherWallet);
    }
  }, [depositList]);

  const [selectedWallet, setSelectedWallet] = useState<string>("");

  const exchangeRate = exchangeData ? exchangeData.rates.KRW + 0.4 : 0;

  const columns = useMemo<ColumnDef<TetherDepositType>[]>(
    () => [
      {
        id: "No.",
        header: "번호",
        size: 50,
        accessorKey: "id",
      },
      {
        id: "username",
        header: "유저이름",
        accessorKey: "username",
        size: 100,
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
        cell: ({ row }) => <span>{row.getValue("amount")} 원</span>,
      },
      {
        id: "amount",
        header: "입금 예정 테더",
        accessorKey: "amount",
        size: 100,
        cell: ({ row }) => (
          <span>
            {formatNumber(
              formatNumber(parseFloat(row.getValue("amount"))) / exchangeRate,
            )}{" "}
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
          <span>{iso8601ToYYMMDDHHMM(row.getValue("acceptedAt"))}</span>
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
      {
        id: "accepted",
        header: "승인",
        accessorKey: "accepted",
        size: 50,
        cell: ({ row }) => <AcceptControl depositInfo={row.original} />,
      },
    ],
    [],
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
      <StyledContainer theme={theme}>
        {depositList.length === 0 ? (
          <>
            <StyledContainer theme={theme}>
              <ContentsEmptyState />
            </StyledContainer>
          </>
        ) : (
          <>
            <TableContainer>
              <TableHeader
                table={table}
                headerBorder="none"
                columnResizeMode={columnResizeMode}
              />
              <TableBody table={table} />
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

function AcceptControl(props: { depositInfo: TetherDepositType }) {
  const { depositInfo } = props;
  const [isAccept, setIsAccept] = useState<boolean>(depositInfo.accepted);

  const accept = () => {
    const requestDeposit: TetherDepositAcceptType = {
      depositId: depositInfo.id,
      tetherWallet: depositInfo.tetherWallet,
      amount: depositInfo.amount,
    };
    approveDeposit(requestDeposit)
      .then(() => SuccessAlert("변경 완료"))
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
        checked={isAccept}
      />
    </div>
  );
}
