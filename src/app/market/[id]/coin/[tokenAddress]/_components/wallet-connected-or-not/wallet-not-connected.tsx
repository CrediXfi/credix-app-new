"use client";

import { WalletConnectionIcon } from "@/app/components/atom/icons/wallet-connection";
import { useConnect } from "wagmi";
import { ConnectButton } from '@rainbow-me/rainbowkit';

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
        Connect your wallet to use Credix Market
      </p>
      {/* <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-white text-black flex items-center justify-center gap-2 font-medium py-2 px-4 hover:bg-opacity-90 rounded text-sm"
      >
        {isConnecting
          ? `Connecting to ${connectorName}…`
          : "Connect Wallet"}
        <WalletConnectionIcon className="size-[14px]" />
      </button> */}

      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // Можно настроить кастомную логику видимости (например, не показывать, если SSR)
          const ready = mounted && authenticationStatus !== 'loading';
          const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

          return (
            <div>
              {!connected ? (
                // Кнопка "Connect Wallet"
                <button
                  onClick={openConnectModal}
                  type="button"
                  className="bg-gradient-to-b group from-[#855ECA] flex items-center justify-center gap-2 to-[#B59DDE] text-white font-medium py-2 px-4 rounded relative overflow-hidden text-sm"
                >
                  <span className="absolute top-0 left-0 w-full h-full bg-black opacity-0 duration-150 group-hover:opacity-10" />
                  Connect Wallet
                  <WalletConnectionIcon className="size-[14px]" />
                </button>
              ) : chain.unsupported ? (
                // Кнопка "Switch Network"
                <button
                  onClick={openChainModal}
                  type="button"
                  className="bg-red-600 text-white px-3 py-2 rounded font-semibold text-sm"
                >
                  Wrong network
                </button>
              ) : (
                // Кнопка-адрес (и можно добавить ещё функционал!)
                <button
                  onClick={openAccountModal}
                  type="button"
                  className="text-white text-sm bg-[#8748FF] px-3 py-2 rounded font-semibold"
                >
                  {account.displayName}
                </button>
              )}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
