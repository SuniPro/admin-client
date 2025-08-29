/** @jsxImportSource @emotion/react */
import { StatisticsCard } from "@/components/Card/Card";
import { iso8601ToYYMMDDHHMM } from "@/components/styled/Date/DateFomatter";
import { NewMorphismSearchBar } from "@/components/styled/input/NewMorphismSearchBar";
import { css, useTheme } from "@emotion/react";
import { DateTime } from "luxon";
import { RefObject, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSite } from "@/api/site";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ErrorAlert, SuccessAlert } from "@/components/Alert";
import { Chain, detectChain } from "@/hooks/useDetectChain";
import {
  getAccountSummaryInfoBySite,
  getTransferList,
  updateCryptoWallet,
} from "@/api/financial";
import { NormalizedTransfer } from "@/model/financial";
import { EmployeeInfoType } from "@/model/employee";
import { CryptoTransferList } from "@/components/list/financial/CryptoTransferList";
import { formatUnits } from "@/utils/bigNumberConvert";
import { FuncItem } from "@/components/styled/Button";
import { Input } from "@heroui/input";

export const inputCopy = (ref: RefObject<HTMLInputElement | null>) => {
  if (!ref.current) return;
  const wallet = ref.current;
  navigator.clipboard
    .writeText(wallet.value)
    .then(() => {
      SuccessAlert("복사 성공");
    })
    .catch(() => {
      ErrorAlert("복사 실패");
    });
};

export function Site(props: { employee: EmployeeInfoType }) {
  const { employee } = props;
  const [search, setSearch] = useState<string>("");
  const [transferList, setTransferList] = useState<NormalizedTransfer[]>([]);

  const [walletChange, setWalletChange] = useState<boolean>(false);
  const [newWallet, setNewWallet] = useState<string>("");

  const theme = useTheme();
  const now = DateTime.now().setZone("Asia/Seoul").toISO();

  const { data: siteInfo, refetch } = useQuery({
    queryKey: ["getSite"],
    queryFn: () => getSite(employee!.site),
    enabled: Boolean(employee),
  });

  const { data: summaryInfo } = useQuery({
    queryKey: ["getDepositByAddressAndRangeAndSite"],
    queryFn: () =>
      getAccountSummaryInfoBySite(
        siteInfo!.chainType,
        siteInfo!.cryptoWallet,
        siteInfo!.site,
      ),
    refetchInterval: 1800000,
    enabled: Boolean(siteInfo),
  });

  const walletRef = useRef<HTMLInputElement>(null);

  const didInit = useRef(false);

  useEffect(() => {
    if (!siteInfo || didInit.current || !searchInputRef.current) return;

    const cacheKey = `transferList:${siteInfo.cryptoWallet}`;

    // 1. 캐시가 있으면 사용
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setTransferList(JSON.parse(cached));
      setSearch(siteInfo.cryptoWallet);
      didInit.current = true;
      searchInputRef.current.value = siteInfo.cryptoWallet;
      return;
    }

    // 2. 캐시 없으면 요청
    getTransferList(siteInfo.cryptoWallet, siteInfo.chainType as Chain)
      .then((r) => {
        setTransferList(r);
        setSearch(siteInfo.cryptoWallet);
        sessionStorage.setItem(cacheKey, JSON.stringify(r)); // ✅ 캐시 저장
        if (searchInputRef.current) {
          searchInputRef.current.value = siteInfo.cryptoWallet;
        }
        didInit.current = true;
      })
      .catch(() => ErrorAlert("지갑 거래내역 조회 실패"));
  }, [siteInfo]);

  const handleSubmit = async (searchValue: string) => {
    if (!searchValue) return;

    // 1) 체인 검증
    const detected = await detectChain(searchValue);
    if (!detected) {
      ErrorAlert("올바른 지갑주소를 입력해주세요.");
    }

    if (siteInfo) {
      getTransferList(searchValue, detected).then((r) => {
        setTransferList(r);
      });
    }
  };

  const decimal = () => {
    if (!siteInfo) return;
    switch (siteInfo.chainType) {
      case "BTC":
        return 1e8;
      case "ETH":
        return 1e18;
      case "TRON":
        return 6;
    }
  };

  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <NewMorphismSearchBar
        searchInputRef={searchInputRef}
        searchState={{ search, setSearch }}
        submitChain={handleSubmit}
      />
      {siteInfo && (
        <div
          css={css`
            display: flex;
            padding: 16px;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            height: auto;
            border: 1px solid ${theme.mode.borderSecondary};
            border-radius: ${theme.borderRadius.softBox};
            background: ${theme.mode.cardBackground};
            box-sizing: border-box;

            font-family: ${theme.mode.font.component.mainTitle};
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 10px;
            `}
          >
            <div
              css={css`
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
              `}
            >
              <span>지갑주소 : </span>
              {walletChange ? (
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
                    value={newWallet}
                    onChange={(e) => setNewWallet(e.target.value)}
                    css={css`
                      width: 300px;
                    `}
                  />
                  <FuncItem
                    label="변경"
                    func={() => updateCryptoWallet(newWallet).then(refetch)}
                    css={css`
                      background-color: ${theme.colors.ashGray};
                      color: white;
                      font-size: 14px;
                      height: 32px;
                    `}
                  />
                </div>
              ) : (
                <input
                  readOnly={true}
                  value={siteInfo.cryptoWallet}
                  size={Math.max(1, siteInfo.cryptoWallet.length + 4)}
                  ref={walletRef}
                />
              )}
            </div>
            <div
              css={css`
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 6px;

                svg {
                  fill: #5e5e5e !important;
                }
              `}
            >
              <EditIcon
                fontSize="small"
                onClick={() => setWalletChange((prev) => !prev)}
              />
              <ContentCopyIcon
                onClick={() => inputCopy(walletRef)}
                fontSize="small"
              />
            </div>
          </div>

          <div
            css={css`
              display: flex;
              flex-direction: row;
              gap: 10px;
            `}
          >
            <span>사이트 : {siteInfo.site.toUpperCase()}</span>
            <span>
              가입일자 : {iso8601ToYYMMDDHHMM(siteInfo.insertDateTime)}
            </span>
          </div>
        </div>
      )}

      {siteInfo && summaryInfo && (
        <div
          css={css`
            display: grid;
            width: 100%;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-gap: 0.75rem;
          `}
        >
          <StatisticsCard
            title="지갑 잔액"
            statistics={formatUnits(summaryInfo.balance, decimal()!)}
            unit="USDT"
            description={`${iso8601ToYYMMDDHHMM(now!)} 부 최신화된 결과입니다.`}
            postscript="USDT는 TRONSCAN 기준입니다."
          />
          <StatisticsCard
            title="입금 거래 내역"
            statistics={summaryInfo.depositHistoryLength.toString()}
            description="Icoins의 모든 입금내역이 포함됩니다."
            postscript="Icoins 이외의 내역은 아래의 테이블을 확인해주세요."
          />
          <StatisticsCard
            title="금일 입금 금액"
            statistics={parseInt(summaryInfo.todayDepositAmount).toLocaleString(
              "ko-KR",
            )}
            unit="원"
            description={`${iso8601ToYYMMDDHHMM(now!)} 부 최신화된 결과입니다.`}
            postscript="Icoins를 통한 입금내역입니다."
          />
          <StatisticsCard
            title="최근 입금 금액"
            statistics={parseInt(summaryInfo.weeksDepositAmount).toLocaleString(
              "ko-KR",
            )}
            unit="원"
            description="금일자로 일주일 기준입니다."
            postscript="Icoins를 통한 입금내역입니다."
          />
        </div>
      )}
      <CryptoTransferList transferList={transferList} />
    </>
  );
}
