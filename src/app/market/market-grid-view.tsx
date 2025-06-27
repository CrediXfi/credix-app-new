"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useMarkets } from "@/lib/hooks/use-markets";
import { RightAngleIcon } from "../components/atom/icons/market/right-angle";

function splitValueUnit(n: number): [string, string] {
  const abs = Math.abs(n);
  if (abs >= 1e9) return [(n / 1e9).toFixed(1), "Bn"];
  if (abs >= 1e6) return [(n / 1e6).toFixed(2), "Mn"];
  if (abs >= 1e3) return [(n / 1e3).toFixed(2), "K"];
  return [n.toFixed(2), ""];
}

/* базовый плейсхолдер (не убираем) */
type CardMarket = {
  id: number;
  type: string;
  name: string;
  marketSize: string;
  marketSizeUnit: string;
  tvl: string;
  tvlUnit: string;
  totalBorrow: string;
  totalBorrowUnit: string;
  description: string;
};

const marketData: CardMarket[] = [
  {
    id: 1,
    type: "CORE",
    // name: "Credix Core",
    name: "Sonic Core",
    marketSize: "2.6",
    marketSizeUnit: "Mn",
    tvl: "969.71",
    tvlUnit: "K",
    totalBorrow: "969.71",
    totalBorrowUnit: "K",
    description:
      // "Core lending market for the CredixEVM. Focused on growing the HyperLiquid ecosystem.",
      "Core lending and borrowing market on Sonic chain. Focused on growing the Sonic ecosystem.",
  },
];

export function MarketGridView() {
  const { data } = useMarkets();

  const gridData = React.useMemo<CardMarket[]>(() => {
    if (!data?.length) return marketData;      // пока грузится

    const totals = data.reduce(
      (acc, r) => {
        const price = r.underlyingPrice;
        acc.available += (r.availableLiquidity * price);
        acc.borrow += ((r.totalPrincipalStableDebt + r.totalScaledVariableDebt) * price);
        return acc;
      },
      { available: 0, borrow: 0 }
    );

    const marketSize = totals.available + totals.borrow;

    const [msVal, msUnit] = splitValueUnit(marketSize);
    const [tvlVal, tvlUnit] = splitValueUnit(totals.available);
    const [brVal, brUnit] = splitValueUnit(totals.borrow);

    return [
      {
        ...marketData[0],
        marketSize: msVal,
        marketSizeUnit: msUnit,
        tvl: tvlVal,
        tvlUnit,
        totalBorrow: brVal,
        totalBorrowUnit: brUnit,
      },
    ];
  }, [data]);


  return (
    <div className="grid md:grid-cols-2 gap-2.5 md:gap-4">
      {gridData.map((market) => (
        <div
          key={market.id}
          className="relative group bg-[rgba(135,72,255,0.05)] rounded-[4px] backdrop-blur-[25px] px-4 py-5 overflow-hidden"
        >
          {/* Hover layer */}
          <div className="absolute bottom-0 left-0 w-full h-[45%] bg-[rgba(135,72,255,0.15)] text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-20 p-4">
            <div className="flex items-center justify-between">
              <p className="text-white text-xs font-light leading-6 opacity-75 max-w-[75%]">
                {market.description}
              </p>
              <Link href={`/market/${market.id}`}>
                <div className="flex items-center gap-2 cursor-pointer text-white text-xs font-light leading-6">
                  View
                  <RightAngleIcon className="size-6 text-white" />
                </div>
              </Link>
            </div>
          </div>

          {/* Card content */}
          <span className="bg-[#8748FF66] rounded-sm py-[2px] px-2.5 text-white z-10 relative">
            {market.type}
          </span>

          <div className="flex items-center gap-1 my-3 z-10 relative">
            <Image src="/loop.png" alt="loop" height={30} width={30} />
            <h4 className="text-white text-base font-normal leading-6">
              {market.name}
            </h4>
          </div>

          <div
            className="flex md:grid lg:grid-cols-3 md:grid-cols-2 items-center justify-between z-10 relative
                       transition-opacity duration-500 ease-in-out
                       group-hover:opacity-0 md:gap-4 lg:gap-0"
          >
            <div>
              <h6 className="text-white text-sm font-normal leading-6 opacity-60">
                Market Size
              </h6>
              <h6 className="text-[#606060] text-sm font-semibold leading-6">
                $<span className="text-white">{market.marketSize}</span>
                {market.marketSizeUnit}
              </h6>
            </div>

            <div>
              <h6 className="text-white text-sm font-normal leading-6 opacity-60">
                TVL
              </h6>
              <h6 className="text-[#606060] text-sm font-semibold leading-6">
                $<span className="text-white">{market.tvl}</span>
                {market.tvlUnit}
              </h6>
            </div>

            <div>
              <h6 className="text-white text-sm font-normal leading-6 opacity-60">
                Total Borrow
              </h6>
              <h6 className="text-[#606060] text-sm font-semibold leading-6">
                $<span className="text-white">{market.totalBorrow}</span>
                {market.totalBorrowUnit}
              </h6>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
