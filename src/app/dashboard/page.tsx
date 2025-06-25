"use client";

import React from "react";
import { useUserDashboard } from "@/lib/hooks/use-user-dashboard";
import { SummaryCard }     from "./_components/summary-card";
import { PositionTable }   from "./_components/position";

export default function page() {
  const { data, isLoading, isError, error } = useUserDashboard();

  if (isLoading) return <div className="p-8 text-white">Loading…</div>;
  if (isError)   return <div className="p-8 text-red-500">Error: {String(error)}</div>;
  if (!data)     return <div className="p-8 text-white">No data</div>;

  const totalNetWorth = Number.isFinite(data.totalNetWorth) ? data.totalNetWorth : 0;
  const totalDebt     = Number.isFinite(data.totalDebt)     ? data.totalDebt     : 0;
  const totalRewards  = Number.isFinite(data.totalRewards)  ? data.totalRewards  : 0;

  const cards = [
    { title: "Total Net Worth", amount: totalNetWorth.toFixed(2) },
    { title: "Total Debt",      amount: totalDebt.toFixed(2)     },
    { title: "Total Rewards",   amount: totalRewards.toFixed(2)  },
  ];

  return (
    <div className="space-y-8 p-8">
      {/* Header + Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="w-full md:w-2/6">
          <h1 className="text-white text-2xl md:text-[26px] font-semibold">
            Rewards and Positions
          </h1>
          <p className="text-white opacity-75 text-sm md:text-base font-light leading-6 mt-2">
            View your rewards for staking or providing <br className="md:block sm:hidden" />
            liquidity via lending or borrowing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-2/4">
          {cards.map((c) => (
            <SummaryCard key={c.title} title={c.title} amount={c.amount} />
          ))}
        </div>
      </div>

      <PositionTable data={data.positions} />

      <div className="mt-6 p-6 bg-white/10 backdrop-blur rounded-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Claim Rewards</h2>
          <p className="text-white/75">
            You have accumulated{" "}
            <span className="font-medium">{totalRewards.toFixed(2)}</span> reward tokens.
          </p>
        </div>
        <button
          disabled={totalRewards === 0}
          onClick={() => {/* claim logic */}}
          className="px-4 py-2 bg-teal-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Claim All
        </button>
      </div>
    </div>
  );
}
