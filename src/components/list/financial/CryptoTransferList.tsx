/** @jsxImportSource @emotion/react */
import {
  HeaderLine,
  StyledContainer,
  TableBody,
  TableContainer,
  TableHeader,
  TableWrapper,
} from "@/components/Table";
import { useWindowContext } from "@/context/WindowContext";
import { NormalizedTransfer } from "@/model/financial";
import { css, useTheme } from "@emotion/react";
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnResizeMode,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { formatDateToYYMMDDHHMM } from "@/components/styled/Date/DateFomatter";
import { HorizontalDivider, TableSearchBar } from "@/components/layouts";
import { formatUnits } from "@/utils/bigNumberConvert";

export function CryptoTransferList(props: {
  transferList: NormalizedTransfer[];
}) {
  const { transferList } = props;

  const { windowWidth } = useWindowContext();
  const theme = useTheme();

  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "acceptedAt", desc: true },
  ]);

  const columns = useMemo<ColumnDef<NormalizedTransfer>[]>(
    () => [
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
        id: "cryptoAmount",
        header: "거래 금액",
        accessorKey: "cryptoAmount",
        size: 100,
        cell: ({ row }) => {
          if (!row.original.cryptoAmount || !row.original.decimals) return;
          const formatted = formatUnits(
            row.original.cryptoAmount,
            Number(row.original.decimals),
            8,
          );

          return (
            <span>
              {formatted} {row.original.cryptoType}
            </span>
          );
        },
      },
      {
        id: "acceptedAt",
        header: "승인일시",
        accessorKey: "acceptedAt",
        size: 50,
        cell: ({ row }) => {
          const v = row.getValue("acceptedAt");
          const dt =
            typeof v === "number"
              ? DateTime.fromMillis(v)
              : DateTime.fromISO(String(v));
          return <span>{formatDateToYYMMDDHHMM(dt.toJSDate())}</span>;
        },
      },
    ],
    [],
  );

  const table = useReactTable<NormalizedTransfer>({
    data: transferList,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    manualPagination: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

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
            <TableSearchBar
              theme={theme}
              placeholder="보낸 주소 검색"
              value={table.getColumn("fromAddress")?.getFilterValue() as string}
              onChange={(e) =>
                table.getColumn("fromAddress")?.setFilterValue(e.target.value)
              }
            />
          </div>
        </HeaderLine>
        <HorizontalDivider width={95} />
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
      </StyledContainer>
    </>
  );
}
