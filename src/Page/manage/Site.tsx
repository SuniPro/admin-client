/** @jsxImportSource @emotion/react */
import { StatisticsCard } from "@/components/Card/Card";
import { iso8601ToYYMMDDHHMM } from "@/components/styled/Date/DateFomatter";
import { NewMorphismSearchBar } from "@/components/styled/input/NewMorphismSearchBar";
import { css, useTheme } from "@emotion/react";
import { DateTime } from "luxon";
import { RefObject, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSiteWalletInfoBySite } from "@/api/site";
import { ErrorAlert, SuccessAlert } from "@/components/Alert";
import { detectChain } from "@/hooks/useDetectChain";
import { getTransferList } from "@/api/financial";
import { ChainType, NormalizedTransfer } from "@/model/financial";
import { CryptoTransferList } from "@/components/list/financial/CryptoTransferList";
import { formatUnits } from "@/utils/bigNumberConvert";
import { SiteWalletInfoType } from "@/model/site";
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
import {
  StyledContainer,
  TableBody,
  TableContainer,
  TableHeader,
  TableWrapper,
} from "@/components/Table";
import { useWindowContext } from "@/context/WindowContext";

export const inputCopy = (ref: RefObject<HTMLInputElement | null>) => {
  if (!ref.current) return;
  const wallet = ref.current;
  navigator.clipboard
    .writeText(wallet.value)
    .then(() => {
      SuccessAlert("복사 성공");
    })
    .catch(() => {
      ErrorAlert("복사 실패");
    });
};

export function Site() {
  const { windowWidth } = useWindowContext();
  const [search, setSearch] = useState<string>("");
  const [transferList, setTransferList] = useState<NormalizedTransfer[]>([]);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "insertDateTime", desc: true },
  ]);

  const theme = useTheme();
  const now = DateTime.now().setZone("Asia/Seoul").toISO();

  const { data: siteWalletInfoList } = useQuery({
    queryKey: ["getDepositByAddressAndRangeAndSite"],
    queryFn: () => getSiteWalletInfoBySite(),
    refetchInterval: 1800000,
  });

  const handleSubmit = async (searchValue: string) => {
    if (!searchValue) return;

    // 1) 체인 검증
    const detected = await detectChain(searchValue);
    if (!detected) {
      ErrorAlert("올바른 지갑주소를 입력해주세요.");
    }

    const cacheKey = `transferList:${searchValue}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setTransferList(JSON.parse(cached));
      return;
    }

    getTransferList(searchValue, detected).then((r) => {
      setTransferList(r);

      // 1. 캐시가 있으면 사용
      sessionStorage.setItem(cacheKey, JSON.stringify(r)); // ✅ 캐시 저장
    });
  };

  const decimal = (chainType: ChainType) => {
    switch (chainType) {
      case "BTC":
        return 1e8;
      case "ETH":
        return 1e18;
      case "TRON":
        return 6;
    }
  };

  const cryptoType = (chainType: ChainType) => {
    switch (chainType) {
      case "BTC":
        return "BTC";
      case "ETH":
        return "ETH";
      case "TRON":
        return "USDT";
    }
  };

  const utilType = (chainType: ChainType) => {
    switch (chainType) {
      case "BTC":
        return "BlockCypher";
      case "ETH":
        return "Alchemy";
      case "TRON":
        return "TronGrid";
    }
  };

  const searchInputRef = useRef<HTMLInputElement>(null);

  const columns = useMemo<ColumnDef<SiteWalletInfoType>[]>(
    () => [
      {
        id: "No.",
        header: "번호",
        size: 50,
        accessorKey: "id",
      },
      { id: "chainType", header: "체인", accessorKey: "chainType", size: 50 },
      {
        id: "cryptoWallet",
        header: "지갑",
        accessorKey: "cryptoWallet",
        cell: ({ row }) => (
          <span
            onClick={() => {
              setSelectedIndex(row.index);
            }}
          >
            {row.getValue("cryptoWallet")}
          </span>
        ),
      },
      {
        id: "balance",
        header: "잔액",
        accessorKey: "balance",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span
            onClick={() => {
              setSelectedIndex(row.index);
            }}
          >
            {formatUnits(row.original.balance, decimal(row.original.chainType))}{" "}
            {cryptoType(row.original.chainType)}
          </span>
        ),
      },
      {
        id: "insertDateTime",
        header: "생성일자",
        accessorKey: "insertDateTime",
        cell: ({ row }) => (
          <span>
            {row.getValue("insertDateTime")
              ? iso8601ToYYMMDDHHMM(row.getValue("insertDateTime"))
              : ""}
          </span>
        ),
      },
      {
        id: "updateDateTime",
        header: "수정일자",
        accessorKey: "updateDateTime",
        cell: ({ row }) => (
          <span>
            {row.getValue("updateDateTime")
              ? iso8601ToYYMMDDHHMM(row.getValue("updateDateTime"))
              : ""}
          </span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable<SiteWalletInfoType>({
    data: siteWalletInfoList ?? [],
    columns,
    state: {
      sorting,
      columnFilters,
    },
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
      <NewMorphismSearchBar
        searchInputRef={searchInputRef}
        searchState={{ search, setSearch }}
        submitChain={handleSubmit}
      />
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
      </StyledContainer>
      {siteWalletInfoList && (
        <div
          css={css`
            display: grid;
            width: 100%;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-gap: 0.75rem;
          `}
        >
          <StatisticsCard
            title="지갑 잔액"
            statistics={formatUnits(
              siteWalletInfoList[selectedIndex as number].balance,
              decimal(siteWalletInfoList[0].chainType)!,
            )}
            unit={cryptoType(siteWalletInfoList[0].chainType)}
            description={`${iso8601ToYYMMDDHHMM(now!)} 부 최신화된 결과입니다.`}
            postscript={`${cryptoType(
              siteWalletInfoList[0].chainType,
            )}는 ${utilType(siteWalletInfoList[0].chainType)} 기준입니다.`}
          />
          <StatisticsCard
            title="사이트 입금 내역"
            statistics={siteWalletInfoList[
              selectedIndex as number
            ].depositHistoryLength.toString()}
            description="Icoins의 모든 입금내역이 포함됩니다."
            postscript="Icoins 이외의 내역은 아래의 테이블을 확인해주세요."
          />
          <StatisticsCard
            title="금일 입금 금액"
            statistics={parseInt(
              siteWalletInfoList[selectedIndex as number].todayDepositAmount,
            ).toLocaleString("ko-KR")}
            unit="원"
            description={`${iso8601ToYYMMDDHHMM(now!)} 부 최신화된 결과입니다.`}
            postscript="Icoins를 통한 입금내역입니다."
          />
          <StatisticsCard
            title="최근 입금 금액"
            statistics={parseInt(
              siteWalletInfoList[selectedIndex as number].weeksDepositAmount,
            ).toLocaleString("ko-KR")}
            unit="원"
            description="금일자로 일주일 기준입니다."
            postscript="Icoins를 통한 입금내역입니다."
          />
        </div>
      )}
      <CryptoTransferList transferList={transferList} />
    </>
  );
}
