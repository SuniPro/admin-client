/** @jsxImportSource @emotion/react */
import { EmployeeInfoType } from "@/model/employee";
import { css, useTheme } from "@emotion/react";
import { useWindowContext } from "../../context/WindowContext";
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
import { useQuery } from "@tanstack/react-query";
import { PaginationResponse } from "@/model/pagination";
import { CryptoAccountType } from "@/model/financial";
import {
  getAllCryptoAccountBySite,
  getCryptoAccountByEmailAndSite,
  updateCryptoWallet,
} from "@/api/financial";
import { iso8601ToYYMMDDHHMM } from "../styled/Date/DateFomatter";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  HeaderLine,
  Pagination,
  StyledContainer,
  TableBody,
  TableContainer,
  TableFunctionLine,
  TableHeader,
  TableHeaderFuncButton,
  TableWrapper,
} from "../Table";
import { HorizontalDivider, TableSearchBar } from "../layouts";
import { EditNoteIcon } from "../styled/icons";
import { Input } from "@heroui/input";
import { ErrorAlert } from "../Alert";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import { CustomModal } from "../Modal";
import { WriteMemo } from "../Lexical/modal/financialModal";

type TableMeta = {
  selectedRows: CryptoAccountType | null;
  setSelectedRows: (_r: CryptoAccountType | null) => void;
  changeCryptoWalletSwitch: boolean;
  setChangeCryptoWalletSwitch: (_b: boolean) => void;
  newCryptoWallet: string;
  setNewCryptoWallet: (_newCryptoWallet: string) => void;
  updateCryptoWallet: (_cryptoWallet: string) => Promise<CryptoAccountType>;
  refetch: () => Promise<unknown>;
};

export function CryptoAccountList(props: { employee: EmployeeInfoType }) {
  const { employee } = props;

  const theme = useTheme();

  const { windowWidth } = useWindowContext();

  const [open, setOpen] = useState<boolean>(false);

  const [selectedRows, setSelectedRows] = useState<CryptoAccountType | null>(
    null,
  );

  const [changeCryptoWalletSwitch, setChangeCryptoWalletSwitch] =
    useState<boolean>(false);
  const [newCryptoWallet, setNewCryptoWallet] = useState<string>("");

  const [searchEmail, setSearchEmail] = useState<string>("");
  const [searchAccount, setSearchAccount] = useState<CryptoAccountType[]>([]);

  const emailSearch = () => {
    getCryptoAccountByEmailAndSite(searchEmail.trim(), employee.site).then(
      (result) => setSearchAccount(result),
    );
  };

  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "insertDateTime", desc: true },
  ]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, refetch } = useQuery<PaginationResponse<CryptoAccountType>>({
    queryKey: ["getAllTetherAccounts", pageIndex, pageSize],
    queryFn: () =>
      getAllCryptoAccountBySite(employee.site, pageIndex, pageSize),
    placeholderData: (previousData) => previousData,
    refetchInterval: 300000,
  });

  const tetherAccountList = data?.content;

  const columns = useMemo<ColumnDef<CryptoAccountType>[]>(
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
        id: "email",
        header: "이메일",
        accessorKey: "email",
      },
      {
        id: "cryptoWallet",
        header: "지갑주소",
        accessorKey: "cryptoWallet",
        cell: (ctx) => {
          const meta = ctx.table.options.meta as TableMeta;
          const isEditing =
            meta.selectedRows &&
            meta.selectedRows.id === ctx.row.original.id &&
            meta.changeCryptoWalletSwitch;

          if (isEditing) {
            return (
              <div
                css={css`
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: flex-start;
                `}
              >
                <Input
                  size="sm"
                  variant="underlined"
                  autoFocus
                  value={meta.newCryptoWallet}
                  onChange={(e) => meta.setNewCryptoWallet(e.target.value)}
                />
                <EditIcon
                  fontSize="small"
                  onClick={() =>
                    meta.updateCryptoWallet(meta.newCryptoWallet).then(() =>
                      meta
                        .refetch()
                        .then(() => meta.setChangeCryptoWalletSwitch(false))
                        .catch((e) => ErrorAlert(e.message)),
                    )
                  }
                />
                <CancelIcon
                  fontSize="small"
                  onClick={() => setChangeCryptoWalletSwitch(false)}
                />
              </div>
            );
          }

          return (
            <span
              className="cursor-pointer"
              onClick={() => {
                meta.setSelectedRows(ctx.row.original);
                // 편집 시작 시 기존 값을 초기화하고 싶다면 여기서 meta.changeWallet 호출
                // meta.changeWallet({ target: { value: ctx.row.original.cryptoWallet } } as any);
                meta.setChangeCryptoWalletSwitch(true);
              }}
            >
              {ctx.row.getValue("cryptoWallet") as string}
            </span>
          );
        },
      },
      {
        id: "insertDateTime",
        header: "가입 일자",
        accessorKey: "insertDateTime",
        enableSorting: true,
        cell: ({ row }) => (
          <span>{iso8601ToYYMMDDHHMM(row.getValue("insertDateTime"))}</span>
        ),
      },
      {
        id: "updateDateTime",
        header: "수정 일자",
        accessorKey: "updateDateTime",
        enableSorting: true,
        cell: ({ row }) => (
          <span>
            {row.getValue("updateDateTime") !== null
              ? iso8601ToYYMMDDHHMM(row.getValue("updateDateTime"))
              : ""}
          </span>
        ),
      },
      {
        id: "func",
        header: "기능",
        size: 50,
        cell: ({ row }) => (
          <TableFunctionLine>
            <EditNoteIcon
              onClick={() => {
                setOpen(true);
                setSelectedRows(row.original);
              }}
              color={row.original.memo !== null ? "primary" : "disabled"}
              fontSize="small"
            />
            <DeleteIcon fontSize="small" />
          </TableFunctionLine>
        ),
      },
    ],
    [],
  );

  const tableRowHandle = () => {
    if (searchAccount.length !== 0) {
      return searchAccount;
    } else if (tetherAccountList) {
      return tetherAccountList;
    } else {
      return [];
    }
  };

  const table = useReactTable<CryptoAccountType>({
    data: tableRowHandle(),
    columns,
    pageCount: data?.totalPages ?? 0,
    meta: {
      selectedRows,
      setSelectedRows,
      changeCryptoWalletSwitch,
      setChangeCryptoWalletSwitch,
      newCryptoWallet,
      setNewCryptoWallet,
      updateCryptoWallet,
      refetch,
    } satisfies TableMeta,
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

  return (
    <>
      <StyledContainer theme={theme}>
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
              value={searchEmail}
              placeholder="이메일 검색"
              onChange={(e) => setSearchEmail(e.target.value)}
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
          >
            <TableHeaderFuncButton
              label="검색"
              func={emailSearch}
              theme={theme}
              css={css`
                font-size: 12px;
                border: 1px solid ${theme.mode.textSecondary};

                &:hover {
                  color: ${theme.mode.textRevers};
                }
              `}
            />
            <TableHeaderFuncButton
              label="초기화"
              func={() => {
                setSearchEmail("");
                setSearchAccount([]);
                refetch().then();
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
      </StyledContainer>
      {selectedRows && selectedRows.memo && (
        <CustomModal open={open} close={() => setOpen(false)}>
          <WriteMemo
            account={selectedRows}
            memo={selectedRows.memo}
            close={() => setOpen(false)}
            refetch={refetch}
          />
        </CustomModal>
      )}
    </>
  );
}
