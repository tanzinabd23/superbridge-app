/**
 * Generated by orval v6.29.1 🍺
 * Do not edit manually.
 * API
 * API docs
 * OpenAPI spec version: 1.0
 */
import type { DisputeGameDto } from './disputeGameDto';
import type { TransactionStatus } from './transactionStatus';

export interface ProveConfirmationDto {
  blockNumber: number;
  game?: DisputeGameDto;
  status: TransactionStatus;
  timestamp: number;
  transactionHash: string;
}
