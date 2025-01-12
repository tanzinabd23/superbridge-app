import { useMemo } from "react";
import { Address } from "viem";
import { useReadContract } from "wagmi";

import { OptimismPortalAbi } from "@/abis/OptimismPortal";
import { SupportCheckStatus } from "@/components/status/types";
import { OptimismDeploymentDto } from "@/utils/deployments/is-mainnet";

import { useChainsForDeployment } from "../deployments/use-deployment-chains";

export const usePaused = (deployment: OptimismDeploymentDto | undefined) => {
  const chains = useChainsForDeployment(deployment?.id);
  const paused = useReadContract({
    chainId: deployment?.l1ChainId,
    functionName: "paused",
    abi: OptimismPortalAbi,
    address: deployment?.contractAddresses.optimismPortal as Address,
    query: {
      enabled: !!deployment,
    },
  });

  return useMemo(() => {
    if (paused.isFetching) {
      return {
        status: SupportCheckStatus.Loading,
        title: `${chains?.l2.name} withdrawals status`,
        description: "Loading",
      };
    }

    if (paused.data) {
      return {
        title: `${chains?.l2.name} withdrawals paused`,
        description: `Withdrawals are unable to be processed in this moment`,
        status: SupportCheckStatus.Warning,
      };
    }

    return {
      title: `${chains?.l2.name} withdrawals enabled`,
      description: `Withdrawals are enabled and processing as normal`,
      status: SupportCheckStatus.Ok,
    };
  }, [paused.isFetching, paused.data]);
};
