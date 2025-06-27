"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import { ArrowDownIcon } from "@/app/components/atom/icons/market/arrow-down";
import { useMarkets } from "@/lib/hooks/use-markets";
import { MarketAssetsTable } from "./market-assets-table";

const usd = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)} Bn`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)} Mn`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(2)} K`;
  return `$${n.toFixed(2)}`;
};

const demoMarkets = [
  {
    id: "1",
    chainIcon: "/loop.png",
    marketName: "Sonic Core",
    description:
      "Core lending and borrowing market on Sonic chain. Focused on growing the Sonic ecosystem.",
  },
];

export default function MarketDetailPage() {
  const { id } = useParams<{ id: string }>();

  const tpl = demoMarkets.find((m) => m.id === id) ?? demoMarkets[0];

  const { data } = useMarkets();

  const { totalAvailable, totalBorrow } = React.useMemo(() => {
    if (!data?.length) return { totalAvailable: 0, totalBorrow: 0 };

    return data.reduce(
      (acc, r) => {
        const price = r.underlyingPrice;
        acc.totalAvailable += (r.availableLiquidity * price);
        acc.totalBorrow += ((r.totalPrincipalStableDebt + r.totalScaledVariableDebt) * price);
        return acc;
      },
      { totalAvailable: 0, totalBorrow: 0 }
    );
  }, [data]);

  const totalMarketSize = totalAvailable + totalBorrow;

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <button className="bg-[#8748FF] rounded-sm py-1 px-2.5 flex items-center gap-1">
            <Image src={tpl.chainIcon} alt="chain" width={20} height={20} />
            <h6 className="text-white text-sm font-semibold">{tpl.marketName}</h6>
            <ArrowDownIcon className="size-6" />
          </button>
          <p className="text-white text-xs font-light opacity-75 mt-3.5">
            {tpl.description}
          </p>
        </div>

        {[
          { label: "Total Market Size", value: usd(totalMarketSize) },
          { label: "Total Available",   value: usd(totalAvailable) },
          { label: "Total Borrowed",    value: usd(totalBorrow) },
        ].map(({ label, value }) => (
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

      <MarketAssetsTable />
    </div>
  );
}
