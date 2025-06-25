"use client";

import React from "react";
import Image from "next/image";
import { NewTabIcon } from "@/app/components/atom/icons/market/new-tab";
import { ToolTipIcon } from "@/app/components/atom/icons/market/tooltip";
import BorrowRateChart from "./chart";
import { NoSSR } from "@/app/components/no-ssr";
import { useAccount } from "wagmi";
import { YourInfo } from "./your-info";
import { WalletConnectedOrNot } from "./wallet-connected-or-not";

interface Props {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimals: number;
  reserveSize: string;
  availableLiquidity: string;
  utilizationRate: string;
  oraclePrice: string;
  totalBorrowed?: string;
  supplyCap?: string;
  supplyApy?: string;
  startIsolatedDebt?: string;
  stopIsolatedDebt?: string;
  borrowCap?: string;
  borrowApy?: string;
}

export default function CoinHeader({
  tokenAddress,
  tokenSymbol,
  tokenName,
  tokenDecimals,
  reserveSize,
  availableLiquidity,
  utilizationRate,
  oraclePrice,
  totalBorrowed,
  supplyCap,
  supplyApy,
  startIsolatedDebt,
  stopIsolatedDebt,
  borrowCap,
  borrowApy,
}: Props) {
  const { isConnected } = useAccount();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src={`/tokens/${tokenSymbol.toLowerCase()}.svg`}
            alt={tokenSymbol}
            width={32}
            height={32}
            className="size-8"
          />
          <div>
            <h2 className="text-white text-base font-normal">{tokenSymbol}</h2>
            <h6 className="text-[10px] font-extralight text-white opacity-70">
              {tokenName}
            </h6>
          </div>
          <NewTabIcon className="size-3 cursor-pointer text-white ml-1" />
        </div>
        <div className="flex flex-wrap justify-between gap-4 w-full lg:w-auto">
          <Metric title="Reserve Size" value={`$${reserveSize}`} />
          <Metric title="Available Liquidity" value={`$${availableLiquidity}`} />
          <Metric title="Utilization Rate" value={`${utilizationRate}%`} />
          <Metric
            title="Oracle Price"
            value={`$${oraclePrice}`}
            icon={<NewTabIcon className="size-3 cursor-pointer text-white ml-1" />}
          />
        </div>
      </div>

      {/* Collateral/Supply Info и Borrow Info */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-full xl:col-span-2 space-y-6">
          <Section title="Collateral/Supply Info">
            {totalBorrowed && (
              <InfoCard title="Total Borrowed" value={`$${totalBorrowed}`}>
                <Badge text={totalBorrowed} />
              </InfoCard>
            )}
            {supplyCap && (
              <InfoCard title="Supply Cap" value={`$${supplyCap}`} tooltip>
                <Badge text={supplyCap} />
              </InfoCard>
            )}
            {supplyApy && <InfoCard title="Supply APY" value={`${supplyApy}%`} />}
            {startIsolatedDebt && stopIsolatedDebt && (
              <InfoCard
                title="Isolated Debt Ceiling"
                value={`${startIsolatedDebt} of ${stopIsolatedDebt}`}
                tooltip
              >
                <Badge text={startIsolatedDebt} /> of <Badge text={stopIsolatedDebt} />
              </InfoCard>
            )}
          </Section>

          <Section title="Borrow Info">
            {totalBorrowed && (
              <InfoCard title="Total Borrowed" value={`$${totalBorrowed}`}>
                <Badge text={totalBorrowed} />
              </InfoCard>
            )}
            {borrowCap && (
              <InfoCard title="Borrow Cap" value={`$${borrowCap}`} tooltip>
                <Badge text={borrowCap} />
              </InfoCard>
            )}
            {borrowApy && (
              <InfoCard title="Borrow APY" value={`${borrowApy}%`} tooltip>
                <Badge text={`${borrowApy}%`} />
              </InfoCard>
            )}
          </Section>

          <div className='border-t border-white/20 mt-2'>
            <NoSSR>
              <BorrowRateChart />
            </NoSSR>
          </div>
        </div>

        <div className="col-span-full xl:col-span-1 space-y-6">
          <WalletConnectedOrNot isWalletConnected={isConnected} />
          <YourInfo tokenAddress={tokenAddress as `0x${string}`} decimals={tokenDecimals} />
        </div>
      </div>
    </div>
  );
}

function Metric({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="min-w-[130px]">
      <h5 className="text-white text-sm font-light opacity-75">{title}</h5>
      <h6 className="text-white text-lg font-semibold mt-1.5 flex items-center gap-1">
        {value}
        {icon}
      </h6>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-white text-xl font-normal leading-6 mb-2">{title}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 pb-3 border-b border-white/20">
        {children}
      </div>
    </div>
  );
}

function InfoCard({
  title,
  value,
  tooltip = false,
  children,
}: {
  title: string;
  value: string;
  tooltip?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-[4px] border border-[#855ECA] bg-white/[0.04] backdrop-blur-[25px] py-1.5 px-3">
      <h4 className="text-white text-xs font-light opacity-75 flex items-center gap-1">
        {title} {tooltip && <ToolTipIcon className="size-4 cursor-pointer" />}
      </h4>
      <h6 className="text-white text-lg font-semibold mt-1.5 flex items-center gap-1">
        {value}
        {children}
      </h6>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="text-white font-normal text-xs py-[2px] px-1.5 rounded-[2px] bg-[#472582] ml-[1px]">
      {text}
    </span>
  );
}
