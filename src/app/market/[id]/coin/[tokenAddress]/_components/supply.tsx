"use client";

import React, { useState, FC, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { FuelIcon } from "@/app/components/atom/icons/market/fuel";
import { ToolTipIcon } from "@/app/components/atom/icons/market/tooltip";
import USDXLInput from "../../../../../components/input";
import { useSupply } from "@/lib/hooks/use-supply";

export interface SupplyProps {
  tokenAddress: string;
  decimals: number;
  maxAmount: number;
  symbol: string;
}

export const Supply: FC<SupplyProps> = ({
  tokenAddress,
  decimals,
  maxAmount,
  symbol,
}) => {

  const [amount, setAmount] = useState("");
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  const { data: balanceData, isLoading: balLoading, isError: balError } = useBalance({
    address,
    token: tokenAddress as `0x${string}`,
    chainId: 146,
  });
  useEffect(() => {
    console.log("[Supply] useBalance:", { balLoading, balError, balanceData });
  }, [balLoading, balError, balanceData]);

  const walletBalance = balanceData?.value
    ? Number(balanceData.value) / 10 ** decimals
    : 0;

  const {
    mutate: supply,
    isPending,
    isSuccess,
    error,
    isError: supplyError,
  } = useSupply({
    tokenAddress: tokenAddress as `0x${string}`,
    decimals,
  });
  useEffect(() => {
    console.log("[Supply] useSupply state:", { isPending, isSuccess, supplyError, error });
  }, [isPending, isSuccess, supplyError, error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) {
      return;
    }
    supply(amount, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["markets"] });
        queryClient.invalidateQueries({ queryKey: ["balance", tokenAddress] });
        setAmount("");
      },
      onError: (err) => {
        console.error("[Supply] mutate onError:", err);
      },
    });
  };

  const handleChange = (v: string) => {
    setAmount(v);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md border border-[#855ECA] bg-white/5 backdrop-blur-[25px] py-1.5 px-3"
    >
      <p className="text-white opacity-75 text-base font-light leading-6">
        You are entering Isolation mode…{" "}
        <a
          href="https://discord.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Discord
        </a>
      </p>

      <p className="mt-4 flex items-center gap-1 text-sm font-light text-white">
        Amount
        <ToolTipIcon className="size-4" />
      </p>

      <USDXLInput
        value={amount}
        onChange={handleChange}
        max={maxAmount}
        symbol={symbol}
      />

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs font-light text-[#935ABD]">
          Wallet balance&nbsp;
          {walletBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })}{" "}
          {symbol}
        </p>

        <div className="flex gap-1">
          <span
            onClick={() => {
              const half = String((walletBalance / 2).toFixed(decimals > 4 ? 4 : decimals));
              setAmount(half);
            }}
            className="cursor-pointer rounded-[2px] bg-[#935ABD] py-1 px-2 text-xs font-medium text-white"
          >
            Half
          </span>
          <span
            onClick={() => {
              const max = String(walletBalance.toFixed(decimals > 4 ? 4 : decimals));
              setAmount(max);
            }}
            className="cursor-pointer rounded-[2px] bg-[#935ABD] py-1 px-2 text-xs font-medium text-white"
          >
            MAX
          </span>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-xs mb-2">
          {(error as Error).message}
        </p>
      )}
      {isSuccess && (
        <p className="text-green-500 text-xs mb-2">Supply successful ✅</p>
      )}

      <button
        type="submit"
        disabled={isPending || !amount}
        className="mb-2 flex w-full items-center justify-center rounded bg-[#8748FF] py-2 text-lg font-semibold text-white disabled:opacity-50"
      >
        {isPending ? "Supplying…" : "Supply"}
      </button>
    </form>
  );
};
