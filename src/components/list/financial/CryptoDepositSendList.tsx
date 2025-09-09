/** @jsxImportSource @emotion/react */
import { EmployeeInfoType } from "@/model/employee";
import {
  ChainType,
  CryptoDepositType,
  CryptoType,
  TransactionStatus,
  transactionStatusLabelMap,
  TransactionStatusType,
} from "@/model/financial";
import {
  createNotSentDeposit,
  createSentDeposit,
  deleteDepositById,
  getExchangeInfo,
  getSendDepositsBySite,
  updateSend,
} from "@/api/financial";
import React, { useMemo, useState } from "react";
import { useAlarm } from "@/hooks/useAlarm";
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
import {
  Pagination,
  StyledContainer,
  TableBody,
  TableContainer,
  TableFunctionLine,
  TableHeader,
  TableWrapper,
} from "../../Table";
import { css, useTheme } from "@emotion/react";
import { Spinner } from "../../Empty/Spinner";
import { useWindowContext } from "@/context/WindowContext";
import { BigNumber } from "bignumber.js";
import { EmptyState } from "../EmptyState";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Input, Select, SelectItem, Switch } from "@heroui/react";
import { ConfirmAlert, ErrorAlert, SuccessAlert } from "@/components/Alert";
import { HorizontalDivider, OutLine } from "@/components/layouts";
import { FuncItem } from "@/components/styled/Button";
import { useQuery } from "@tanstack/react-query";
import { PaginationResponse } from "@/model/pagination";
import { CustomModal } from "@/components/Modal";
import { useRefetchDeposits } from "@/hooks/useRefetch";
import DeleteIcon from "@mui/icons-material/Delete";

export function CryptoDepositSendList(props: { employee: EmployeeInfoType }) {
  const { employee } = props;

  const theme = useTheme();
  const { windowWidth } = useWindowContext();

  const [open, setOpen] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);

  const depositsRefetch = useRefetchDeposits([
    ["getDepositsByStatus"],
    ["getDepositByAddressAndRangeAndSite"],
  ]);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "requestedAt", desc: true },
  ]);

  const { data, refetch } = useQuery<PaginationResponse<CryptoDepositType>>({
    queryKey: ["getDepositsByStatus", pageIndex, pageSize],
    queryFn: () =>
      getSendDepositsBySite(false, employee.site, pageIndex, pageSize),
    placeholderData: (previousData) => previousData,
    refetchInterval: 300000,
  });

  const depositList = data?.content;

  useAlarm(Boolean(depositList && depositList.length > 0));

  const columns = useMemo<ColumnDef<CryptoDepositType>[]>(
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
        id: "fromAddress",
        header: "보낸주소",
        accessorKey: "fromAddress",
        size: 100,
      },
      {
        id: "toAddress",
        header: "받은주소",
        accessorKey: "toAddress",
        size: 100,
      },
      {
        id: "realAmount",
        header: "실 전송 금액",
        accessorKey: "realAmount",
        size: 100,
        cell: ({ row }) => {
          const formatted = new BigNumber(row.original.realAmount).toString();
          return (
            <span>
              {formatted} {row.original.cryptoType}
            </span>
          );
        },
      },
      {
        id: "amount",
        header: "요청금액",
        accessorKey: "amount",
        size: 100,
        cell: ({ row }) => {
          const formatted = new BigNumber(row.original.amount).toString();
          return (
            <span>
              {formatted} {row.original.cryptoType}
            </span>
          );
        },
      },
      {
        id: "krwAmount",
        header: "요청금액 (원)",
        accessorKey: "krwAmount",
        size: 100,
        cell: ({ row }) => {
          const krwAmount = new BigNumber(row.original.krwAmount);
          const floored = krwAmount.decimalPlaces(0, BigNumber.ROUND_DOWN); // 소수점 버림

          const formatted = new Intl.NumberFormat("ko-KR").format(
            BigInt(floored.toFixed(0)),
          );
          return <span>{formatted}</span>;
        },
      },
      {
        id: "status",
        header: "상태",
        accessorKey: "status",
        size: 50,
        cell: ({ row }) => (
          <span>
            {
              transactionStatusLabelMap[
                row.getValue("status") as TransactionStatusType
              ]
            }
          </span>
        ),
      },
      {
        id: "isSend",
        header: "송금",
        accessorKey: "isSend",
        size: 50,
        cell: ({ row }) => (
          <Switch
            defaultSelected
            size="sm"
            isSelected={row.getValue("isSend")}
            onChange={() => {
              ConfirmAlert("송금을 완료하셨습니까?", () =>
                updateSend(row.original.id, true).then(() => {
                  refetch().then();
                }),
              );
            }}
          />
        ),
      },
      {
        id: "func",
        header: "삭제",
        size: 50,
        cell: ({ row }) => (
          <TableFunctionLine>
            <DeleteIcon
              onClick={() =>
                ConfirmAlert("정말 삭제하시겠습니까?", () =>
                  deleteDepositById(row.original.id)
                    .then(() =>
                      refetch().then(() => {
                        depositsRefetch();
                        SuccessAlert("삭제성공");
                      }),
                    )
                    .catch((e) => ErrorAlert(e.message)),
                )
              }
              fontSize="small"
            />
          </TableFunctionLine>
        ),
      },
    ],
    [depositsRefetch, refetch],
  );

  const table = useReactTable<CryptoDepositType>({
    data: depositList ?? [],
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

  if (!depositList)
    return (
      <>
        <StyledContainer theme={theme}>
          <Spinner />
        </StyledContainer>
      </>
    );

  return (
    <>
      <OutLine
        css={css`
          align-items: flex-start;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;

            gap: 10px;
          `}
        >
          <FuncItem
            label="송금 미 완료된 입금 생성"
            func={() => {
              setOpen(true);
              setSent(false);
            }}
          />
          <FuncItem
            label="송금 완료된 입금 생성"
            func={() => {
              setOpen(true);
              setSent(true);
            }}
          />
        </div>
      </OutLine>
      {depositList.length === 0 ? (
        <EmptyState
          message="송금하지 않은 입금 건수가 없습니다."
          icon={<CheckCircleIcon color="success" fontSize="large" />}
          title=""
        />
      ) : (
        <StyledContainer theme={theme}>
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
      )}
      <CustomModal open={open} close={() => setOpen(false)}>
        <DepositAddModal
          sent={sent}
          refetch={depositsRefetch}
          close={() => setOpen(false)}
        />
      </CustomModal>
    </>
  );
}

function DepositAddModal(props: {
  sent: boolean;
  refetch: () => void;
  close: () => void;
}) {
  const { sent, close, refetch } = props;
  const theme = useTheme();

  const [cryptoType, setCryptoType] = useState<CryptoType>("USDT");
  const [chainType, setChainType] = useState<ChainType>("TRON");
  const [fromAddress, setFromAddress] = useState<string>("");
  const [toAddress, setToAddress] = useState<string>("");

  const [amount, setAmount] = useState<BigNumber>(new BigNumber(0));
  const [krwAmount, setKrwAmount] = useState<BigNumber>(new BigNumber(0));

  const { data: exchangeInfo } = useQuery({
    queryKey: ["getExchangeInfo", cryptoType],
    queryFn: () => getExchangeInfo(cryptoType),
    refetchInterval: 100000,
  });

  const submit = () => {
    if (!exchangeInfo) return;
    const createDeposit: CryptoDepositType = {
      id: 0,
      status: TransactionStatus[2],
      chainType,
      cryptoType,
      fromAddress,
      toAddress,
      amount: amount.toString(),
      krwAmount: krwAmount.toString(),
      realAmount: amount.toString(),
      accepted: true,
      acceptedAt: new Date().toISOString(),
      requestedAt: new Date().toISOString(),
      isSend: sent,
    };

    if (sent) {
      createSentDeposit(createDeposit)
        .then(() => {
          refetch();
          close();
          SuccessAlert("생성완료");
        })
        .catch((e) => ErrorAlert(e.message));
    } else {
      createNotSentDeposit(createDeposit)
        .then(() => {
          refetch();
          close();
          SuccessAlert("생성완료");
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
          {sent ? "송금" : "미 송금"} 입금
        </span>
        <span className="cursor-pointer" onClick={submit}>
          생성
        </span>
      </div>
      <HorizontalDivider width={100} />

      <div
        css={css`
          width: 100%;

          display: flex;
          flex-direction: column;
          padding: 20px;
          gap: 8px;

          overflow-y: scroll;
          box-sizing: border-box;
        `}
      >
        <Input
          className="w-full"
          variant="underlined"
          label="송신 주소"
          placeholder="보내는 지갑주소를 입력하세요."
          onChange={(e) => setFromAddress(e.target.value)}
        />
        <Input
          className="w-full"
          variant="underlined"
          label="수신 주소"
          placeholder="받는 지갑주소를 입력하세요."
          onChange={(e) => setToAddress(e.target.value)}
        />
        <Input
          className="w-full"
          variant="underlined"
          type="text"
          label="암호화폐"
          placeholder="보낼 암호화페의 개수를 입력하세요."
          onChange={(e) => setAmount(BigNumber(e.target.value))}
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">{cryptoType}</span>
            </div>
          }
        />
        <Input
          className="w-full"
          variant="underlined"
          type="text"
          label="원화"
          onChange={(e) => setKrwAmount(BigNumber(e.target.value))}
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">₩</span>
            </div>
          }
        />
        <Select
          label="네트워크"
          className="w-full"
          aria-labelledby="search-type-label"
          variant="underlined"
          selectedKeys={new Set(["TRON"])}
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0] as ChainType | undefined;
            if (val) {
              setChainType(val);
            }
          }}
          css={css`
            span {
              color: ${theme.mode.textPrimary};
            }
          `}
        >
          {["TRON", "BTC", "ETH"].map((crypto) => (
            <SelectItem key={crypto}>{crypto}</SelectItem>
          ))}
        </Select>
        <Select
          className="w-full"
          aria-labelledby="search-type-label"
          variant="underlined"
          selectedKeys={new Set(["USDT"])}
          label="화폐타입"
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0] as CryptoType | undefined;
            if (val) {
              setCryptoType(val);
            }
          }}
          css={css`
            span {
              color: ${theme.mode.textPrimary};
            }
          `}
        >
          {["USDT", "BTC", "ETH"].map((crypto) => (
            <SelectItem key={crypto}>{crypto}</SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}
