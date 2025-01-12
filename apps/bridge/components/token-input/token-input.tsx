import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Address, formatUnits, isAddressEqual } from "viem";
import { useAccount } from "wagmi";

import { DeploymentFamily } from "@/codegen/model";
import { useArbitrumGasCostsInWei } from "@/hooks/arbitrum/use-arbitrum-gas-costs";
import { useCustomGasTokenAddress } from "@/hooks/custom-gas-token/use-custom-gas-token-address";
import { useDeployment } from "@/hooks/deployments/use-deployment";
import { useActiveTokens } from "@/hooks/tokens";
import { useIsCustomToken } from "@/hooks/tokens/use-is-custom-token";
import { useIsCustomTokenFromList } from "@/hooks/tokens/use-is-custom-token-from-list";
import { useSelectedToken } from "@/hooks/tokens/use-token";
import { useTokenBalance } from "@/hooks/use-balances";
import { useModal } from "@/hooks/use-modal";
import { useSendAmount } from "@/hooks/use-send-amount";
import { useIsArbitrumDeposit } from "@/hooks/use-withdrawing";
import { useConfigState } from "@/state/config";
import { formatDecimals } from "@/utils/format-decimals";
import { isEth } from "@/utils/tokens/is-eth";

import { IconAlert, IconCaretDown } from "../icons";
import { TokenIcon } from "../token-icon";
import { Skeleton } from "../ui/skeleton";
import { Recipient } from "./recipient";

export const TokenInput = () => {
  const { t } = useTranslation();
  const account = useAccount();
  const token = useSelectedToken();
  const tokens = useActiveTokens();
  const amount = useSendAmount();
  const tokenSelectorModal = useModal("TokenSelector");
  const tokenBalance = useTokenBalance(token);
  const isCustomToken = useIsCustomToken(token);
  const isCustomTokenFromList = useIsCustomTokenFromList(token);
  const arbitrumNativeTokenGasCosts = useArbitrumGasCostsInWei();
  const isArbitrumDeposit = useIsArbitrumDeposit();
  const gasToken = useCustomGasTokenAddress(useDeployment()?.id);

  const [clickedMax, setClickedMax] = useState(false);

  const rawAmount = useConfigState.useRawAmount();
  const setRawAmount = useConfigState.useSetRawAmount();

  const formattedTokenBalance = formatUnits(
    tokenBalance.data,
    token?.decimals ?? 18
  );

  const isCustomTokenBridgingEnabled =
    useDeployment()?.family === DeploymentFamily.optimism;

  const onSetMax = () => {
    setClickedMax(true);

    if (
      isArbitrumDeposit &&
      !!token?.address &&
      !!gasToken &&
      isAddressEqual(token?.address as Address, gasToken)
    ) {
      setRawAmount(
        formatUnits(
          tokenBalance.data - arbitrumNativeTokenGasCosts.extraAmount,
          token.decimals
        )
      );
    } else {
      setRawAmount(formattedTokenBalance);
    }
  };

  useEffect(() => {
    if (
      clickedMax &&
      isArbitrumDeposit &&
      !!token?.address &&
      !!gasToken &&
      isAddressEqual(token?.address as Address, gasToken)
    ) {
      setRawAmount(
        formatUnits(
          tokenBalance.data - arbitrumNativeTokenGasCosts.extraAmount,
          token.decimals
        )
      );
    }
  }, [
    isArbitrumDeposit,
    clickedMax,
    arbitrumNativeTokenGasCosts.extraAmount,
    gasToken,
    token?.address,
    tokenBalance.data,
  ]);

  return (
    <div
      className={`flex flex-col gap-2.5 relative rounded-2xl px-4 py-5 border border-transparent focus-within:border-border transition-colors bg-muted `}
    >
      <div className="flex gap-2 items-center">
        <input
          value={rawAmount}
          onChange={(e) => {
            const parsed = e.target.value.replaceAll(",", ".");
            setRawAmount(parsed);
            setClickedMax(false);
          }}
          type="text"
          inputMode="decimal"
          minLength={1}
          maxLength={79}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          pattern="^[0-9]*[.,]?[0-9]*$"
          name="amount"
          id="amount"
          className={`block w-full shadow-none bg-transparent focus:outline-none text-4xl leading-none placeholder:text-muted-foreground text-foreground`}
          placeholder="0"
        />

        {tokens.isFetching || !token ? (
          <div
            className={`flex shrink-0 relative gap-1 rounded-full py-2 pl-3 pr-3 items-center font-button transition-all text-foreground bg-card`}
          >
            <Skeleton className="h-[25px] w-[25px] rounded-full" />
            <Skeleton className="h-[14px] w-[50px]" />
          </div>
        ) : tokens.data?.length === 1 && !isCustomTokenBridgingEnabled ? (
          <div
            className={`flex shrink-0 relative gap-1 rounded-full py-2 pl-3 pr-4 items-center font-button transition-all text-foreground bg-card`}
          >
            <TokenIcon
              token={token}
              className="h-[20px] w-[20px] shrink-0 !text-[6px]"
            />
            {token?.symbol}
          </div>
        ) : (
          <button
            onClick={() => tokenSelectorModal.open()}
            className={`flex shrink-0 relative gap-1 rounded-full py-2 pl-3 pr-3 items-center font-button transition-all hover:scale-105 text-foreground bg-card`}
          >
            <TokenIcon
              token={token}
              className="h-[20px] w-[20px] shrink-0 !text-[6px]"
            />
            {token?.symbol}
            <IconCaretDown className="w-3.5 h-3.5 fill-foreground" />
            {(isCustomToken || isCustomTokenFromList) && (
              <IconAlert className="absolute top-4 left-6 w-3 h-3" />
            )}
          </button>
        )}
      </div>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {amount.fiat && (
            <span className="text-muted-foreground text-xs leading-none">
              {amount.fiat.formatted}
            </span>
          )}
        </div>

        {account.address && (
          <div className="flex flex-wrap items-start justify-end gap-2">
            {tokenBalance.isLoading ? (
              <Skeleton className="h-4 w-[88px] bg-muted-foreground" />
            ) : (
              <div className="flex items-start gap-2">
                <span
                  className={`text-muted-foreground text-xs text-right leading-none`}
                >
                  {t("availableBalance", {
                    amount: formatDecimals(parseFloat(formattedTokenBalance)),
                    symbol: token?.symbol,
                  })}
                </span>

                {!isEth(token) && (
                  <button
                    onClick={onSetMax}
                    className="h-5 text-[10px] font-button bg-card rounded-full px-2 py-1 -mt-1 leading-none text-muted-foreground transition-all hover:scale-105"
                  >
                    {t("buttons.max")}
                  </button>
                )}
              </div>
            )}
            <div className="-mt-1">
              <Recipient />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
