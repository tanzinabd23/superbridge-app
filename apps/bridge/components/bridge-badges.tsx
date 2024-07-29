import { isPresent } from "ts-is-present";

import { DeploymentType } from "@/codegen/model";
import { isSuperbridge } from "@/config/app";
import { useDeployment } from "@/hooks/use-deployment";
import { useDeployments } from "@/hooks/use-deployments";
import { useInjectedStore } from "@/state/injected";

import { PoweredByConduit } from "./badges/powered-by-conduit-badge";
import { TestnetBadge } from "./badges/testnet-badge";

export const BridgeBadges = () => {
  const deployment = useDeployment();
  const deployments = useDeployments();
  const superbridgeTestnets = useInjectedStore((s) => s.testnets);

  const testnetBadge =
    (isSuperbridge && superbridgeTestnets) ||
    (!isSuperbridge && deployments[0].type === DeploymentType.testnet) ? (
      <TestnetBadge />
    ) : null;

  const poweredByConduit =
    deployment?.provider === "conduit" && !isSuperbridge ? (
      <PoweredByConduit />
    ) : null;

  const poweredByAltLayer =
    deployment?.provider === "alt-layer" && !isSuperbridge ? (
      <PoweredByConduit />
    ) : null;

  const badges = [testnetBadge, poweredByConduit, poweredByAltLayer].filter(
    isPresent
  );

  if (!badges.length) {
    return null;
  }
  return (
    <div className="flex gap-2 py-1 justify-center items-center -translate-y-2">
      {badges}
    </div>
  );
};