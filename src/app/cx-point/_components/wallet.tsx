import { WalletConnectionIcon } from "@/app/components/atom/icons/wallet-connection";

export  function Wallet() {
  return (
    <div className="md:grid flex w-full justify-center md:justify-normal">
      <div className="h-auto flex w-full items-center justify-center py-4">
        <div className="w-full bg-white/[.04] backdrop-blur-[25px] border border-[#865eca88] rounded-xl">
          <div className="py-10 px-4 flex flex-col items-center text-center">
            <h2 className="text-white text-2xl font-semibold mb-2">
              Wallet not connected
            </h2>
            <p className="text-white opacity-70 mb-6 text-base font-light leading-6">
              Connect your wallet to know your rank
            </p>

            <button className="bg-[#8748FF] hover:bg-[#7838ec] transition text-white font-medium py-2 px-6 rounded flex items-center justify-center gap-2">
              Connect Wallet
              <WalletConnectionIcon className="size-[14px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
