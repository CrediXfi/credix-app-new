// src/lib/hooks/use-user-reserve-balances.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import { useAccount } from "wagmi";
import { ERC20Abi } from "@/chains/abis/ts/ERC20Abi";
import { PoolDataProviderSonicOneMarketAbi } from "@/chains/abis/ts/PoolDataProviderSonicOneMarketAbi";
import addresses from "@/chains/addresses.json";
import { CHAIN_ID } from "@/chains/soniclocal";
import { wagmiConfig } from "@/providers/web3-provider";

type Result = { supply: number; borrow: number };

interface Args {
  tokenAddress: `0x${string}`;
  decimals: number;
}

export function useUserReserveBalances({ tokenAddress, decimals }: Args) {
  const { address } = useAccount();

  return useQuery<Result, Error>({
    queryKey: ["userReserve", tokenAddress, address],
    enabled: !!address,
    staleTime: 30_000,
    queryFn: async () => {
      if (!address) throw new Error("wallet not connected");

      /* PoolDataProvider → getReserveTokensAddresses() */
      const providerAddr = (addresses as any)[CHAIN_ID]
        .PoolDataProvider as `0x${string}`;

      const [aTokenAddr, stableDebtAddr, variableDebtAddr] =
        (await readContract(wagmiConfig, {
          address: providerAddr,
          abi: PoolDataProviderSonicOneMarketAbi,
          functionName: "getReserveTokensAddresses",
          args: [tokenAddress],
          chainId: CHAIN_ID,
        })) as [`0x${string}`, `0x${string}`, `0x${string}`];

      const [aBal, sBal, vBal] = await Promise.all(
        [aTokenAddr, stableDebtAddr, variableDebtAddr].map((addr) =>
          readContract(wagmiConfig, {
            address: addr,
            abi: ERC20Abi,
            functionName: "balanceOf",
            args: [address],
            chainId: CHAIN_ID,
          }),
        ),
      );

      const supply = Number(aBal) / 10 ** decimals;
      const borrow = (Number(sBal) + Number(vBal)) / 10 ** decimals;

      return { supply, borrow };
    },
  });
}
