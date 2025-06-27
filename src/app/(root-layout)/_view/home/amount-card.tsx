// ─── src/app/market/amount-card.tsx ─────────────────────────────────────────
"use client";

import React from "react";
import { useMarkets } from "@/lib/hooks/use-markets";

/* компактный USD-формат: 1_234_567 → "$1.23 Mn" */
function usdCompact(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)} Bn`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)} Mn`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(2)} K`;
  return `$${n.toFixed(2)}`;
}

export function AmountCard() {
  const { data: markets, isLoading, error } = useMarkets();

  if (isLoading)  return <p className="text-white">Loading totals…</p>;
  if (error)      return <p className="text-red-500">Failed to load totals: {error.message}</p>;
  if (!markets?.length) return <p className="text-white">No markets available</p>;

  /* ── агрегируем числа по всем резервам ── */
  const totals = markets.reduce(
    (acc, m) => {
      // TODO: когда underlyingPrice станет корректным USD-значением,
      // раскомментируйте строки, отмеченные (★)
      const available = m.availableLiquidity /* ★ * m.underlyingPrice */;
      const borrowed =
        (m.totalPrincipalStableDebt + m.totalScaledVariableDebt) /* ★ * m.underlyingPrice */;
      const price = m.underlyingPrice;
      acc.available += available * price;
      acc.borrow += borrowed * price;
      return acc;
    },
    { available: 0, borrow: 0 }
  );

  const totalMarketSize = totals.available + totals.borrow;

  const cardData = [
    { title: "Total Market Size", value: usdCompact(totalMarketSize) },
    { title: "Total Available",   value: usdCompact(totals.available) },
    { title: "Total Borrowed",    value: usdCompact(totals.borrow) },
  ];

  /* ── UI ── */
  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-3 md:gap-4 gap-2 mt-4 md:mt-5">
      {cardData.map(({ title, value }) => (
        <div
          key={title}
          className="rounded-[4px] border border-[#855ECA] bg-white/10 backdrop-blur-[25px] py-4 px-[18px]"
        >
          <p className="text-white text-base font-light leading-6 opacity-75">
            {title}
          </p>
          <p className="text-white text-2xl font-semibold leading-6 mt-2">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
