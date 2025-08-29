/** @jsxImportSource @emotion/react */
import { EmployeeInfoType } from "../../model/employee";
import { css, Theme, useTheme } from "@emotion/react";
import { useWindowContext } from "../../context/WindowContext";
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
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaginationResponse } from "../../model/pagination";
import { CryptoAccountType } from "../../model/financial";
import {
  getAllCryptoAccountBySite,
  getCryptoAccountByEmailAndSite,
} from "../../api/financial";
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
import { EmailSearch, HorizontalDivider } from "../layouts";
import { CustomModal } from "../Modal";
import styled from "@emotion/styled";
import { Container } from "../layouts/Frames";
import { PlusButton } from "../styled/Button";
import { EditNoteIcon } from "../styled/icons";

export function CryptoAccountList(props: { employee: EmployeeInfoType }) {
  const { employee } = props;

  const theme = useTheme();

  const { windowWidth } = useWindowContext();

  const [searchEmail, setSearchEmail] = useState<string>("");
  const [searchAccount, setSearchAccount] = useState<CryptoAccountType[]>([]);

  const emailSearch = () => {
    getCryptoAccountByEmailAndSite(searchEmail, employee.site).then((result) =>
      setSearchAccount(result),
    );
  };

  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
              color={row.original.memo !== null ? "primary" : "disabled"}
            />
            <DeleteIcon />
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
            <EmailSearch
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

// function ChangeTetherWallet(props: {
//   accountId: number;
//   close: () => void;
//   refetch: (
//     _options?: RefetchOptions,
//   ) => Promise<
//     QueryObserverResult<PaginationResponse<CryptoAccountType>, Error>
//   >;
// }) {
//   const { accountId, close, refetch } = props;
//   const [newWallet, setNewWallet] = useState<string>("");
//
//   const theme = useTheme();
//
//   return (
//     <ChangeTetherWalletContainer theme={theme}>
//       <InputLine>
//         <Label>주소</Label>
//         <ChangeWalletInput
//           maxLength={100}
//           onChange={(e) => setNewWallet(e.target.value)}
//           theme={theme}
//           placeholder="변경할 지갑 주소를 입력하세요."
//         />
//         <StyledPlusButton
//           func={() =>
//             ConfirmAlert("정말 변경하시겠습니까?", () =>
//               updateTetherWallet(accountId, newWallet)
//                 .then(() => {
//                   close();
//                   refetch().then();
//                   SuccessAlert("변경 완료");
//                 })
//                 .catch((e) => ErrorAlert(e.message)),
//             )
//           }
//           theme={theme}
//         />
//       </InputLine>
//     </ChangeTetherWalletContainer>
//   );
// }

const Label = styled.span``;

const InputLine = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;

  width: 100%;
`;

const ChangeWalletInput = styled.input<{
  theme: Theme;
}>(
  ({ theme }) => css`
    width: 80%;
    border: none;
    font-size: 18px;
    color: ${theme.mode.textPrimary};
    box-sizing: border-box;
    padding: 0 15px;
    font-family: ${theme.mode.font.component.itemTitle};
    font-weight: 600;

    &:focus-visible {
      outline: none;
    }
  `,
);

const ChangeTetherWalletContainer = styled(Container)<{
  theme: Theme;
  height?: number;
}>(
  ({ theme, height }) => css`
    width: 100%;
    height: ${height}vh;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-family: ${theme.mode.font.component.itemDescription};

    font-size: 18px;

    gap: 20px;
  `,
);

const StyledPlusButton = styled(PlusButton)<{ theme: Theme }>(
  ({ theme }) => css`
    position: relative;
    right: 10px;

    circle {
      fill: ${theme.mode.textSecondary} !important;
    }
  `,
);

const StyledModal = styled(CustomModal)`
  justify-content: flex-start;
  align-items: center;
`;
