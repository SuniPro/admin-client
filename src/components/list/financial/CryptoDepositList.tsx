/** @jsxImportSource @emotion/react */
import {
  SearchBar,
  searchBarProps,
  searchStateType,
} from "@/components/styled/input/SearchBar";
import { useWindowContext } from "@/context/WindowContext";
import { EmployeeInfoType } from "@/model/employee";
import { css, useTheme } from "@emotion/react";
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
import { useMemo, useState } from "react";
import DateRangePicker, { ValueType } from "rsuite/DateRangePicker";
import { useQuery } from "@tanstack/react-query";
import { getDepositByAddressAndRangeAndSite } from "@/api/financial";
import { OutLine } from "@/components/layouts";
import { Spinner, Switch } from "@heroui/react";
import { CryptoDepositType } from "@/model/financial";
import {
  Pagination,
  StyledContainer,
  TableBody,
  TableContainer,
  TableHeader,
  TableWrapper,
} from "@/components/Table";
import { iso8601ToYYMMDDHHMM } from "@/components/styled/Date/DateFomatter";
import { BigNumber } from "bignumber.js";

export const DepositSearchValue: searchBarProps[] = [
  { key: "to", label: "받은주소" },
  { key: "from", label: "보낸주소" },
];

export function CryptoDepositList(props: { employee: EmployeeInfoType }) {
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

  const [search, setSearch] = useState<searchStateType>({
    value: "",
    type: "to",
  });
  const [isSend, setIsSend] = useState<boolean>(false);

  const lastWeekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 현재로부터 정확히 7일 전
  const [dateRange, setDateRange] = useState<ValueType>([
    lastWeekStart,
    new Date(),
  ]);

  const { data, refetch } = useQuery({
    queryKey: ["getDepositByAddressAndRangeAndSite", pageSize, pageIndex],
    queryFn: () =>
      getDepositByAddressAndRangeAndSite(
        search.value,
        search.type as "to" | "from",
        isSend,
        employee.site,
        pageIndex,
        pageSize,
        dateRange,
      ),
    refetchInterval: 300000,
    enabled: Boolean(employee),
  });

  const depositList = data?.content;

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
        id: "isSend",
        header: "송금",
        accessorKey: "isSend",
        size: 50,
        cell: ({ row }) => (
          <span>{row.getValue("isSend") ? "완료" : "미완"}</span>
        ),
      },
      {
        id: "requestedAt",
        header: "요청일시",
        accessorKey: "requestedAt",
        size: 50,
        cell: ({ row }) => (
          <span>{iso8601ToYYMMDDHHMM(row.getValue("requestedAt"))}</span>
        ),
      },
    ],
    [],
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

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-row w-full justify-end gap-2">
          <DateRangePicker
            css={css`
              width: 240px;
              background-color: black;

              .rs-picker-input-group {
                background-color: ${theme.mode.cardBackground} !important;
              }

              input {
                background-color: ${theme.mode.cardBackground};
                color: ${theme.mode.textPrimary};
              }
            `}
            container={document.getElementById("date-area")!}
            format="yyyy.MM.dd"
            showOneCalendar
            // @ts-ignore
            value={dateRange}
            onChange={(value) => {
              setDateRange(value);
            }}
          />
          <OutLine
            css={css`
              width: auto;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              padding: 2px 10px;
              font-family: ${theme.mode.font.component.mainTitle};
              gap: 10px;
            `}
          >
            송금
            <Switch
              defaultSelected
              size="sm"
              isSelected={isSend}
              onValueChange={setIsSend}
            />
          </OutLine>
        </div>
        <SearchBar
          searchState={{ search, setSearch }}
          searchProps={DepositSearchValue}
          refetch={refetch}
        />
      </div>
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
    </>
  );
}
