"use client";

import React, { useState, useEffect } from "react";
import USDXLInput from "../../../../../components/input";
import { ToolTipIcon } from "@/app/components/atom/icons/market/tooltip";

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  maxAmount: number;
  symbol: string;
  onWithdraw: (amount: string) => void;
  isLoading: boolean;
}

export default function WithdrawModal({
  open,
  onClose,
  maxAmount,
  symbol,
  onWithdraw,
  isLoading,
}: WithdrawModalProps) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!open) setAmount("");
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    onWithdraw(amount);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-80 bg-[#1a1a1a] p-6 rounded-lg text-white">
        <h2 className="text-lg font-semibold mb-4">Withdraw {symbol}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center text-sm font-light mb-1">
              Amount
              <ToolTipIcon className="size-4 ml-1" />
            </label>
            <USDXLInput
              value={amount}
              onChange={setAmount}
              max={maxAmount}
              symbol={symbol}
            />
            <p className="mt-1 text-xs text-[#935ABD]">
              Max: {maxAmount.toLocaleString()} {symbol}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !amount}
              className="px-4 py-2 rounded bg-[#8748FF] disabled:opacity-50"
            >
              {isLoading ? "Withdrawing…" : "Withdraw"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
