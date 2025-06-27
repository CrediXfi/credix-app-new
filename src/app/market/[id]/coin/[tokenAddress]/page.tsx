"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useTokenData } from "@/lib/hooks/use-token-data";
import { useMarkets } from "@/lib/hooks/use-markets";
import { usePoolData } from "@/lib/hooks/use-pool-data-provider";

import CoinHeader from "./_components/coin-header";
import { Supply } from "./_components/supply";
import { Borrow } from "./_components/borrow";
import Chart from './_components/chart';

export default function Page() {
  const { tokenAddress } = useParams<{ tokenAddress: string }>();

  const { data: tokenData, isLoading: lt, isError: et } = useTokenData(tokenAddress);
  const { data: markets, isLoading: lm, isError: em } = useMarkets();
  const { data: poolData, isLoading: lp, isError: ep } = usePoolData(tokenAddress);

  if (lt || lm || lp) return <div>Loading…</div>;

  if (et || em || ep) {
  console.error({
    tokenDataError: et,
    marketsError: em,
    poolDataError: ep,
  });
}

if (et || em || ep) {
  return (
    <div className="text-red-500">
      {et && "TokenData error; "}
      {em && "Markets error; "}
      {ep && "PoolData error"}
    </div>
  );
}



  if (et || em || ep || !tokenData || !markets || !poolData)
    return <div>Error fetching data</div>;

  const market = markets.find(m => m.underlyingAsset.toLowerCase() === tokenAddress.toLowerCase());
  if (!market) return <div>Market not found</div>;

  const totalBorrow = market.totalPrincipalStableDebt + market.totalScaledVariableDebt;
  const price = market.underlyingPrice;
  const availableLiquidity = (market.availableLiquidity * price);
  const totalBorrowed = (totalBorrow * price);
  const reserveSize = availableLiquidity + totalBorrowed;
  const utilizationRate = (totalBorrowed / (reserveSize || 1)) * 100;

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="px-4 space-y-8">
      <CoinHeader
        tokenAddress={tokenAddress}
        tokenSymbol={tokenData.symbol}
        tokenName={tokenData.name}
        tokenDecimals={tokenData.decimals}
        reserveSize={fmt(reserveSize)}
        availableLiquidity={fmt(availableLiquidity)}
        utilizationRate={utilizationRate.toFixed(2)}
        oraclePrice={market.underlyingPrice.toFixed(2)}
        totalBorrowed={fmt(totalBorrowed)}
        supplyCap={fmt(poolData.supplyCap)}
        supplyApy={market.supplyApy.toFixed(2)}
        startIsolatedDebt={fmt(poolData.debtCeiling)}
        stopIsolatedDebt={fmt(poolData.debtCeiling)}
        borrowCap={fmt(poolData.borrowCap)}
        borrowApy={market.borrowApy.toFixed(2)}
      />
 
    </div>
  );
}
