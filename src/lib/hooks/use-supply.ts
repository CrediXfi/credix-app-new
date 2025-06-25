// src/lib/hooks/use-supply.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { parseUnits, formatUnits } from "viem";

import addresses from "@/chains/addresses.json";
import { ERC20Abi } from "@/chains/abis/ts/ERC20Abi";
import { PoolImplementationAbi } from "@/chains/abis/ts/PoolImplementationAbi";
import { wagmiConfig } from "@/providers/web3-provider";
import { CHAIN_ID } from "@/chains/soniclocal";

interface UseSupplyArgs {
  tokenAddress: `0x${string}`;
  decimals: number;
  referralCode?: number;
}

export function useSupply({
  tokenAddress,
  decimals,
  referralCode = 0,
}: UseSupplyArgs) {
  const { address, isConnected } = useAccount();
  const { data: walletClient, isError: wcError } = useWalletClient({ chainId: CHAIN_ID });
  usePublicClient({ chainId: CHAIN_ID });

  const chainAddrs = (addresses as Record<string, any>)[String(CHAIN_ID)];
  const poolProxy = chainAddrs?.["Pool-Proxy"] as `0x${string}`;
  if (!poolProxy) throw new Error(`Pool-Proxy address not found for chainId=${CHAIN_ID}`);

  return useMutation({
    mutationFn: async (amountStr: string) => {

      if (!walletClient || !address) {
        throw new Error("Wallet not connected");
      }

      const amountBN = parseUnits(amountStr, decimals);
      const allowance = (await readContract(wagmiConfig, {
        address: tokenAddress,
        abi: ERC20Abi,
        functionName: "allowance",
        args: [address, poolProxy],
        chainId: CHAIN_ID,
      })) as bigint;

      if (allowance < amountBN) {
        const approveHash = await writeContract(wagmiConfig, {
          address: tokenAddress,
          abi: ERC20Abi,
          functionName: "approve",
          args: [poolProxy, amountBN],
          chainId: CHAIN_ID,
          account: address,
        });

        await waitForTransactionReceipt(wagmiConfig, {
          hash: approveHash,
          chainId: CHAIN_ID,
        });
      }

      const depositHash = await writeContract(wagmiConfig, {
        address: poolProxy,
        abi: PoolImplementationAbi,
        functionName: "supply", // или "supply"
        args: [tokenAddress, amountBN, address, referralCode],
        chainId: CHAIN_ID,
        account: address,
      });

      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: depositHash,
        chainId: CHAIN_ID,
      });

      return receipt;
    },
    onError: (err) => {
      console.error("[useSupply] ❗ ERROR", err);
    },
  });
}
