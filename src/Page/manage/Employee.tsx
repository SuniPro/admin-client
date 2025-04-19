/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from "@emotion/react";
import { Container } from "../../components/layouts/Frames/FrameLayouts";
import { useMemo, useState } from "react";
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
  departmentType,
  EmployeeType,
  levelLabelMap,
  levelType,
} from "../../model/employee";
import { iso8601ToYYMMDDHHMM } from "../../components/styled/Date/DateFomatter";
import { useQuery } from "@tanstack/react-query";
import { getAllEmployeeList } from "../../api/employee";
import styled from "@emotion/styled";
import {
  Pagination,
  TableBody,
  TableHeader,
} from "../../components/Table/Table";
import { FuncItem } from "../../components/styled/Button/Button";
import { HorizontalDivider } from "../../components/layouts/Layouts";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { SignUp } from "../Sign";
import { EmployeeAnalysisPanel } from "../../components/analysis/Employee";
import { CustomModal } from "../../components/Modal/Modal";
import { PaginationResponse } from "../../model/pagination";

export function Employee(props: { user: EmployeeType }) {
  const { user } = props;
  const theme = useTheme();
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [open, setOpen] = useState<boolean>(false);
  const close = () => setOpen(false);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [selectedId, setSelectedId] = useState<number>(2);

  const { data } = useQuery<PaginationResponse<EmployeeType>>({
    queryKey: ["getAllEmployeeList"],
    queryFn: () => getAllEmployeeList(pageIndex, pageSize),
    refetchInterval: 10000,
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
            {departmentLabelMap[row.getValue("department") as departmentType]}팀
          </span>
        ),
      },
      {
        id: "level",
        header: "직급",
        accessorKey: "level",
        cell: ({ row }) => (
          <span>{levelLabelMap[row.getValue("level") as levelType]}</span>
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
          <div
            css={css`
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              gap: 10px;
            `}
          >
            <EditIcon />
            <DeleteIcon />
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable<EmployeeType>({
    data: employeeList ?? [],
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

  const safeGetColumn = (value: string) => {
    if (table.getColumn(value)) {
      return table.getColumn(value);
    }
  };

  return (
    <>
      <EmployeeAnalysisPanel user={user} employeeId={selectedId} />
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
                  {departmentLabelMap[value as departmentType]}
                </option>
              ))}
            </select>
            <input
              css={css`
                border: none;
                font-size: 16px;
              `}
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
        <TableContainer>
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
          children={<SignUp close={close} />}
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

const TableContainer = styled.table`
  border-spacing: 0;
  width: 100%;

  thead {
    border: none;
  }
`;

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
    font-family: ${theme.mode.font.button.default};

    color: ${theme.mode.textPrimary};
  `,
);
