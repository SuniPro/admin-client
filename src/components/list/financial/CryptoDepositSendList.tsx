/** @jsxImportSource @emotion/react */
import { useQuery } from "@tanstack/react-query";
import { EmployeeInfoType } from "@/model/employee";
import { PaginationResponse } from "@/model/pagination";
import {
  CryptoDepositType,
  transactionStatusLabelMap,
  TransactionStatusType,
} from "@/model/financial";
import { getSendDepositsBySite, updateSend } from "@/api/financial";
import { useMemo, useState } from "react";
import { useAlarm } from "@/hooks/useAlarm";
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnResizeMode,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Pagination,
  StyledContainer,
  TableBody,
  TableContainer,
  TableHeader,
  TableWrapper,
} from "../../Table";
import { useTheme } from "@emotion/react";
import { Spinner } from "../../Empty/Spinner";
import { useWindowContext } from "@/context/WindowContext";
import { BigNumber } from "bignumber.js";
import { EmptyState } from "../EmptyState";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Switch } from "@heroui/react";
import { ConfirmAlert } from "@/components/Alert";

export function CryptoDepositSendList(props: { employee: EmployeeInfoType }) {
  const { employee } = props;

  const theme = useTheme();
  const { windowWidth } = useWindowContext();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "requestedAt", desc: true },
  ]);

  const { data, refetch } = useQuery<PaginationResponse<CryptoDepositType>>({
    queryKey: ["getDepositsByStatus", pageIndex, pageSize],
    queryFn: () =>
      getSendDepositsBySite(false, employee.site, pageIndex, pageSize),
    placeholderData: (previousData) => previousData,
    refetchInterval: 300000,
  });

  const depositList = data?.content;

  useAlarm(Boolean(depositList && depositList.length > 0));

  const columns = useMemo<ColumnDef<CryptoDepositType>[]>(
    () => [
      {
        id: "No.",
        header: "번호",
        size: 50,
        accessorKey: "id",
      },
      {
        id: "chainType",
        header: "체인",
        size: 50,
        accessorKey: "chainType",
      },
      {
        id: "fromAddress",
        header: "보낸주소",
        accessorKey: "fromAddress",
        size: 100,
      },
      {
        id: "toAddress",
        header: "받은주소",
        accessorKey: "toAddress",
        size: 100,
      },
      {
        id: "amount",
        header: "요청금액",
        accessorKey: "amount",
        size: 100,
        cell: ({ row }) => {
          const formatted = new BigNumber(row.original.amount).toString();
          return (
            <span>
              {formatted} {row.original.cryptoType}
            </span>
          );
        },
      },
      {
        id: "krwAmount",
        header: "요청금액 (원)",
        accessorKey: "krwAmount",
        size: 100,
        cell: ({ row }) => {
          const krwAmount = new BigNumber(row.original.krwAmount);
          const floored = krwAmount.decimalPlaces(0, BigNumber.ROUND_DOWN); // 소수점 버림

          const formatted = new Intl.NumberFormat("ko-KR").format(
            BigInt(floored.toFixed(0)),
          );
          return <span>{formatted}</span>;
        },
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
        id: "isSend",
        header: "송금",
        accessorKey: "isSend",
        size: 50,
        cell: ({ row }) => (
          <Switch
            defaultSelected
            size="sm"
            isSelected={row.getValue("isSend")}
            onChange={() => {
              ConfirmAlert("송금을 완료하셨습니까?", () =>
                updateSend(row.original.id, true).then(() => {
                  refetch().then();
                }),
              );
            }}
          />
        ),
      },
    ],
    [refetch],
  );

  const table = useReactTable<CryptoDepositType>({
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

  if (depositList.length === 0)
    return (
      <EmptyState
        message="송금하지 않은 입금 건수가 없습니다."
        icon={<CheckCircleIcon color="success" fontSize="large" />}
        title=""
      />
    );

  return (
    <StyledContainer theme={theme}>
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
      {/*<CustomModal*/}
      {/*  open={open}*/}
      {/*  close={close}*/}
      {/*  css={css`*/}
      {/*    height: 100px;*/}
      {/*    padding: 0 20px;*/}
      {/*  `}*/}
      {/*  children={*/}
      {/*    <ChangeTetherWallet*/}
      {/*      close={close}*/}
      {/*      refetch={refetch}*/}
      {/*      accountId={selectedAccount.id}*/}
      {/*    />*/}
      {/*  }*/}
      {/*/>*/}
      {/*<StyledModal*/}
      {/*  open={writeOpen}*/}
      {/*  close={() => setWriteOpen(false)}*/}
      {/*  children={*/}
      {/*    <WriteTetherMemo*/}
      {/*      accountId={selectedAccount.id}*/}
      {/*      close={() => setWriteOpen(false)}*/}
      {/*      prevContents={selectedAccount.memo}*/}
      {/*      refetch={refetch}*/}
      {/*    />*/}
      {/*  }*/}
      {/*/>*/}
    </StyledContainer>
  );
}
