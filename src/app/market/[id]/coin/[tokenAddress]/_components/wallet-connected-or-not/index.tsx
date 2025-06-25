"use client";

import { WalletNotConnected } from "./wallet-not-connected";
import { TabView } from "./tab-view";

type Props = {
  isWalletConnected: boolean;
};

export function WalletConnectedOrNot({ isWalletConnected }: Props) {
  if (!isWalletConnected) {
    return <WalletNotConnected />;
  }
  return <TabView />;
}
