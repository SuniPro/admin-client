import { flexRender, Table } from "@tanstack/react-table";
import { useRef } from "react";
import styled from "@emotion/styled";
import { css, Theme, useTheme } from "@emotion/react";
import { uid } from "uid";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { FuncIconItem, FuncItem } from "../styled/Button";
import { useHorizontalScroll } from "../../hooks/useWheel";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Container } from "@/components/layouts/Frames";

export function generateNumberArray(upTo: number): number[] {
  if (upTo < 1) {
    throw new Error("Input must be greater than or equal to 1.");
  }
  return Array.from({ length: upTo }, (_, index) => index + 1);
}

export function TableHeader(props: {
  // eslint-disable-next-line
  table: any;
  // eslint-disable-next-line
  columnResizeMode: any;
  headerBorder?: string;
}) {
  const { table, columnResizeMode, headerBorder } = props;

  return (
    <thead>
      {/*eslint-disable-next-line*/}
      {table.getHeaderGroups().map((headerGroup: any) => (
        <TableHeaderTr border={headerBorder} key={uid()}>
          {/*eslint-disable-next-line*/}
          {headerGroup.headers.map((header: any) => (
            <TableHeaderTh
              key={header.id}
              {...{
                colSpan: header.colSpan,
                onClick: header.column.getToggleSortingHandler(),
                style: {
                  position: "relative",
                  cursor: "pointer",
                  width: header.getSize(),
                },
              }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
              <div
                {...{
                  onMouseDown: header.getResizeHandler(),
                  onTouchStart: header.getResizeHandler(),
                  className: `resizer ${
                    header.column.getIsResizing() ? "isResizing" : ""
                  }`,
                  style: {
                    transform:
                      columnResizeMode === "onEnd" &&
                      header.column.getIsResizing()
                        ? `translateX(${
                            table.getState().columnSizingInfo.deltaOffset
                          }px)`
                        : "",
                  },
                }}
              />
            </TableHeaderTh>
          ))}
        </TableHeaderTr>
      ))}
    </thead>
  );
}

export function TableBody(props: {
  className?: string;
  //eslint-disable-next-line
  table: any;
  fontSize?: string;
}) {
  const { className, table, fontSize } = props;

  return (
    <tbody className={className}>
      {/*eslint-disable-next-line*/}
      {table.getRowModel().rows.map((row: any) => (
        <TableBodyTr key={row.id}>
          {/*eslint-disable-next-line*/}
          {row.getVisibleCells().map((cell: any) => {
            const originalId = cell.id; // 예시로 주어진 문자열
            const modifiedId = originalId.replace(/^[0-9]+_/, ""); // 숫자로 시작하는 모든 접두사를 제거한 문자열
            return (
              <td
                key={`${row.id}-${cell.id}`}
                id={modifiedId}
                {...{
                  style: {
                    width: cell.column.getSize(),
                    fontSize: fontSize,
                  },
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            );
          })}
        </TableBodyTr>
      ))}
    </tbody>
  );
}

export function Pagination(props: {
  // eslint-disable-next-line
  table: Table<any>;
  viewSizeBox?: boolean;
}) {
  const { table, viewSizeBox = false } = props;
  const theme = useTheme();
  const pageListAreaRef = useRef<HTMLDivElement>(null);
  useHorizontalScroll(pageListAreaRef);

  return (
    <PageNationWrapper theme={theme}>
      <PageNationContainer>
        <PaginationButtonCase className="not-drag">
          <PaginationButton
            func={() => table.firstPage()}
            isActive={table.getCanPreviousPage()}
            inActiveBackgroundColor={theme.mode.cardBackground}
            activeBackgroundColor={theme.mode.cardBackground}
            icon={<KeyboardDoubleArrowLeftIcon />}
            label={undefined}
            theme={theme}
          />
          <PaginationButton
            func={() => table.previousPage()}
            isActive={table.getCanPreviousPage()}
            inActiveBackgroundColor={theme.mode.cardBackground}
            activeBackgroundColor={theme.mode.cardBackground}
            icon={<KeyboardArrowLeftIcon />}
            label={undefined}
            theme={theme}
          />
        </PaginationButtonCase>
        <PaginationListWrapper>
          <PageListArea
            ref={pageListAreaRef}
            pageLength={
              generateNumberArray(
                table.getPageCount() === 0 ? 1 : table.getPageCount(),
              ).length + 1
            }
          >
            {generateNumberArray(
              table.getPageCount() === 0 ? 1 : table.getPageCount(),
            ).map((index) => (
              <PageList
                key={index}
                onClick={() => {
                  table.setPageIndex(index - 1);
                }}
                isActive={table.getState().pagination.pageIndex === index - 1}
                className="not-drag"
                theme={theme}
              >
                <span>{index}</span>
              </PageList>
            ))}
          </PageListArea>
        </PaginationListWrapper>
        <PaginationButtonCase className="not-drag">
          <PaginationButton
            func={() => {
              if (table.getCanNextPage()) {
                table.nextPage();
              }
            }}
            isActive={table.getCanNextPage()}
            inActiveBackgroundColor={theme.mode.cardBackground}
            activeBackgroundColor={theme.mode.cardBackground}
            icon={<KeyboardArrowRightIcon />}
            theme={theme}
            label={undefined}
          />
          <PaginationButton
            func={() => table.lastPage()}
            isActive={table.getCanNextPage()}
            inActiveBackgroundColor={theme.mode.cardBackground}
            activeBackgroundColor={theme.mode.cardBackground}
            icon={<KeyboardDoubleArrowRightIcon />}
            theme={theme}
            label={undefined}
          />
        </PaginationButtonCase>
      </PageNationContainer>
      {viewSizeBox && (
        <PageViewSelector
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          theme={theme}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </PageViewSelector>
      )}
    </PageNationWrapper>
  );
}

const TableHeaderTr = styled.tr<{ border?: string }>(
  ({ border }) => css`
    td,
    th {
      border-bottom: ${border}; /* 하단에 border 추가 */
      padding-bottom: 12px;
    }
  `,
);

const TableHeaderTh = styled.th`
  padding: 8px 0 9px 0;
  height: 14px;
`;

const TableBodyTr = styled.tr`
  font-size: 16px;
  font-family: Roboto, sans-serif;
  text-align: center;

  td {
    max-width: 800px;
    height: 34px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const PageNationWrapper = styled.section<{ theme: Theme }>(
  ({ theme }) => css`
    margin-top: 1rem;
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    justify-content: flex-end;
    position: relative;

    font-family: ${theme.mode.font.table.pagination};
  `,
);

export const PageNationContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  justify-content: space-around;
  width: 40%;
`;

export const PaginationButtonCase = styled.div`
  width: 10%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
`;

export const PageList = styled.li<{ isActive: boolean; theme: Theme }>(
  ({ isActive, theme }) => css`
    cursor: pointer;
    color: ${isActive ? theme.mode.textAccent : theme.mode.textPrimary};

    font-weight: ${isActive ? "bold" : "normal"};
    padding: 2px;
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
);

export const PageListArea = styled.div<{ pageLength: number }>(
  ({ pageLength }) => css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: ${pageLength > 20 ? 20 * 12 : pageLength * 18}px;
    height: 100%;
    overflow-x: scroll;
  `,
);

export const PageViewSelector = styled.select<{ theme: Theme }>(
  ({ theme }) => css`
    border: 2px solid ${theme.mode.textAccent};
    background-color: rgba(0, 0, 0, 0);
    padding-left: 8px;
    color: ${theme.mode.textPrimary};
    width: 60px;
    height: 30px;
    border-radius: 10px;
    font-family: ${theme.mode.font.table.pagination};
    transform: translateX(-50%);
  `,
);

const PaginationButton = styled(FuncIconItem)<{ theme: Theme }>(
  ({ theme }) => css`
    padding: 4px 10px;

    svg {
      fill: ${theme.mode.textPrimary};
    }
  `,
);

const PaginationListWrapper = styled.div``;

export const StyledContainer = styled(Container)<{ theme: Theme }>(
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

export const TableWrapper = styled.section<{ theme: Theme; width: number }>(
  ({ width }) => css`
    width: ${width}px;
    overflow-x: scroll;

    font-size: clamp(12px, 1.2cqi, 14px);

    tr {
      white-space: nowrap;
    }

    td {
      white-space: nowrap;
    }

    tr {
      font-size: clamp(12px, 1.2cqi, 14px);
    }
    tbody {
      td {
        font-size: clamp(12px, 1.2cqi, 14px);
      }
    }
  }
  `,
);

export const TableContainer = styled.table`
  width: 100%;
  border-spacing: 0;

  thead {
    border: none;
  }
`;

export const HeaderLine = styled.div<{ theme: Theme }>(
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

export const TableHeaderFuncButton = styled(FuncItem)<{ theme: Theme }>(
  ({ theme }) => css`
    cursor: pointer;
    font-family: ${theme.mode.font.button.default};
    color: ${theme.mode.textPrimary};

    &:hover {
      color: ${theme.mode.textPrimary};
    }
  `,
);

export const TableFunctionLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;
