'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { useTokenData } from '@/lib/hooks/use-token-data';
import { useMarkets } from '@/lib/hooks/use-markets';
import { usePoolData } from '@/lib/hooks/use-pool-data-provider';

import { Supply } from '../../supply';
import { Borrow } from '../../borrow';

type TabType = 'supply' | 'borrow';

import { useAccount, usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import addresses from "@/chains/addresses.json";
import { CHAIN_ID } from "@/chains/soniclocal";
import { PoolImplementationAbi } from "@/chains/abis/ts/PoolImplementationAbi";

export function TabView() {
  const { tokenAddress } = useParams<{ tokenAddress: string }>();

  const { address } = useAccount();
  const publicClient = usePublicClient();

  const chainAddrs = (addresses as Record<string, any>)[String(CHAIN_ID)];
  const poolProxy = chainAddrs?.["Pool-Proxy"] as `0x${string}` | undefined;
  if (!poolProxy) {
    return <div className="text-red-500">Pool-Proxy address not configured for this chain</div>;
  }

  const { data: tokenData, isLoading: lt, isError: et } = useTokenData(tokenAddress);
  const { data: markets, isLoading: lm, isError: em } = useMarkets();
  const { data: poolData, isLoading: lp, isError: ep } = usePoolData(tokenAddress);

  const [healthFactor, setHealthFactor] = useState<number | null>(null);

  if (lt || lm || lp) return <div className="text-white/60">Loading…</div>;

  if (et || em || ep || !tokenData || !markets || !poolData) {
    return (
      <div className="text-red-500">
        Failed to fetch on-chain data
      </div>
    );
  }

  const market = markets.find(
    (m) => m.underlyingAsset.toLowerCase() === tokenAddress.toLowerCase(),
  );
  if (!market) {
    return <div className="text-red-500">Market not found</div>;
  }

  const totalBorrow = market.totalPrincipalStableDebt + market.totalScaledVariableDebt;
  const reserveSize = market.availableLiquidity + totalBorrow;
  const borrowApy = market.borrowApy;

  const [tab, setTab] = useState<TabType>('supply');
  const buttonCls = 'px-4 py-1.5 rounded';

  useEffect(() => {
    if (!poolProxy || !address || !publicClient) {
      return;
    }

    const fetchData = async () => {
      try {
        const userAccountData = await publicClient.readContract({
          address: poolProxy,
          abi: PoolImplementationAbi,
          functionName: "getUserAccountData",
          args: [address],
        });

        const rawHealthFactor = userAccountData[5]; // BigInt
        const formatted = formatUnits(rawHealthFactor, 18); // string
        setHealthFactor(Number(formatted));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [poolProxy]);

  return (
    <div className="mt-4 text-white">
      <div className="flex justify-center mb-5 gap-4">
        <button
          onClick={() => setTab('supply')}
          className={cn(
            buttonCls,
            tab === 'supply' ? 'bg-[#855ECA]' : 'bg-transparent hover:bg-white/10',
          )}
        >
          Supply
        </button>
        <button
          onClick={() => setTab('borrow')}
          className={cn(
            buttonCls,
            tab === 'borrow' ? 'bg-[#855ECA]' : 'bg-transparent hover:bg-white/10',
          )}
        >
          Borrow
        </button>
      </div>

      {tab === 'supply' && (
        <Supply
          tokenAddress={tokenAddress as `0x${string}`}
          decimals={tokenData.decimals}
          maxAmount={market.availableLiquidity}
          symbol={tokenData.symbol}
        />
      )}

      {tab === 'borrow' && (
        <Borrow
          tokenAddress={tokenAddress as `0x${string}`}
          decimals={tokenData.decimals}
          maxAmount={totalBorrow}
          symbol={tokenData.symbol}
          borrowApy={borrowApy}
          healthFactor={healthFactor ?? 0}
        />
      )}
      <p className="mt-4 text-xs text-white/60 text-center">
        Reserve size: {reserveSize.toLocaleString()} {tokenData.symbol}
      </p>
    </div>
  );
}
