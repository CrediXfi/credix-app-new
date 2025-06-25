/* src/lib/hooks/use-borrow.ts */
"use client";

import { useMutation } from "@tanstack/react-query";
import {
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { useAccount, useWalletClient } from "wagmi";

import { parseUnits, formatUnits } from "viem";

import addresses from "@/chains/addresses.json";
import { PoolImplementationAbi } from "@/chains/abis/ts/PoolImplementationAbi";
import { wagmiConfig } from "@/providers/web3-provider";

import { CHAIN_ID } from "@/chains/soniclocal";

interface UseBorrowArgs {
  tokenAddress: string;
  decimals: number;
  interestRateMode?: number;
  referralCode?: number;
}

export function useBorrow({
  tokenAddress,
  decimals,
  interestRateMode = 2,
  referralCode = 0,
}: UseBorrowArgs) {
  const { address, isConnected } = useAccount();
  const { data: walletClient, isError: wcError } = useWalletClient({ chainId: CHAIN_ID });

  const chainAddrs = (addresses as Record<string, any>)[String(CHAIN_ID)];
  const poolProxy = chainAddrs?.["Pool-Proxy"] as `0x${string}` | undefined;
  if (!poolProxy) {
    throw new Error(`Pool-Proxy address not found for chainId=${CHAIN_ID}`);
  }

  return useMutation({
    mutationFn: async (amountStr: string) => {
      if (!walletClient || !address) {
        throw new Error("Wallet not connected");
      }

      const amount = parseUnits(amountStr, decimals);
      const rateMode = BigInt(interestRateMode);
      const txHash = await writeContract(wagmiConfig, {
        address: poolProxy,
        abi: PoolImplementationAbi,
        functionName: "borrow",
        args: [
          tokenAddress as `0x${string}`,
          amount,
          rateMode,
          referralCode,
          address as `0x${string}`,
        ],
        chainId: CHAIN_ID,
        account: address,
      });
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: txHash,
        chainId: CHAIN_ID,
      });

      return receipt;
    },
    onError: (err) => {
      console.error("[useBorrow] ❗ ERROR", err);
    },
  });
}
