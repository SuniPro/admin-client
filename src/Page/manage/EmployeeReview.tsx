/** @jsxImportSource @emotion/react */
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { css, Theme, useTheme } from "@emotion/react";
import { PaginationResponse } from "../../model/pagination";
import { HTMLProps, useEffect, useMemo, useRef, useState } from "react";
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
import { iso8601ToYYMMDDHHMM } from "../../components/styled/Date/DateFomatter";
import {
  HeaderLine,
  Pagination,
  StyledContainer,
  TableBody,
  TableContainer,
  TableHeader,
  TableHeaderFuncButton,
  TableWrapper,
} from "../../components/Table";
import { useWindowContext } from "../../context/WindowContext";
import {
  EmailSearch,
  HorizontalDivider,
} from "../../components/layouts/Layouts";
import styled from "@emotion/styled";
import { createAbility, getAbilityTargetEmployeeList } from "../../api/review";
import { AbilityReviewType } from "../../model/review";
import { ConfirmAlert } from "../../components/Alert/Alerts";

export function EmployeeReview() {
  const { user } = useUserContext();
  const theme = useTheme();
  const navigate = useNavigate();
  const { windowWidth } = useWindowContext();

  const [rowSelection, setRowSelection] = useState({});
  const [selectedAbilityList, setSelectedAbilityList] = useState<
    AbilityReviewType[]
  >([]);

  const saveReview = () => {
    ConfirmAlert("평가를 저장하시겠습니까?", () =>
      createAbility(selectedAbilityList),
    );
  };

  if (user) {
    if (user.level === "ASSOCIATE" || user.level === "STAFF") {
      navigate("/");
    }
  }

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data: reviewData } = useQuery<PaginationResponse<AbilityReviewType>>({
    queryKey: ["getReview"],
    queryFn: () =>
      getAbilityTargetEmployeeList(
        user!.level,
        user!.department,
        pageIndex,
        pageSize,
      ),
    refetchInterval: 10000,
    enabled: Boolean(user),
  });

  const employeeList = reviewData?.content;

  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo<ColumnDef<AbilityReviewType>[]>(
    () => [
      {
        id: "select",
        size: 10,
        header: ({ table }) => (
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
      },
      {
        id: "employeeName",
        header: "이름",
        accessorKey: "employeeName",
        size: 20,
      },
      {
        id: "creativity",
        header: "창의력",
        accessorKey: "creativity",
        size: 100,
        cell: ({ row }) => (
          <ReviewInput
            onMouseOver={(e) => e.currentTarget.focus()}
            theme={theme}
            defaultValue={row.getValue("creativity")}
            type="number"
            max={5}
            min={0}
          />
        ),
      },
      {
        id: "workPerformance",
        header: "업무수행능력",
        accessorKey: "workPerformance",
        size: 100,
        cell: ({ row }) => (
          <ReviewInput
            onMouseOver={(e) => e.currentTarget.focus()}
            theme={theme}
            defaultValue={row.getValue("workPerformance")}
            type="number"
            max={5}
            min={0}
          />
        ),
      },
      {
        id: "teamwork",
        header: "협동력",
        accessorKey: "teamwork",
        size: 100,
        cell: ({ row }) => (
          <ReviewInput
            onMouseOver={(e) => e.currentTarget.focus()}
            theme={theme}
            defaultValue={row.getValue("teamwork")}
            type="number"
            max={5}
            min={0}
          />
        ),
      },
      {
        id: "knowledgeLevel",
        header: "지식",
        accessorKey: "knowledgeLevel",
        size: 100,
        cell: ({ row }) => (
          <ReviewInput
            onMouseOver={(e) => e.currentTarget.focus()}
            theme={theme}
            defaultValue={row.getValue("knowledgeLevel")}
            type="number"
            max={5}
            min={0}
          />
        ),
      },
      {
        id: "reviewDate",
        header: "평가 일자",
        accessorKey: "reviewDate",
        enableSorting: true,
        size: 100,
        cell: ({ row }) => (
          <span>
            {row.getValue("reviewDate") !== null
              ? iso8601ToYYMMDDHHMM(row.getValue("reviewDate"))
              : null}
          </span>
        ),
      },
    ],
    [theme],
  );

  const table = useReactTable<AbilityReviewType>({
    data: employeeList ?? [],
    columns,
    pageCount: reviewData?.totalPages ?? 0,
    state: {
      rowSelection,
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
    enableRowSelection: true,
    getRowId: (row) => row.employeeId.toString(),
    onRowSelectionChange: (updater) => {
      const newRowSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;

      const selectedRows = Object.entries(newRowSelection)
        .filter(([_, selected]) => selected)
        .map(([rowId]) => table.getRow(rowId).original)
        .filter(Boolean) as AbilityReviewType[];

      setRowSelection(newRowSelection);
      setSelectedAbilityList(selectedRows);
    },
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
            <EmailSearch
              css={css`
                border: none;
                font-size: 16px;
              `}
              placeholder="이름 검색"
              value={
                table.getColumn("employeeName")?.getFilterValue() as string
              }
              onChange={(e) =>
                table.getColumn("employeeName")?.setFilterValue(e.target.value)
              }
              theme={theme}
            />
          </div>
          <TableHeaderFuncButton
            label="평가 저장"
            isActive={true}
            activeBackgroundColor={theme.mode.cardBackground}
            inActiveBackgroundColor={theme.mode.cardBackground}
            func={saveReview}
            theme={theme}
          />
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
        <Pagination table={table} />
      </StyledContainer>
    </>
  );
}

const ReviewInput = styled.input<{ theme: Theme }>(
  ({ theme }) => css`
    border: none;
    background: none;

    font-size: 18px;

    font-family: ${theme.mode.font.component.itemDescription};

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox  */
    &[type="number"] {
      -moz-appearance: textfield;
    }

    &:focus-visible {
      outline: none;
    }
  `,
);

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}
