/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * API
 * API docs
 * OpenAPI spec version: 1.0
 */
import type { HyperlaneRouteRequestDto } from './hyperlaneRouteRequestDto';

export interface RouteRequestDto {
  amount: string;
  forceViaL1: boolean;
  fromChainId: string;
  fromTokenAddress: string;
  graffiti: string;
  hyperlane?: HyperlaneRouteRequestDto;
  hyperlaneFromTokenRouterAddress?: string;
  hyperlaneToTokenRouterAddress?: string;
  lzAdapter?: string;
  opBridgedUsdcAdapter?: string;
  recipient: string;
  sender: string;
  toChainId: string;
  toTokenAddress: string;
}
