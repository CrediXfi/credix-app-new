"use client";

import React, { useState, FC } from "react";
import { useAccount, useBalance } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { FuelIcon } from "@/app/components/atom/icons/market/fuel";
import { ToolTipIcon } from "@/app/components/atom/icons/market/tooltip";
import USDXLInput from "../../../../../components/input";
import { useBorrow } from "@/lib/hooks/use-borrow";

export interface BorrowProps {
  tokenAddress: string;
  decimals: number;
  maxAmount: number;
  symbol: string;
}

export const Borrow: FC<BorrowProps> = ({
  tokenAddress,
  decimals,
  maxAmount,
  symbol,
}) => {
  const [amount, setAmount] = useState("");
  const queryClient = useQueryClient();
  const { address } = useAccount();

  /* баланс (для отображения) */
  const { data: balanceData } = useBalance({
    address,
    token: tokenAddress as `0x${string}`,
    chainId: 146,
  });
  const walletBalance =
    balanceData?.value ? Number(balanceData.value) / 10 ** decimals : 0;

  /* borrow-хук */
  const { mutate: borrow, isPending, isSuccess, error } = useBorrow({
    tokenAddress: tokenAddress as `0x${string}`,
    decimals,
    interestRateMode: 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    borrow(amount, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["markets"] });
        queryClient.invalidateQueries({
          queryKey: ["balance", tokenAddress],
        });
        setAmount("");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md border border-[#855ECA] bg-white/5 backdrop-blur-[25px] py-1.5 px-3"
    >
      <p className="mt-4 mb-2 flex items-center gap-1 text-sm font-light text-white">
        Amount
        <ToolTipIcon className="size-4" />
      </p>

      <USDXLInput
        value={amount}
        onChange={setAmount}
        max={maxAmount}
        symbol={symbol}
      />

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs font-light text-[#935ABD]">
          Available&nbsp;
          {walletBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })}{" "}
          {symbol}
        </p>

        <div className="flex gap-1">
          <span
            onClick={() =>
              setAmount(
                String(
                  (walletBalance / 2).toFixed(decimals > 4 ? 4 : decimals),
                ),
              )
            }
            className="cursor-pointer rounded-[2px] bg-[#935ABD] py-1 px-2 text-xs font-medium text-white"
          >
            Half
          </span>
          <span
            onClick={() => {
              const max = (Math.floor(walletBalance * 10 ** (decimals > 4 ? 4 : decimals)) / 10 ** (decimals > 4 ? 4 : decimals)).toString();
              setAmount(max);
            }}
            className="cursor-pointer rounded-[2px] bg-[#935ABD] py-1 px-2 text-xs font-medium text-white"
          >
            MAX
          </span>
        </div>
      </div>

      {/* KPI-заглушки */}
      <div className="mt-5 space-y-2">
        <span className="flex justify-between">
          <h5 className="text-sm font-light opacity-75 text-white">
            Borrow&nbsp;APY
          </h5>
          <h5 className="text-sm font-light opacity-75 text-white">33.84</h5>
        </span>

        <span className="flex justify-between">
          <h5 className="text-sm font-light opacity-75 text-white">
            Health&nbsp;Factor
          </h5>
          <h5 className="text-sm font-light opacity-75 text-[#66FF00]">∞</h5>
        </span>
      </div>

      {/* разделитель */}
      <div className="relative h-8 w-full">
        <div className="absolute left-1 right-1 top-1/2 z-0 h-[2px] -translate-y-1/2 transform bg-[#606060]" />
        <div className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform bg-[#181029]">
          <FuelIcon className="size-3" />
        </div>
      </div>

      {/* ошибки / успех */}
      {error && (
        <p className="text-red-500 text-xs mb-2">
          {(error as Error).message}
        </p>
      )}
      {isSuccess && (
        <p className="text-green-500 text-xs mb-2">Borrow successful ✅</p>
      )}

      <button
        type="submit"
        disabled={isPending || !amount}
        className="mb-2 mt-4 flex w-full items-center justify-center rounded bg-[#8748FF] py-2 text-lg font-semibold text-white disabled:opacity-50"
      >
        {isPending ? "Borrowing…" : "Borrow"}
      </button>
    </form>
  );
};
