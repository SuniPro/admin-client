/** @jsxImportSource @emotion/react */
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
import {
  departmentLabelMap,
  departmentList,
  DepartmentType,
  EmployeeType,
  levelLabelMap,
  LevelType,
} from "../../model/employee";
import styled from "@emotion/styled";
import { css, Theme, useTheme } from "@emotion/react";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useWindowContext } from "../../context/WindowContext";
import { useQuery } from "@tanstack/react-query";
import { PaginationResponse } from "../../model/pagination";
import { iso8601ToYYMMDDHHMM } from "../styled/Date/DateFomatter";
import { FuncItem } from "../styled/Button";
import { Container } from "../layouts/Frames";
import { SignUp } from "../../Page/Sign";
import { Pagination, TableBody, TableHeader } from "../Table";
import { CustomModal } from "../Modal";
import { EmailSearch, HorizontalDivider } from "../layouts";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getAllEmployeeList } from "../../api/employee";

export function EmployeeList(props: {
  selectedIdState: {
    selectedId: number;
    setSelectedId: Dispatch<SetStateAction<number>>;
  };
}) {
  const { selectedIdState } = props;
  const { setSelectedId } = selectedIdState;
  const theme = useTheme();
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [open, setOpen] = useState<boolean>(false);
  const close = () => setOpen(false);
  const { windowWidth } = useWindowContext();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, refetch } = useQuery<PaginationResponse<EmployeeType>>({
    queryKey: ["getAllEmployeeList", pageIndex, pageSize],
    queryFn: () => getAllEmployeeList(pageIndex, pageSize),
  });

  const employeeList = data?.content;

  const columns = useMemo<ColumnDef<EmployeeType>[]>(
    () => [
      {
        id: "No.",
        header: "번호",
        size: 50,
        accessorKey: "id",
      },
      {
        id: "department",
        header: "부서",
        accessorKey: "department",
        cell: ({ row }) => (
          <span>
            {departmentLabelMap[row.getValue("department") as DepartmentType]}팀
          </span>
        ),
      },
      {
        id: "level",
        header: "직급",
        accessorKey: "level",
        cell: ({ row }) => (
          <span>{levelLabelMap[row.getValue("level") as LevelType]}</span>
        ),
      },
      {
        id: "name",
        header: "이름",
        accessorKey: "name",
        cell: ({ row }) => (
          <span onClick={() => setSelectedId(row.getValue("id"))}>
            {row.getValue("name")}
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
        id: "func",
        header: "기능",
        size: 50,
        cell: () => (
          <TableFunctionLine>
            <EditIcon />
            <DeleteIcon />
          </TableFunctionLine>
        ),
      },
    ],
    [setSelectedId],
  );

  const table = useReactTable<EmployeeType>({
    data: employeeList ?? [],
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

  const safeGetColumn = (value: string) => {
    if (table.getColumn(value)) {
      return table.getColumn(value);
    }
  };

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
            <select
              css={css`
                border: none;
                font-size: 16px;
                margin-right: 20px;
                background-color: ${theme.mode.cardBackground};
              `}
              value={safeGetColumn("department")?.getFilterValue() as string}
              onChange={(e) =>
                table
                  .getColumn("department")
                  ?.setFilterValue(e.target.value || undefined)
              }
            >
              <option value="">전체 부서</option>
              {departmentList.map((value) => (
                <option key={value} value={value}>
                  {departmentLabelMap[value as DepartmentType]}
                </option>
              ))}
            </select>
            <EmailSearch
              theme={theme}
              placeholder="이름 검색"
              value={table.getColumn("name")?.getFilterValue() as string}
              onChange={(e) =>
                table.getColumn("name")?.setFilterValue(e.target.value)
              }
            />
          </div>
          <AddEmployeeButton
            label="직원 추가"
            isActive={true}
            activeBackgroundColor={theme.mode.cardBackground}
            inActiveBackgroundColor={theme.mode.cardBackground}
            func={() => setOpen(true)}
            theme={theme}
          />
        </HeaderLine>
        <HorizontalDivider width={95} />
        <TableContainer width={(windowWidth / 100) * 92}>
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
          children={<SignUp close={close} refetch={refetch} />}
        />
      </StyledContainer>
    </>
  );
}

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

const TableContainer = styled.table<{ width: number }>(
  ({ width }) => css`
    border-spacing: 0;
    width: ${width}px;
    overflow-x: scroll;

    thead {
      border: none;
    }
  `,
);

const HeaderLine = styled.div<{ theme: Theme }>(
  ({ theme }) => css`
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 16px;

    padding: 14px 0 8px 0;

    font-family: ${theme.mode.font.component.itemTitle};
  `,
);

const AddEmployeeButton = styled(FuncItem)<{ theme: Theme }>(
  ({ theme }) => css`
    cursor: pointer;
    font-family: ${theme.mode.font.button.default};
    color: ${theme.mode.textPrimary};

    &:hover {
      color: ${theme.mode.textPrimary};
    }
  `,
);

const TableFunctionLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
