'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useParams } from 'next/navigation';

import { useTokenData } from '@/lib/hooks/use-token-data';
import { useMarkets } from '@/lib/hooks/use-markets';
import { usePoolData } from '@/lib/hooks/use-pool-data-provider';

import { Supply } from '../../supply';
import { Borrow } from '../../borrow';

type TabType = 'supply' | 'borrow';

export function TabView() {
  const { tokenAddress } = useParams<{ tokenAddress: string }>();

  const { data: tokenData, isLoading: lt, isError: et } = useTokenData(tokenAddress);
  const { data: markets, isLoading: lm, isError: em } = useMarkets();
  const { data: poolData, isLoading: lp, isError: ep } = usePoolData(tokenAddress);

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

  const [tab, setTab] = useState<TabType>('supply');
  const buttonCls = 'px-4 py-1.5 rounded';

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
        />
      )}
      <p className="mt-4 text-xs text-white/60 text-center">
        Reserve size: {reserveSize.toLocaleString()} {tokenData.symbol}
      </p>
    </div>
  );
}
