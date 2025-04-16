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
import { useMemo, useState } from "react";
import { NotifyType } from "../../model/notify";
import { levelLabelMap, levelList, levelType } from "../../model/employee";
import { iso8601ToYYMMDDHHMM } from "../styled/Date/DateFomatter";
import { Container } from "../layouts/Frames/FrameLayouts";
import { css, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { FuncItem } from "../styled/Button/Button";
import { HorizontalDivider } from "../layouts/Layouts";
import { Pagination, TableBody, TableHeader } from "../Table/Table";
import { CustomModal } from "../Modal/Modal";

function NotifyView(props: { notify: NotifyType }) {
  const { notify } = props;
  return <>{notify}</>;
}

export function NotifyList(props: { notifyList: NotifyType[] }) {
  const { notifyList } = props;
  const theme = useTheme();
  const [selectedNotify, setSelectedNotify] = useState<NotifyType>(
    notifyList[0],
  );
  const [open, setOpen] = useState<boolean>(false);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo<ColumnDef<NotifyType>[]>(
    () => [
      {
        id: "No.",
        header: "번호",
        size: 50,
        accessorKey: "id",
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
        header: "작성자",
        accessorKey: "name",
        cell: ({ row }) => (
          <span onClick={() => setSelectedNotify(row.getValue("id"))}>
            {row.getValue("name")}
          </span>
        ),
      },
      {
        id: "insertDateTime",
        header: "작성일자",
        accessorKey: "insertDateTime",
        enableSorting: true,
        cell: ({ row }) => (
          <span>{iso8601ToYYMMDDHHMM(row.getValue("insertDateTime"))}</span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable<NotifyType>({
    data: notifyList,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
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
    } else {
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
              `}
              value={safeGetColumn("level")?.getFilterValue() as string}
              onChange={(e) =>
                table
                  .getColumn("level")
                  ?.setFilterValue(e.target.value || undefined)
              }
            >
              <option value="">전체 부서</option>
              {levelList.map((value) => (
                <option key={value} value={value}>
                  {levelLabelMap[value as levelType]}
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
          <WriteButton
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
          close={() => setOpen(false)}
          children={<NotifyView notify={selectedNotify} />}
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

const WriteButton = styled(FuncItem)<{ theme: Theme }>(
  ({ theme }) => css`
    font-family: ${theme.mode.font.button.default};
  `,
);

const TableContainer = styled.table`
  border-spacing: 0;
  width: 100%;

  thead {
    border: none;
  }
`;
