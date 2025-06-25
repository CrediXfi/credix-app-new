// src/lib/hooks/use-token-data.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import { ERC20Abi } from "@/chains/abis/ts/ERC20Abi";
import { wagmiConfig } from "@/providers/web3-provider";

export interface TokenData {
  symbol: string;
  name: string;
  decimals: number;
}

export function useTokenData(tokenAddress?: string) {
  return useQuery<TokenData, Error>({
    queryKey: ["tokenData", tokenAddress],
    queryFn: async () => {
      if (!tokenAddress) {
          console.error("No token address");
        throw new Error("No token address");
      }

      const [symbol, name, decimals] = await Promise.all([
        readContract(wagmiConfig, {
          address: tokenAddress as `0x${string}`,
          abi: ERC20Abi,
          functionName: "symbol",
        }),
        readContract(wagmiConfig, {
          address: tokenAddress as `0x${string}`,
          abi: ERC20Abi,
          functionName: "name",
        }),
        readContract(wagmiConfig, {
          address: tokenAddress as `0x${string}`,
          abi: ERC20Abi,
          functionName: "decimals",
        }),
      ]);

      return {
        symbol: symbol as string,
        name: name as string,
        decimals: Number(decimals),
      };
    },
    enabled: Boolean(tokenAddress),
    staleTime: 30_000,
  });
}
