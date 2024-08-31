/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * API
 * API docs
 * OpenAPI spec version: 1.0
 */
import type { AcrossDomainDto } from './acrossDomainDto';
import type { BridgeConfigDtoBanner } from './bridgeConfigDtoBanner';
import type { CctpDomainDto } from './cctpDomainDto';
import type { ChainDto } from './chainDto';
import type { DeploymentDto } from './deploymentDto';
import type { HighlightedTokens } from './highlightedTokens';
import type { HyperlaneMailboxDto } from './hyperlaneMailboxDto';
import type { LzDomainDto } from './lzDomainDto';

export interface BridgeConfigDto {
  acrossDomains: AcrossDomainDto[];
  /** @nullable */
  banner: BridgeConfigDtoBanner;
  cctpDomains: CctpDomainDto[];
  chains: ChainDto[];
  deployments: DeploymentDto[];
  highlightedTokens: HighlightedTokens[];
  hyperlaneMailboxes: HyperlaneMailboxDto[];
  initialFromChainId: number;
  initialToChainId: number;
  lzDomains: LzDomainDto[];
}
