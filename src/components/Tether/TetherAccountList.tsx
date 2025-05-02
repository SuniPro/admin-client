/** @jsxImportSource @emotion/react */
import { useNavigate } from "react-router-dom";
import { EmployeeType } from "../../model/employee";
import { ConfirmAlert, ErrorAlert, SuccessAlert } from "../Alert/Alerts";
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
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import { PaginationResponse } from "../../model/pagination";
import { TetherAccountType } from "../../model/financial";
import { getAllTetherAccounts, updateTetherWallet } from "../../api/financial";
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
} from "../Table";
import { HorizontalDivider } from "../layouts/Layouts";
import { CustomModal } from "../Modal/Modal";
import styled from "@emotion/styled";
import { Container } from "../layouts/Frames/FrameLayouts";
import { PlusButton } from "../styled/Button";

export function TetherAccountList(props: {
  user: EmployeeType;
  selectedIdState: {
    selectedId: number;
    setSelectedId: Dispatch<SetStateAction<number>>;
  };
}) {
  const { user, selectedIdState } = props;
  const { selectedId, setSelectedId } = selectedIdState;
  const navigate = useNavigate();

  if (user.level === "STAFF" || user.level === "ASSOCIATE") {
    navigate("/");
    ErrorAlert("현재 업무관리는 차장급 이상만 접근 가능합니다.");
  }

  const theme = useTheme();

  const { windowWidth } = useWindowContext();

  const [open, setOpen] = useState<boolean>(false);
  const close = () => setOpen(false);

  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, refetch } = useQuery<PaginationResponse<TetherAccountType>>({
    queryKey: ["getAllTetherAccounts", pageIndex, pageSize],
    queryFn: () => getAllTetherAccounts(pageIndex, pageSize),
    placeholderData: (previousData) => previousData,
  });

  const tetherAccountList = data?.content;

  const columns = useMemo<ColumnDef<TetherAccountType>[]>(
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
      },
      {
        id: "tetherWallet",
        header: "지갑주소",
        accessorKey: "tetherWallet",
        cell: ({ row }) => (
          <span
            onClick={() => {
              setSelectedId(row.original.id);
              setOpen(true);
            }}
          >
            {row.getValue("tetherWallet")}
          </span>
        ),
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
        cell: () => (
          <TableFunctionLine>
            <DeleteIcon />
          </TableFunctionLine>
        ),
      },
    ],
    [setSelectedId],
  );

  const table = useReactTable<TetherAccountType>({
    data: tetherAccountList ?? [],
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
              justify-content: flex-start;
            `}
          >
            <input
              css={css`
                border: none;
                font-size: 16px;
              `}
              placeholder="이메일 검색"
              value={table.getColumn("email")?.getFilterValue() as string}
              onChange={(e) =>
                table.getColumn("email")?.setFilterValue(e.target.value)
              }
            />
          </div>
        </HeaderLine>
        <HorizontalDivider width={95} />
        <TableContainer width={(windowWidth / 100) * 95}>
          <TableHeader
            table={table}
            headerBorder="none"
            columnResizeMode={columnResizeMode}
          />
          <TableBody table={table} />
        </TableContainer>
        <Pagination table={table} />
        <CustomModal
          open={open}
          close={close}
          css={css`
            height: 100px;
            padding: 0 20px;
          `}
          children={
            <ChangeTetherWallet
              close={close}
              refetch={refetch}
              accountId={selectedId}
            />
          }
        />
      </StyledContainer>
    </>
  );
}

function ChangeTetherWallet(props: {
  accountId: number;
  close: () => void;
  refetch: (
    _options?: RefetchOptions,
  ) => Promise<
    QueryObserverResult<PaginationResponse<TetherAccountType>, Error>
  >;
}) {
  const { accountId, close, refetch } = props;
  const [newWallet, setNewWallet] = useState<string>("");

  const theme = useTheme();

  return (
    <ChangeTetherWalletContainer theme={theme}>
      <InputLine>
        <Label>이름</Label>
        <ChangeWalletInput
          maxLength={100}
          onChange={(e) => setNewWallet(e.target.value)}
          theme={theme}
          placeholder="변경할 지갑 주소를 입력하세요."
        />
        <StyledPlusButton
          func={() =>
            ConfirmAlert("정말 변경하시겠습니까?", () =>
              updateTetherWallet(accountId, newWallet)
                .then(() => {
                  close();
                  refetch().then();
                  SuccessAlert("변경 완료");
                })
                .catch((e) => ErrorAlert(e.message)),
            )
          }
          theme={theme}
        />
      </InputLine>
    </ChangeTetherWalletContainer>
  );
}

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
