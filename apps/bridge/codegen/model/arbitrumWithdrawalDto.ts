/**
 * Generated by orval v6.25.0 🍺
 * Do not edit manually.
 * API
 * API docs
 * OpenAPI spec version: 1.0
 */
import type { DeploymentDto } from './deploymentDto';
import type { ConfirmationDto } from './confirmationDto';
import type { ArbitrumWithdrawalDtoMetadata } from './arbitrumWithdrawalDtoMetadata';
import type { ArbitrumTransactionType } from './arbitrumTransactionType';

export interface ArbitrumWithdrawalDto {
  createdAt: string;
  deployment: DeploymentDto;
  finalise?: ConfirmationDto;
  id: string;
  metadata: ArbitrumWithdrawalDtoMetadata;
  status: number;
  type: ArbitrumTransactionType;
  updatedAt: string;
  withdrawal: ConfirmationDto;
}
