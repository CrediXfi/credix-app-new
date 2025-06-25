"use client";

import React from "react";
import { useMarkets } from "@/lib/hooks/use-markets";

function usdCompact(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1e9)  return `$${(n / 1e9).toFixed(2)}Bn`;
  if (abs >= 1e6)  return `$${(n / 1e6).toFixed(2)}Mn`;
  if (abs >= 1e3)  return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

/* fallback */
const marketData = [
  { label: "Total Market Size", value: "$0" },
  { label: "Total Available",   value: "$0" },
  { label: "Total Borrowed",    value: "$0" },
];

export function MarketCard() {
  const { data } = useMarkets();

  const cardData = React.useMemo(() => {
    if (!data?.length) return marketData;

    const totals = data.reduce(
      (acc, m) => {
        acc.available += m.availableLiquidity;
        acc.borrow += m.totalPrincipalStableDebt + m.totalScaledVariableDebt;
        return acc;
      },
      { available: 0, borrow: 0 }
    );

    const totalSize = totals.available + totals.borrow;

    return [
      { label: "Total Market Size", value: usdCompact(totalSize) },
      { label: "Total Available",   value: usdCompact(totals.available) },
      { label: "Total Borrowed",    value: usdCompact(totals.borrow) },
    ];
  }, [data]);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <h5 className="text-white text-[26px] font-semibold leading-6">
          Markets
        </h5>
        <p className="text-white opacity-75 text-base font-light leading-6 mt-1.5">
          All available markets on CX
        </p>
      </div>

      {cardData.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-[4px] border border-[#855ECA] bg-white/10 backdrop-blur-[25px] py-4 px-[18px]"
        >
          <p className="text-white text-base font-light leading-6 opacity-75">
            {label}
          </p>
          <p className="text-white text-2xl font-semibold leading-6 mt-2">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
