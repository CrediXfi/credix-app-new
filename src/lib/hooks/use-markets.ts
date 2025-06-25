// src/lib/hooks/use-markets.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import addresses from "@/chains/addresses.json";
import { UiPoolDataProviderV3Abi } from "@/chains/abis/ts/UiPoolDataProviderV3Abi";
import { CHAIN_ID } from "@/chains/soniclocal";
import { wagmiConfig } from "@/providers/web3-provider";

type AggregatedReserveData = {
  underlyingAsset: string;
  name: string;
  symbol: string;
  decimals: bigint;
  baseLTVasCollateral: bigint;
  reserveLiquidationThreshold: bigint;
  reserveLiquidationBonus: bigint;
  reserveFactor: bigint;
  usageAsCollateralEnabled: boolean;
  borrowingEnabled: boolean;
  stableBorrowRateEnabled: boolean;
  isActive: boolean;
  isFrozen: boolean;
  liquidityIndex: bigint;
  variableBorrowIndex: bigint;
  liquidityRate: bigint;
  variableBorrowRate: bigint;
  stableBorrowRate: bigint;
  lastUpdateTimestamp: bigint;
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
  interestRateStrategyAddress: string;
  availableLiquidity: bigint;
  totalPrincipalStableDebt: bigint;
  averageStableRate: bigint;
  stableDebtLastUpdateTimestamp: bigint;
  totalScaledVariableDebt: bigint;
  priceInMarketReferenceCurrency: bigint; 
  priceOracle: string;
  variableRateSlope1: bigint;
  variableRateSlope2: bigint;
  stableRateSlope1: bigint;
  stableRateSlope2: bigint;
  baseStableBorrowRate: bigint;
  baseVariableBorrowRate: bigint;
  optimalUsageRatio: bigint;
  isPaused: boolean;
  isSiloedBorrowing: boolean;
  accruedToTreasury: bigint;
  unbacked: bigint;
  isolationModeTotalDebt: bigint;
  flashLoanEnabled: boolean;
  debtCeiling: bigint;
  debtCeilingDecimals: bigint;
  eModeCategoryId: number;
  borrowCap: bigint;
  supplyCap: bigint;
  eModeLtv: number;
  eModeLiquidationThreshold: number;
  eModeLiquidationBonus: number;
  eModePriceSource: string;
  eModeLabel: string;
  borrowableInIsolation: boolean;
};

type BaseCurrencyInfo = {
  marketReferenceCurrencyUnit: bigint;
  marketReferenceCurrencyPriceInUsd: bigint;
  networkBaseTokenPriceInUsd: bigint;
  networkBaseTokenPriceDecimals: number;
};

export type Market = {
  underlyingAsset: string;
  symbol: string;
  name: string;
  decimals: number;
  availableLiquidity: number;
  totalPrincipalStableDebt: number;
  totalScaledVariableDebt: number;
  underlyingPrice: number; // USD
  supplyApy: number;
  borrowApy: number;
  isolationMode: boolean;
};

export function useMarkets() {
  return useQuery<Market[], Error>({
    queryKey: ["markets", CHAIN_ID],
    queryFn: async () => {
      const chainAddrs = (addresses as Record<string, any>)[String(CHAIN_ID)];
      if (
        !chainAddrs?.UiPoolDataProviderV3 ||
        !chainAddrs?.PoolAddressesProvider
      ) {
        throw new Error(
          `No address UiPoolDataProviderV3 / PoolAddressesProvider  chainId=${CHAIN_ID}`
        );
      }

      const raw = await readContract(wagmiConfig, {
        address: chainAddrs.UiPoolDataProviderV3 as `0x${string}`,
        abi: UiPoolDataProviderV3Abi,
        functionName: "getReservesData",
        args: [chainAddrs.PoolAddressesProvider as `0x${string}`],
        chainId: CHAIN_ID,
      });
      const [reservesRaw, baseInfo] = raw as unknown as [
        AggregatedReserveData[],
        BaseCurrencyInfo
      ];

      return reservesRaw.map<Market>((r) => {
        const priceRaw = Number(r.priceInMarketReferenceCurrency);
        const decimals = baseInfo.networkBaseTokenPriceDecimals;

        return {
          underlyingAsset: r.underlyingAsset,
          symbol: r.symbol,
          name: r.name,
          decimals: Number(r.decimals),

          availableLiquidity:
            Number(r.availableLiquidity) / 10 ** Number(r.decimals),
          totalPrincipalStableDebt:
            Number(r.totalPrincipalStableDebt) / 10 ** Number(r.decimals),
          totalScaledVariableDebt:
            Number(r.totalScaledVariableDebt) / 10 ** Number(r.decimals),

          underlyingPrice: priceRaw / 10 ** decimals,

          supplyApy: (Number(r.liquidityRate) / 1e27) * 100,
          borrowApy: (Number(r.variableBorrowRate) / 1e27) * 100,
          isolationMode: r.borrowableInIsolation,
        };
      });
    },
    staleTime: 30_000,
  });
}
