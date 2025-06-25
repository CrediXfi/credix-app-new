// src/lib/hooks/use-repay.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { parseUnits } from "viem";

import addresses from "@/chains/addresses.json";
import { ERC20Abi } from "@/chains/abis/ts/ERC20Abi";
import { PoolImplementationAbi } from "@/chains/abis/ts/PoolImplementationAbi";
import { wagmiConfig } from "@/providers/web3-provider";
import { CHAIN_ID } from "@/chains/soniclocal";

interface UseRepayArgs {
  tokenAddress: `0x${string}`;
  decimals: number;
  interestRateMode?: number;
}

export function useRepay({
  tokenAddress,
  decimals,
  interestRateMode = 2,
}: UseRepayArgs) {
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
      console.log("[useRepay] start mutation", { amountStr, tokenAddress, interestRateMode });

      if (!isConnected || wcError || !walletClient || !address) {
        const err = new Error("Wallet not connected or wrong network");
        throw err;
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
        console.log("[useRepay] need approve", { amountBN });
        const approveTx = await writeContract(wagmiConfig, {
          address: tokenAddress,
          abi: ERC20Abi,
          functionName: "approve",
          args: [poolProxy, amountBN],
          chainId: CHAIN_ID,
          account: address,
        });
        await waitForTransactionReceipt(wagmiConfig, { hash: approveTx, chainId: CHAIN_ID });
      }

      const repayTx = await writeContract(wagmiConfig, {
        address: poolProxy,
        abi: PoolImplementationAbi,
        functionName: "repay",
        args: [tokenAddress, amountBN, BigInt(interestRateMode), address],
        chainId: CHAIN_ID,
        account: address,
      });

      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: repayTx,
        chainId: CHAIN_ID,
      });

      return receipt;
    },
    onError: (err) => {
      console.error("[useRepay] mutation error", err);
    },
    onSuccess: (data) => {
      console.log("[useRepay] mutation success", data);
    },
  });
}
