import { WalletConnectionIcon } from "@/app/components/atom/icons/wallet-connection";

export function WalletNotConnected() {
  return (
    <>
      <div className="md:grid flex justify-center md:justify-normal">
        <div className="h-full flex items-center justify-center py-4">
          <div className="w-full bg-white/[.04] backdrop-blur-[25px] border border-[#865eca88] rounded">
            <div className="py-10 px-4 flex flex-col items-center text-center">
              <h2 className="text-white text-2xl font-semibold mb-2">
                Wallet not connected
              </h2>
              <p className="text-white opacity-70 mb-6 text-base font-light leading-6">
                Connect your wallet trade on Zerolend
              </p>

              <button className="bg-white hover:bg-gray-300 text-black transition  font-medium py-2 px-6 rounded flex items-center justify-center gap-2">
                Connect Wallet
                <WalletConnectionIcon className="size-[14px] text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
