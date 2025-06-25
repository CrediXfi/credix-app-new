// src/lib/hooks/use-withdraw.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import {
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { parseUnits } from "viem";

import addresses from "@/chains/addresses.json";
import { PoolImplementationAbi } from "@/chains/abis/ts/PoolImplementationAbi";
import { wagmiConfig } from "@/providers/web3-provider";
import { CHAIN_ID } from "@/chains/soniclocal";

interface UseWithdrawArgs {
  tokenAddress: `0x${string}`;
  decimals: number;
}

export function useWithdraw({ tokenAddress, decimals }: UseWithdrawArgs) {
  const { address, isConnected } = useAccount();
  const { data: walletClient, isError: wcError } = useWalletClient({ chainId: CHAIN_ID });
  usePublicClient({ chainId: CHAIN_ID });

  const chainAddrs = (addresses as Record<string, any>)[String(CHAIN_ID)];
  const poolProxy = chainAddrs?.["Pool-Proxy"] as `0x${string}`;
  if (!poolProxy) {
    throw new Error(`Pool-Proxy address not found for chainId=${CHAIN_ID}`);
  }

  return useMutation({
    mutationFn: async (amountStr: string) => {
      console.log("[useWithdraw] start mutation", { amountStr, tokenAddress, poolProxy });

      if (!isConnected || wcError || !walletClient || !address) {
        const err = new Error("Wallet not connected or wrong network");
        console.error("[useWithdraw] precondition failed", err);
        throw err;
      }

      const amountBN = parseUnits(amountStr, decimals);

      const txHash = await writeContract(wagmiConfig, {
        address: poolProxy,
        abi: PoolImplementationAbi,
        functionName: "withdraw",
        args: [tokenAddress, amountBN, address],
        chainId: CHAIN_ID,
        account: address,
      });

      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: txHash,
        chainId: CHAIN_ID,
      });
      console.log("[useWithdraw] receipt", receipt);

      return receipt;
    },
    onError: (err) => {
      console.error("[useWithdraw] mutation error", err);
    },
    onSuccess: (data) => {
      console.log("[useWithdraw] mutation success", data);
    },
  });
}
