"use client";

import { WalletConnectionIcon } from "@/app/components/atom/icons/wallet-connection";
import { useConnect } from "wagmi";

export function WalletNotConnected() {
  const { connect, connectors, status } = useConnect();
  const isConnecting = status === "pending";
  const connectorName = connectors[0]?.name ?? "Wallet";

  const handleConnect = () => {
    if (connectors[0]) {
      connect({ connector: connectors[0] });
    }
  };

  return (
    <div className="border border-[#855ECA] rounded-md mt-[71px] p-4 flex flex-col justify-center items-center min-h-[400px]">
      <h2 className="text-white text-2xl font-semibold mb-2">
        Wallet not connected
      </h2>
      <p className="text-white opacity-70 mb-6 text-base font-light leading-6 text-center">
        Connect your wallet to trade on Zerolend
      </p>
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-white text-black flex items-center justify-center gap-2 font-medium py-2 px-4 hover:bg-opacity-90 rounded text-sm"
      >
        {isConnecting
          ? `Connecting to ${connectorName}…`
          : "Connect Wallet"}
        <WalletConnectionIcon className="size-[14px]" />
      </button>
    </div>
  );
}
