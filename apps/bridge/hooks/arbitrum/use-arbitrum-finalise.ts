import { useState } from "react";
import { Address, Chain } from "viem";
import { useAccount, useWalletClient } from "wagmi";

import { useBridgeControllerGetArbitrumFinaliseTransactionV2 } from "@/codegen";
import { ArbitrumWithdrawalDto } from "@/codegen/model";
import { usePendingTransactions } from "@/state/pending-txs";

import { useDeploymentById } from "../use-deployment-by-id";
import { useSwitchChain } from "../use-switch-chain";

export function useFinaliseArbitrum({
  id,
  deploymentId,
}: ArbitrumWithdrawalDto) {
  const account = useAccount();
  const wallet = useWalletClient();
  const setFinalising = usePendingTransactions.useSetFinalising();
  const removeFinalising = usePendingTransactions.useRemoveFinalising();
  const finaliseTransaction =
    useBridgeControllerGetArbitrumFinaliseTransactionV2();
  const switchChain = useSwitchChain();
  const deployment = useDeploymentById(deploymentId);

  const [loading, setLoading] = useState(false);

  const onFinalise = async () => {
    if (!account.address || !wallet.data || !deployment) {
      return;
    }

    if (account.chainId !== deployment.l1.id) {
      await switchChain(deployment.l1);
    }

    try {
      setLoading(true);

      const data = await finaliseTransaction.mutateAsync({ data: { id } });
      const hash = await wallet.data.sendTransaction({
        to: data.data.to as Address,
        data: data.data.data as Address,
        chain: deployment.l1 as unknown as Chain,
      });
      if (hash) {
        // rainbow just returns null if cancelled
        setFinalising(id, hash);
      }
    } catch (e: any) {
      if (
        e.message.includes("rejected the request") ||
        e.message.includes("denied transaction signature")
      ) {
        // no error
      } else {
        console.log(e);
      }
      removeFinalising(id);
    } finally {
      setLoading(false);
    }
  };

  return {
    onFinalise,
    loading,
  };
}
