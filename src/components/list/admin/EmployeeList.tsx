/** @jsxImportSource @emotion/react */
import {
  createEmployee,
  deleteEmployee,
  getAllEmployeeList,
  getEmployeeByNameThroughList,
  updateEmployee,
} from "@/api/employee";
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
} from "@/components/Table";
import {
  EmployeeInfoType,
  EmployeeType,
  levelLabelMap,
  levelList,
  LevelType,
  siteWalletType,
} from "@/model/employee";
import { useQuery } from "@tanstack/react-query";
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
import React, { useMemo, useState } from "react";
import { css, Theme, useTheme } from "@emotion/react";
import { HorizontalDivider, TableSearchBar } from "@/components/layouts";
import { useWindowContext } from "@/context/WindowContext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { iso8601ToYYMMDDHHMM } from "@/components/styled/Date/DateFomatter";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { ChainType } from "@/model/financial";
import CancelIcon from "@mui/icons-material/Cancel";
import { PlusButton } from "@/components/styled/Button";
import styled from "@emotion/styled";
import { CustomModal } from "@/components/Modal";
import { ConfirmAlert, ErrorAlert, SuccessAlert } from "@/components/Alert";

export function EmployeeList(props: { employee: EmployeeInfoType }) {
  const { employee } = props;

  const { windowWidth } = useWindowContext();

  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false);
  const [updateOpen, setUpdateOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(
    null,
  );

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "insertDateTime", desc: true },
  ]);

  const [searchName, setSearchName] = useState<string>("");
  const [searchEmployee, setSearchEmployee] = useState<EmployeeType[]>([]);

  const employeeSearch = () => {
    getEmployeeByNameThroughList(searchName).then((response) =>
      setSearchEmployee(response),
    );
  };

  const { data, refetch } = useQuery({
    queryKey: ["employee"],
    queryFn: () =>
      getAllEmployeeList(employee!.level, employee!.site, pageIndex, pageSize),
    refetchInterval: 1800000,
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
        id: "level",
        header: "직급",
        accessorKey: "level",
        size: 50,
      },
      {
        id: "name",
        header: "이름",
        accessorKey: "name",
        size: 50,
      },
      {
        id: "insertDateTime",
        header: "가입일자",
        accessorKey: "insertDateTime",
        enableSorting: true,
        cell: ({ row }) => (
          <span>{iso8601ToYYMMDDHHMM(row.getValue("insertDateTime"))}</span>
        ),
      },
      {
        id: "updateDateTime",
        header: "수정일자",
        accessorKey: "updateDateTime",
        enableSorting: true,
        cell: ({ row }) => (
          <span>
            {row.getValue("updateDateTime")
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
            <EditIcon
              fontSize="small"
              onClick={() => {
                setUpdateOpen(true);
                setSelectedEmployee(row.original);
              }}
            />
            {(employee.level === "ADMINISTRATOR" ||
              employee.level === "MANAGER") && (
              <DeleteIcon
                onClick={() =>
                  ConfirmAlert("정말 삭제하시겠습니까?", () =>
                    deleteEmployee(row.original.id)
                      .then(() => {
                        refetch();
                        SuccessAlert("삭제성공");
                      })
                      .catch((e) => ErrorAlert(e.message)),
                  )
                }
                fontSize="small"
              />
            )}
          </TableFunctionLine>
        ),
      },
    ],
    [employee.level, refetch],
  );

  const tableRowHandle = () => {
    if (searchName.length !== 0) {
      return searchEmployee;
    } else if (employeeList) {
      return employeeList;
    } else {
      return [];
    }
  };

  const table = useReactTable<EmployeeType>({
    data: tableRowHandle(),
    columns,
    pageCount: data?.totalPages ?? 0,
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
              value={searchName}
              placeholder="이름 검색"
              onChange={(e) => setSearchName(e.target.value)}
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
              func={employeeSearch}
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
                setSearchName("");
                setSearchEmployee([]);
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
            <TableHeaderFuncButton
              label="추가"
              func={() => setOpen(true)}
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
      <CustomModal open={open} close={() => setOpen(false)}>
        <EmployeeAddModal
          employee={employee}
          refetch={refetch}
          close={() => setOpen(false)}
        />
      </CustomModal>
      {selectedEmployee && (
        <CustomModal open={updateOpen} close={() => setUpdateOpen(false)}>
          <EmployeeUpdateModal
            employeeObject={selectedEmployee}
            refetch={refetch}
            close={() => setUpdateOpen(false)}
          />
        </CustomModal>
      )}
    </>
  );
}

function EmployeeUpdateModal(props: {
  employeeObject: EmployeeType;
  refetch: () => void;
  close: () => void;
}) {
  const { employeeObject, refetch, close } = props;
  const theme = useTheme();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [level, setLevel] = useState<LevelType>("STAFF");

  const submit = () => {
    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (password !== passwordConfirm) {
      return ErrorAlert("패스워드 변경 미희망 시 비워두세요.");
    } else if (name.length < 6) {
      return ErrorAlert("아이디는 6자 이상이어야합니다.");
    } else {
      updateEmployee({
        id: employeeObject.id,
        department: "ACCOUNTING",
        level,
        name,
        password,
      })
        .then(() => {
          refetch();
          SuccessAlert("변경 성공");
          close();
        })
        .catch((e) => ErrorAlert(e.message));
    }
  };

  return (
    <div
      css={css`
        width: 500px;
        background-color: ${theme.mode.textRevers};
        border-radius: ${theme.borderRadius.softBox};
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          padding: 0 4px;
          height: 40px;

          span {
            width: 50px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            text-wrap: nowrap;
          }
        `}
      >
        <span className="cursor-pointer" onClick={close}>
          취소
        </span>
        <span
          className="cursor-pointer"
          css={css`
            font-weight: 500 !important;
          `}
        >
          정보 변경
        </span>
        <span className="cursor-pointer" onClick={submit}>
          추가
        </span>
      </div>
      <HorizontalDivider width={100} />

      <div
        css={css`
          width: 100%;

          display: flex;
          flex-direction: column;
          padding: 10px;
          gap: 8px;

          overflow-y: scroll;
          box-sizing: border-box;
        `}
      >
        <span className="text-center">- 직원정보 -</span>
        <Input
          variant="underlined"
          defaultValue={employeeObject.name}
          placeholder="아이디를 입력하세요."
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          variant="underlined"
          type="password"
          placeholder="패스워드를 입력하세요."
          isInvalid={passwordConfirm !== password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          variant="underlined"
          type="password"
          placeholder="패스워드를 한번 더 입력하세요."
          isInvalid={passwordConfirm !== password}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <Select
          variant="underlined"
          defaultSelectedKeys={[employeeObject.level]}
          selectedKeys={new Set([level])}
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0] as LevelType | undefined;
            if (val) {
              setLevel(val);
            }
          }}
          css={css`
            span {
              color: ${theme.mode.textPrimary};
            }
          `}
        >
          {levelList.slice(0, 3).map((level) => (
            <SelectItem key={level}>
              {levelLabelMap[level as LevelType]}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}

function EmployeeAddModal(props: {
  employee: EmployeeInfoType;
  refetch: () => void;
  close: () => void;
}) {
  const { employee, refetch, close } = props;
  const theme = useTheme();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [level, setLevel] = useState<LevelType>("STAFF");
  const [site, setSite] = useState<string>("");

  const makeId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10);

  const [siteWalletList, setSiteWalletList] = useState<siteWalletType[]>([
    {
      id: makeId(),
      cryptoWallet: "",
      chainType: "TRON",
    },
  ]);

  const addWalletRow = () =>
    setSiteWalletList((prev) => [
      ...prev,
      { id: makeId(), cryptoWallet: "", chainType: "TRON" },
    ]);

  const removeWalletRow = (id: string) =>
    setSiteWalletList((prev) => prev.filter((r) => r.id !== id));

  const submit = () => {
    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (password !== passwordConfirm) {
      return ErrorAlert("패스워드를 확인해주세요.");
    } else if (name.length < 6) {
      return ErrorAlert("아이디는 6자 이상이어야합니다.");
    } else if (site.length < 2) {
      return ErrorAlert("사이트를 확인해주세요.");
    } else if (siteWalletList.length < 1) {
      return ErrorAlert("사이트의 지갑은 반드시 한개 이상이어야합니다.");
    } else if (
      level === "ADMINISTRATOR" &&
      employee.level !== "ADMINISTRATOR"
    ) {
      return ErrorAlert("관리자 직책은 관리자만 추가할 수 있습니다.");
    } else {
      createEmployee({
        name,
        password,
        department: "ACCOUNTING",
        level,
        site,
        siteWalletList: siteWalletList.map((wallet) => ({
          cryptoWallet: wallet.cryptoWallet,
          chainType: wallet.chainType,
        })),
      })
        .then(() => {
          refetch();
          SuccessAlert("추가 성공");
          close();
        })
        .catch((e) => ErrorAlert(e.message));
    }
  };

  return (
    <div
      css={css`
        width: 500px;
        background-color: ${theme.mode.textRevers};
        border-radius: ${theme.borderRadius.softBox};
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          padding: 0 4px;
          height: 40px;

          span {
            width: 50px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            text-wrap: nowrap;
          }
        `}
      >
        <span className="cursor-pointer" onClick={close}>
          취소
        </span>
        <span
          className="cursor-pointer"
          css={css`
            font-weight: 500 !important;
          `}
        >
          직원 추가
        </span>
        <span className="cursor-pointer" onClick={submit}>
          추가
        </span>
      </div>
      <HorizontalDivider width={100} />

      <div
        css={css`
          width: 100%;

          display: flex;
          flex-direction: column;
          padding: 10px;
          gap: 8px;

          height: 400px;
          overflow-y: scroll;
          box-sizing: border-box;
        `}
      >
        <span className="text-center">- 직원정보 -</span>
        <Input
          variant="underlined"
          placeholder="아이디를 입력하세요."
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          variant="underlined"
          type="password"
          placeholder="패스워드를 입력하세요."
          isInvalid={passwordConfirm !== password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          variant="underlined"
          type="password"
          placeholder="패스워드를 한번 더 입력하세요."
          isInvalid={passwordConfirm !== password}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <Select
          variant="underlined"
          defaultSelectedKeys={[level]}
          selectedKeys={new Set([level])}
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0] as LevelType | undefined;
            if (val) {
              setLevel(val);
            }
          }}
          css={css`
            span {
              color: ${theme.mode.textPrimary};
            }
          `}
        >
          {levelList.map((level) => (
            <SelectItem key={level}>
              {levelLabelMap[level as LevelType]}
            </SelectItem>
          ))}
        </Select>
        <span className="text-center m-4">- 사이트 정보 -</span>
        <Input
          variant="underlined"
          placeholder="사이트를 입력하세요."
          onChange={(e) => setSite(e.target.value)}
        />
        {siteWalletList.map((siteWallet) => (
          <React.Fragment key={siteWallet.id}>
            <SiteWalletAddArea
              siteWallet={siteWallet}
              onChange={(next) =>
                setSiteWalletList((prev) =>
                  prev.map((r) => (r.id === siteWallet.id ? next : r)),
                )
              }
              onRemove={() => removeWalletRow(siteWallet.id)}
            />
          </React.Fragment>
        ))}
        <StyledPlusButton theme={theme} func={addWalletRow} />
      </div>
    </div>
  );
}

function SiteWalletAddArea(props: {
  siteWallet: siteWalletType;
  onChange: (_next: siteWalletType) => void;
  onRemove: () => void;
}) {
  const { siteWallet, onChange, onRemove } = props;

  const theme = useTheme();

  return (
    <>
      <div
        css={css`
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <Input
          className="w-[65%]"
          variant="underlined"
          placeholder="지갑주소를 입력하세요."
          value={siteWallet.cryptoWallet}
          onChange={(e) =>
            onChange({ ...siteWallet, cryptoWallet: e.target.value })
          }
        />
        <Select
          className="w-[25%]"
          variant="bordered"
          selectedKeys={new Set([siteWallet.chainType])}
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0] as ChainType | undefined;
            if (val) onChange({ ...siteWallet, chainType: val });
          }}
          css={css`
            span {
              color: ${theme.mode.textPrimary};
            }
          `}
        >
          {["TRON", "ETH", "BTC"].map((value) => (
            <SelectItem key={value}>{value}</SelectItem>
          ))}
        </Select>
        <CancelIcon fontSize="medium" onClick={onRemove} />
      </div>
    </>
  );
}

const StyledPlusButton = styled(PlusButton)<{ theme: Theme }>(
  ({ theme }) => css`
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    circle {
      fill: ${theme.mode.textAccent} !important;
    }
  `,
);
