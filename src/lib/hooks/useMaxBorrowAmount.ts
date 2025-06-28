// src/lib/hooks/useMaxBorrowAmount.ts
import { useState, useEffect } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import addresses from "@/chains/addresses.json";
import { PoolImplementationAbi } from "@/chains/abis/ts/PoolImplementationAbi";
import { UiPoolDataProviderV3Abi } from "@/chains/abis/ts/UiPoolDataProviderV3Abi";
import { CHAIN_ID } from "@/chains/soniclocal";

export const useMaxBorrowAmount = (
    tokenAddress: `0x${string}`,
    decimals: number
) => {
    const [maxAmount, setMaxAmount] = useState(0);
    const { address } = useAccount();
    const publicClient = usePublicClient();

    const chainAddrs = (addresses as Record<string, any>)[String(CHAIN_ID)];
    const poolProxy = chainAddrs?.["Pool-Proxy"] as `0x${string}` | undefined;
    const UiPoolDataProviderV3: `0x${string}` = chainAddrs?.["UiPoolDataProviderV3"] as `0x${string}`;
    if (!poolProxy) {
        throw new Error(`Pool-Proxy address not found for chainId=${CHAIN_ID}`);
    }

    useEffect(() => {
        const calculate = async () => {
            if (!address || !publicClient) return;

            try {
                // 1. User borrowing power
                const userAccountData =
                    await publicClient.readContract({
                        address: poolProxy,
                        abi: PoolImplementationAbi,
                        functionName: "getUserAccountData",
                        args: [address],
                    });
                const availableBorrowsBase = userAccountData[2]; // 8 decimals

                // 2. Oracle price from UI data provider
                const [reservesArray, baseCurrencyData] =
                    await publicClient.readContract({
                        address: UiPoolDataProviderV3,
                        abi: UiPoolDataProviderV3Abi,
                        functionName: "getReservesData",
                        args: [chainAddrs?.["PoolAddressesProvider"] as `0x${string}`],
                    });
                const reserve = reservesArray.find(
                    (r) => r.underlyingAsset.toLowerCase() === tokenAddress
                );
                if (!reserve) throw new Error("Token not found in reserve data");
                const priceInMarketReferenceCurrency = reserve.priceInMarketReferenceCurrency;

                // 3. Reserve liquidity & format
                const availableLiquidity = BigInt(reserve.availableLiquidity);
                const availableBorrows = BigInt(availableBorrowsBase);
                const price = BigInt(priceInMarketReferenceCurrency);

                // 4. Compute max borrowable
                const maxFromBorrow = (availableBorrows * BigInt(10 ** decimals)) / price;

                // const baseLTVasCollateral = reserve.baseLTVasCollateral;
                // const availableLiquidityBaseLTV = (availableLiquidity * baseLTVasCollateral) / BigInt(10000); // TODO: Change this back to just `availableLiquidity` later when liquidity becomes high

                // NOTE: The user can borrow the `maxFromBorrow`. But if the reserve doesn't have enough liquidity then borrow only the available liquidity
                const max =
                    maxFromBorrow < availableLiquidity
                        ? maxFromBorrow
                        : availableLiquidity;

                setMaxAmount(parseFloat(formatUnits(max, decimals)));
            } catch (err) {
                console.error(err);
                setMaxAmount(0);
            }
        };

        calculate();
    }, [address, publicClient, tokenAddress, decimals]);

    return maxAmount;
};
