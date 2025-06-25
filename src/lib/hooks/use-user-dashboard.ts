// src/lib/hooks/use-user-dashboard.ts
import { useQuery } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import { wagmiConfig } from "@/providers/web3-provider";
import { useAccount } from "wagmi";
import addresses from "@/chains/addresses.json";
import { UiPoolDataProviderV3Abi } from "@/chains/abis/ts/UiPoolDataProviderV3Abi";
import { UiIncentiveDataProviderV3Abi } from "@/chains/abis/ts/UiIncentiveDataProviderV3Abi";
import { CHAIN_ID } from "@/chains/soniclocal";
import { useMarkets } from "./use-markets";

type UserReserveData = {
  underlyingAsset: string;
  scaledATokenBalance: bigint;
  principalStableDebt: bigint;
  scaledVariableDebt: bigint;
};

type UserReserveIncentiveData = {
  underlyingAsset: string;
  rewardTokenDecimals: number;
  accruedRewards: bigint;
};

export type DashboardPosition = {
  poolName:          string;
  yourDeposit:       number;
  yourDebt:          number;
  healthFactor:      number;
  netSupplyApy:      number;
  netBorrowApy:      number;
  netWorth:          number;
  totalInterestPaid: number;
  totalInterestEarn: number;
  netInterest:       number;
  borrowPowerUsed:   number;
  rewards:           number;
};

export function useUserDashboard() {
  const { address: userAddress } = useAccount();
  const { data: markets, isLoading: loadingMarkets } = useMarkets();

  return useQuery({
    queryKey: ["dashboard", userAddress],
    queryFn: async () => {
      if (!userAddress) throw new Error("No wallet connected");
      if (!markets)     throw new Error("Markets data not ready");

      const addrs = (addresses as Record<string, any>)[String(CHAIN_ID)];
      if (!addrs.UiPoolDataProviderV3 || !addrs.PoolAddressesProvider || !addrs.UiIncentiveDataProviderV3) {
        throw new Error("Missing provider addresses");
      }

      const rawRes = await readContract(
        wagmiConfig,
        {
          address: addrs.UiPoolDataProviderV3 as `0x${string}`,
          abi: UiPoolDataProviderV3Abi,
          functionName: "getUserReservesData",
          args: [addrs.PoolAddressesProvider as `0x${string}`, userAddress],
          chainId: CHAIN_ID,
        }
      );
      const [userRaw] = rawRes as unknown as [UserReserveData[], any];

      const rawInc = await readContract(
        wagmiConfig,
        {
          address: addrs.UiIncentiveDataProviderV3 as `0x${string}`,
          abi: UiIncentiveDataProviderV3Abi,
          functionName: "getUserReservesIncentivesData",
          args: [addrs.PoolAddressesProvider as `0x${string}`, userAddress],
          chainId: CHAIN_ID,
        }
      );
      // rawInc may be [array, info] or the array itself
      let incentivesRaw: UserReserveIncentiveData[];
      if (Array.isArray(rawInc) && Array.isArray((rawInc as any)[0])) {
        incentivesRaw = (rawInc as any)[0] as UserReserveIncentiveData[];
      } else if (Array.isArray(rawInc)) {
        incentivesRaw = rawInc as UserReserveIncentiveData[];
      } else {
        incentivesRaw = [];
      }

      // 3) Aggregate deposits/debts
      let totalDeposit = 0;
      let totalDebt    = 0;
      let weightedSup  = 0;
      let weightedBor  = 0;
      let intEarn      = 0;
      let intPaid      = 0;

      for (const r of userRaw) {
        const m = markets.find(
          x => x.underlyingAsset.toLowerCase() === r.underlyingAsset.toLowerCase()
        )!;
        const dec   = m.decimals;
        const price = m.underlyingPrice;
        const depTokens = Number(r.scaledATokenBalance) / 10 ** dec;
        const debtTokens =
          (Number(r.principalStableDebt) + Number(r.scaledVariableDebt)) /
          10 ** dec;

        const depUsd  = depTokens  * price;
        const debtUsd = debtTokens * price;

        totalDeposit += depUsd;
        totalDebt    += debtUsd;
        weightedSup  += depUsd  * m.supplyApy;
        weightedBor  += debtUsd * m.borrowApy;
        intEarn      += depUsd  * (m.supplyApy  / 100);
        intPaid      += debtUsd * (m.borrowApy / 100);
      }

      const netSupplyApy      = totalDeposit === 0 ? 0 : weightedSup / totalDeposit;
      const netBorrowApy      = totalDebt    === 0 ? 0 : weightedBor / totalDebt;
      const totalInterestEarn = totalDeposit * (netSupplyApy / 100);
      const totalInterestPaid = totalDebt    * (netBorrowApy / 100);
      const netInterest       = totalInterestEarn - totalInterestPaid;
      const netWorth          = totalDeposit - totalDebt;
      const healthFactor      = totalDebt === 0 ? Infinity : totalDeposit / totalDebt;
      const borrowPowerUsed   = totalDeposit === 0 ? 0 : (totalDebt / totalDeposit) * 100;

      let totalRewardsTokens = 0;
      for (const inv of incentivesRaw) {
        totalRewardsTokens += Number(inv.accruedRewards) / 10 ** inv.rewardTokenDecimals;
      }

      const position: DashboardPosition = {
        poolName:          "Core Pool",
        yourDeposit:       totalDeposit,
        yourDebt:          totalDebt,
        healthFactor,
        netSupplyApy,
        netBorrowApy,
        netWorth,
        totalInterestPaid,
        totalInterestEarn,
        netInterest,
        borrowPowerUsed,
        rewards:           totalRewardsTokens,
      };

      return {
        positions:      [position],
        totalDebt,
        totalNetWorth:  netWorth,
        totalRewards:   totalRewardsTokens,
      };
    },
    enabled: !!userAddress && !!markets,
    staleTime: 30_000,
  });
}
