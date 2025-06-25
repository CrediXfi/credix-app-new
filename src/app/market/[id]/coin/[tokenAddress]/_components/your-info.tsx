"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { Accordion } from "@/app/components/accordion/accordion";
import { ArrowUpIcon } from "@/app/components/atom/icons/market/arrow-up";
import { ToolTipIcon } from "@/app/components/atom/icons/market/tooltip";
import { useUserReserveBalances } from "@/lib/hooks/use-user-reserve-balances";
import { useTokenData } from "@/lib/hooks/use-token-data";
import { useWithdraw } from "@/lib/hooks/use-withdraw";
import { useRepay } from "@/lib/hooks/use-repay";
import WithdrawModal from "./WithdrawModal";
import RepayModal from "./RepayModal";

interface Props {
  tokenAddress: `0x${string}`;
  decimals: number;
}

export function YourInfo({ tokenAddress, decimals }: Props) {
  const { isConnected } = useAccount();
  const { data, isLoading, isError } = useUserReserveBalances({
    tokenAddress,
    decimals,
  });
  const { data: tokenData } = useTokenData(tokenAddress);
  const symbol = tokenData?.symbol ?? "";

  const supply = data?.supply ?? 0;
  const borrow = data?.borrow ?? 0;

  // модалки
  const [isWithdrawOpen, setWithdrawOpen] = useState(false);
  const [isRepayOpen, setRepayOpen] = useState(false);

  // хуки
  const withdrawMutation = useWithdraw({ tokenAddress, decimals });
  const repayMutation = useRepay({ tokenAddress, decimals });

  const handleWithdraw = (amount: string) => {
    console.log("[YourInfo] withdraw", amount);
    withdrawMutation.mutate(amount, {
      onSuccess: () => {
        setWithdrawOpen(false);
      },
      onError: (err) => {
        console.error("[YourInfo] withdraw failed", err);
      },
    });
  };

  const handleRepay = (amount: string) => {
    repayMutation.mutate(amount, {
      onSuccess: () => {
        setRepayOpen(false);
      },
      onError: (err) => {
        console.error("[YourInfo] repay failed", err);
      },
    });
  };

  return (
    <>
      <Accordion className="mt-8" defaultOpen>
        <Accordion.Header>
          {({ open }) => (
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-xl font-normal leading-6 text-white">
                Your Info
              </h1>
              <ArrowUpIcon
                className={`size-5 transition-transform ${
                  open ? "rotate-0" : "rotate-180"
                }`}
              />
            </div>
          )}
        </Accordion.Header>

        <Accordion.Body className="mb-7 space-y-4">
          {isConnected && (
            <>
              {/* Supplies */}
              <div className="flex justify-between rounded-[4px] border border-[#855ECA] bg-white/5 py-3 px-4 backdrop-blur-[25px]">
                <span className="text-base font-normal text-white opacity-75">
                  Your Supplies
                </span>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <ToolTipIcon className="size-4 text-white" />
                    <span className="font-medium text-white">
                      {isLoading ? "…" : supply.toLocaleString()}
                    </span>
                  </div>
                  <button
                    disabled={supply === 0 || isLoading || isError}
                    onClick={() => setWithdrawOpen(true)}
                    className="mt-2 rounded bg-[#935ABD] px-2 py-1 text-sm font-medium text-white disabled:opacity-40"
                  >
                    Withdraw
                  </button>
                </div>
              </div>

              {/* Borrows */}
              <div className="flex justify-between rounded-[4px] border border-[#855ECA] bg-white/5 py-3 px-4 backdrop-blur-[25px]">
                <span className="text-base font-normal text-white opacity-75">
                  Your Borrows
                </span>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <ToolTipIcon className="size-4 text-white" />
                    <span className="font-medium text-white">
                      {isLoading ? "…" : borrow.toLocaleString()}
                    </span>
                  </div>
                  <button
                    disabled={borrow === 0 || isLoading || isError}
                    onClick={() => setRepayOpen(true)}
                    className="mt-2 rounded bg-[#935ABD] px-2 py-1 text-sm font-medium text-white disabled:opacity-40"
                  >
                    Repay
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-2 rounded-[4px] border border-[#855ECA] bg-white/5 py-3 px-4 text-white/75 backdrop-blur-[25px]">
            <ToolTipIcon className="relative -bottom-1 size-4" />
            {isConnected
              ? isError
                ? "Failed to load balances."
                : supply === 0 && borrow === 0
                ? "No active positions."
                : "Balances loaded."
              : "Not Connected."}
          </div>
        </Accordion.Body>
      </Accordion>

      <WithdrawModal
        open={isWithdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        maxAmount={supply}
        symbol={symbol}
        onWithdraw={handleWithdraw}
        isLoading={withdrawMutation.status === "pending"}
      />

      <RepayModal
        open={isRepayOpen}
        onClose={() => setRepayOpen(false)}
        maxAmount={borrow}
        symbol={symbol}
        onRepay={handleRepay}
        isLoading={repayMutation.status === "pending"}
      />
    </>
  );
}
