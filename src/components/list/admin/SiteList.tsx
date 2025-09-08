/** @jsxImportSource @emotion/react */
import { updateOnlySite, updateOnlyWallet } from "@/api/site";
import {
  HeaderLine,
  StyledContainer,
  TableBody,
  TableContainer,
  TableHeader,
  TableWrapper,
} from "@/components/Table";
import { SiteType, SiteWalletType } from "@/model/site";
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
import { useEffect, useMemo, useRef, useState } from "react";
import { css, useTheme } from "@emotion/react";
import { useWindowContext } from "@/context/WindowContext";
import { HorizontalDivider, TableSearchBar } from "@/components/layouts";
import { iso8601ToYYMMDDHHMM } from "@/components/styled/Date/DateFomatter";
import TelegramIcon from "@mui/icons-material/Telegram";
import { issueLinkToken, unlink } from "@/api/telegram";
import { CustomModal } from "@/components/Modal";
import { PatchModal } from "@/components/Modal/PatchModal";
import { Select, SelectItem, Tooltip } from "@heroui/react";
import { ChainType } from "@/model/financial";
import { SuccessAlert } from "@/components/Alert";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

type SiteTableMeta = {
  selectedRows: SiteType | null;
  setSelectedRows: (_r: SiteType | null) => void;
  siteChange: boolean;
  setSiteChange: (_r: boolean) => void;
};

type WalletTableMeta = {
  selectedWallet: SiteWalletType | null;
  setSelectedWallet: (_r: SiteWalletType | null) => void;
  walletChange: boolean;
  setWalletChange: (_r: boolean) => void;
};

export function SiteList(props: {
  siteList: SiteType[];
  refetch: (
    _options?: RefetchOptions,
  ) => Promise<QueryObserverResult<SiteType[], Error>>;
}) {
  const { siteList, refetch } = props;
  const theme = useTheme();
  const { windowWidth } = useWindowContext();

  /* Modal */
  const [walletChange, setWalletChange] = useState<boolean>(false);
  const [siteChange, setSiteChange] = useState<boolean>(false);

  const [newChain, setNewChain] = useState<ChainType>("TRON");
  const [newWallet, setNewWallet] = useState<string>("");
  const [newSite, setNewSite] = useState<string>("");

  const walletRef = useRef<HTMLInputElement | null>(null);

  const [selectedRows, setSelectedRows] = useState<SiteType | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<SiteWalletType | null>(
    null,
  );

  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "insertDateTime", desc: true },
  ]);

  const siteListRenderRef = useRef(false);

  useEffect(() => {
    if (siteListRenderRef.current) return;
    setSelectedRows(siteList[0]);
    siteListRenderRef.current = true;
  }, [siteList]);

  const columns = useMemo<ColumnDef<SiteType>[]>(
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
        accessorKey: "site",
        filterFn: "includesString",
        size: 70,
        cell: ({ row }) => (
          <>
            <Tooltip content="사이트를 눌러 변경할 수 있습니다.">
              <span
                className="cursor-pointer"
                onClick={() => {
                  setSiteChange(true);
                  setSelectedRows(row.original);
                }}
              >
                {row.getValue("site")}
              </span>
            </Tooltip>
          </>
        ),
      },
      {
        id: "telegramUsername",
        header: "텔레그램 아이디",
        accessorKey: "telegramUsername",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span
            onClick={() => {
              setSelectedRows(row.original);
            }}
          >
            {row.getValue("telegramUsername")}
          </span>
        ),
      },
      {
        id: "telegramChatId",
        header: "텔레그램 채팅방",
        accessorKey: "telegramChatId",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span
            onClick={() => {
              setSelectedRows(row.original);
            }}
          >
            {row.getValue("telegramChatId")}
          </span>
        ),
      },
      {
        id: "insertDateTime",
        header: "가입일자",
        accessorKey: "insertDateTime",
        enableSorting: true,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span
            onClick={() => {
              setSelectedRows(row.original);
            }}
          >
            {iso8601ToYYMMDDHHMM(row.getValue("insertDateTime"))}
          </span>
        ),
      },
      {
        id: "updateDateTime",
        header: "수정일자",
        accessorKey: "updateDateTime",
        enableSorting: true,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span
            onClick={() => {
              setSelectedRows(row.original);
            }}
          >
            {row.getValue("updateDateTime")
              ? iso8601ToYYMMDDHHMM(row.getValue("updateDateTime"))
              : ""}
          </span>
        ),
      },
      {
        id: "telegramLink",
        header: "연결",
        size: 30,
        cell: ({}) => (
          <TelegramIcon
            fontSize="small"
            color="primary"
            onClick={() =>
              issueLinkToken().then((r) =>
                window.open(r.link, "_blank", "noopener, noreferrer"),
              )
            }
          />
        ),
      },
      {
        id: "telegramLink",
        header: "해제",
        size: 30,
        cell: ({}) => (
          <TelegramIcon
            fontSize="small"
            color="error"
            onClick={() =>
              unlink().then(() => SuccessAlert("연결이 해제되었습니다."))
            }
          />
        ),
      },
    ],
    [],
  );

  const table = useReactTable<SiteType>({
    data: siteList,
    columns,
    meta: {
      selectedRows,
      setSelectedRows,
      siteChange,
      setSiteChange,
    } satisfies SiteTableMeta,
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

  const walletColumns = useMemo<ColumnDef<SiteWalletType>[]>(
    () => [
      {
        id: "chainType",
        header: "체인",
        accessorKey: "chainType",
      },
      {
        id: "cryptoWallet",
        header: "지갑 주소",
        accessorKey: "cryptoWallet",
        cell: ({ row }) => (
          <>
            <Tooltip content="지갑을 눌러 변경할 수 있습니다.">
              <span
                className="cursor-pointer"
                onClick={() => {
                  setWalletChange(true);
                  setSelectedWallet(row.original);
                }}
              >
                {row.getValue("cryptoWallet")}
              </span>
            </Tooltip>
          </>
        ),
      },
    ],
    [],
  );

  const walletTable = useReactTable<SiteWalletType>({
    data: selectedRows?.siteWalletList ?? [],
    columns: walletColumns,
    meta: {
      selectedWallet,
      setSelectedWallet,
      walletChange,
      setWalletChange,
    } satisfies WalletTableMeta,
    getCoreRowModel: getCoreRowModel(),
  });

  const siteFilterValue = table.getColumn("site")?.getFilterValue() as string;

  return (
    <>
      <div
        css={css`
          width: 100%;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: space-between;
        `}
      >
        <StyledContainer
          theme={theme}
          css={css`
            width: 58% !important;
          `}
        >
          <HeaderLine theme={theme}>
            <div
              css={css`
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
              `}
            >
              <TableSearchBar
                value={siteFilterValue}
                onChange={(e) =>
                  table.getColumn("site")?.setFilterValue(e.target.value)
                }
                placeholder="사이트 검색"
                theme={theme}
              />
            </div>
            <div
              css={css`
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                gap: 10px;
              `}
            ></div>
          </HeaderLine>
          <HorizontalDivider width={95} />
          <TableWrapper
            width={(windowWidth / 100) * 50}
            theme={theme}
            css={css`
              width: 100% !important;
            `}
          >
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
        <StyledContainer
          theme={theme}
          css={css`
            width: 40% !important;
          `}
        >
          <TableWrapper
            width={(windowWidth / 100) * 50}
            theme={theme}
            css={css`
              width: 100% !important;
            `}
          >
            <TableContainer>
              <TableHeader
                table={walletTable}
                headerBorder="none"
                columnResizeMode={columnResizeMode}
              />
              <TableBody table={walletTable} />
            </TableContainer>
          </TableWrapper>
        </StyledContainer>
        {selectedRows && (
          <CustomModal open={siteChange} close={() => setSiteChange(false)}>
            <PatchModal
              func={() => {
                updateOnlySite(selectedRows.id, newSite).then(() => {
                  refetch().then();
                  setSiteChange(false);
                });
              }}
              title="사이트"
            >
              <div
                css={css`
                  width: 100%;

                  height: 40px;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                `}
              >
                <input
                  ref={walletRef}
                  defaultValue={selectedRows.site}
                  onChange={(e) => setNewSite(e.target.value)}
                  css={css`
                    width: 100%;
                    padding: 0 5px;
                    box-sizing: border-box;
                  `}
                />
              </div>
            </PatchModal>
          </CustomModal>
        )}
        {selectedWallet && (
          <CustomModal open={walletChange} close={() => setWalletChange(false)}>
            <PatchModal
              func={() => {
                updateOnlyWallet(selectedWallet.id, newWallet, newChain).then(
                  () => {
                    refetch().then();
                    setWalletChange(false);
                  },
                );
              }}
              title="지갑"
            >
              <div
                css={css`
                  width: 100%;

                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                `}
              >
                <input
                  ref={walletRef}
                  defaultValue={selectedWallet.cryptoWallet}
                  onChange={(e) => setNewWallet(e.target.value)}
                  css={css`
                    width: 82%;
                  `}
                />
                <Select
                  className="w-[18%]"
                  aria-labelledby="search-type-label"
                  variant="underlined"
                  defaultSelectedKeys={[selectedWallet.chainType]}
                  value={[selectedWallet.chainType]}
                  selectedKeys={new Set([newChain])}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys)[0] as ChainType | undefined; // keys는 Selection(Set)
                    if (val) {
                      setNewChain(val);
                    }
                  }}
                  css={css`
                    span {
                      color: ${theme.mode.textPrimary};
                    }
                  `}
                >
                  {["BTC", "ETH", "TRON"].map((object) => (
                    <SelectItem key={object}>{object}</SelectItem>
                  ))}
                </Select>
              </div>
            </PatchModal>
          </CustomModal>
        )}
      </div>
    </>
  );
}
