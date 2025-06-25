// src/app/components/modals/SupplyModal.tsx
"use client";

import React, { useState, useEffect, FC } from "react";
import { useAccount, useBalance } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { ToolTipIcon } from "@/app/components/atom/icons/market/tooltip";
import USDXLInput from "@/app/components/input";
import { useSupply } from "@/lib/hooks/use-supply";

export interface SupplyModalProps {
  open: boolean;
  onClose: () => void;
  tokenAddress: string;
  decimals: number;
  symbol: string;
}

export const SupplyModal: FC<SupplyModalProps> = ({
  open,
  onClose,
  tokenAddress,
  decimals,
  symbol,
}) => {
  const [amount, setAmount] = useState("");
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();

  // fetch wallet balance
  const { data: balanceData, isLoading: balLoading, isError: balError } = useBalance({
    address,
    token: tokenAddress as `0x${string}`,
    chainId: 146,
  });

  const walletBalance = balanceData?.value
    ? Number(balanceData.value) / 10 ** decimals
    : 0;

  // supply hook
  const { mutate: supply, isPending, isSuccess, error, isError: supplyError } = useSupply({
    tokenAddress: tokenAddress as `0x${string}`,
    decimals,
  });

  useEffect(() => {
    if (!open) setAmount("");
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    supply(amount, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["markets"] });
        queryClient.invalidateQueries({ queryKey: ["balance", tokenAddress] });
        setAmount("");
        onClose();
      },
      onError: () => {
        // error shown below
      },
    });
  };

  const handleChange = (v: string) => setAmount(v);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-80 bg-[#1a1a1a] p-6 rounded-lg text-white">
        <h2 className="text-lg font-semibold mb-4">Supply {symbol}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-white opacity-75 text-base font-light leading-6">
            {`Wallet balance: ${walletBalance.toLocaleString(undefined, { maximumFractionDigits: decimals })} ${symbol}`}
          </p>

          <label className="flex items-center text-sm font-light mb-1">
            Amount <ToolTipIcon className="size-4 ml-1" />
          </label>
          <USDXLInput value={amount} onChange={handleChange} max={walletBalance} symbol={symbol} />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAmount((walletBalance / 2).toFixed(decimals > 4 ? 4 : decimals))}
              className="cursor-pointer rounded-[2px] bg-[#935ABD] py-1 px-2 text-xs font-medium"
            >
              Half
            </button>
            <button
              type="button"
              onClick={() => setAmount(walletBalance.toFixed(decimals > 4 ? 4 : decimals))}
              className="cursor-pointer rounded-[2px] bg-[#935ABD] py-1 px-2 text-xs font-medium"
            >
              MAX
            </button>
          </div>

          {supplyError && (
            <p className="text-red-500 text-xs">{(error as Error).message}</p>
          )}
          {isSuccess && (
            <p className="text-green-500 text-xs">Supply successful ✅</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !amount}
              className="px-4 py-2 rounded bg-[#8748FF]"
            >
              {isPending ? "Supplying…" : "Supply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};