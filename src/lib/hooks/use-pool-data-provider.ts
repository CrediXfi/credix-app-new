// src/lib/hooks/use-pool-data-provider.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import addresses from "@/chains/addresses.json";
import { PoolDataProviderSonicOneMarketAbi } from "@/chains/abis/ts/PoolDataProviderSonicOneMarketAbi";
import { CHAIN_ID } from "@/chains/soniclocal";
import { wagmiConfig } from "@/providers/web3-provider";

export interface PoolData {
  supplyCap: number;
  borrowCap: number;
  debtCeiling: number;
}

export function usePoolData(asset?: string) {
  return useQuery<PoolData, Error>({
    queryKey: ["poolData", asset],
    queryFn: async () => {
      if (!asset) {
        throw new Error("No asset address");
      }
      const providerAddr = (addresses as any)[CHAIN_ID]
        .PoolDataProvider as `0x${string}`;

      const [capsRaw, debtCeilingRaw, decimalsRaw] = await Promise.all([
        readContract(wagmiConfig, {
          address: providerAddr,
          abi: PoolDataProviderSonicOneMarketAbi,
          functionName: "getReserveCaps",
          args: [asset as `0x${string}`],
          chainId: CHAIN_ID,
        }),
        readContract(wagmiConfig, {
          address: providerAddr,
          abi: PoolDataProviderSonicOneMarketAbi,
          functionName: "getDebtCeiling",
          args: [asset as `0x${string}`],
          chainId: CHAIN_ID,
        }),
        readContract(wagmiConfig, {
          address: providerAddr,
          abi: PoolDataProviderSonicOneMarketAbi,
          functionName: "getDebtCeilingDecimals",
          chainId: CHAIN_ID,
        }),
      ]);

      const [borrowCapRaw, supplyCapRaw] = capsRaw as [bigint, bigint];
      const borrowCap = Number(borrowCapRaw) / 1e18;
      const supplyCap = Number(supplyCapRaw) / 1e18;
      const scale = 10 ** Number(decimalsRaw as bigint);
      const debtCeiling = Number(debtCeilingRaw as bigint) / scale;

      return { supplyCap, borrowCap, debtCeiling };
    },
    enabled: Boolean(asset),
    staleTime: 30_000,
  });
}
