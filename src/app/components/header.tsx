'use client'

import { getIsWalletConnectedOnClient, IsWalletConnectedType, useWalletConnection } from "@/lib/hooks/use-wallet-connection";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX, SVGProps, useEffect, useState } from "react";
import { HamburgerIcon } from "./atom/icons/hamburger";
import { HomeLogo } from "./atom/icons/home/home-logo";
import { AggregatorIcon } from './atom/icons/sidebar/aggregator';
import { AuditIcon } from './atom/icons/sidebar/audit';
import { CrossIcon } from "./atom/icons/sidebar/cross";
import { CxPointIcon } from './atom/icons/sidebar/cx-point';
import { DashboardIcon } from './atom/icons/sidebar/dashboard';
import { DiscordIcon } from './atom/icons/sidebar/discord';
import { EarnIcon } from './atom/icons/sidebar/earn';
import { MarketIcon } from './atom/icons/sidebar/market';
import { WalletConnectionIcon } from "./atom/icons/wallet-connection";
import { ConnectButton } from '@rainbow-me/rainbowkit';



type Props = {
    isWalletConnectedServerState: IsWalletConnectedType;
};

export function Header({ isWalletConnectedServerState }: Props) {
    const pathname = usePathname()
    const [drawerIsOpen, setDrawerIsOpen] = useState(false)
    const { isConnected, toggle } = useWalletConnection();
    const IS_CONNECTED = getIsWalletConnectedOnClient(isWalletConnectedServerState, isConnected);

    useEffect(() => {
        setDrawerIsOpen(false)
    }, [pathname]);


    return (
        <header className="flex items-center justify-between xl:justify-end p-5">
            <div className="xl:hidden flex items-center gap-2">
                <HamburgerIcon className="w-7" onClick={() => setDrawerIsOpen(!drawerIsOpen)} />
                <Link href="/">
                    <HomeLogo className="w-8 h-auto" /></Link>
            </div>
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

            <Drawer isOpen={drawerIsOpen} onClose={() => setDrawerIsOpen(false)} />
        </header>
    );
}




const menuLinks = [
    {
        href: "/market",
        label: "Market",
        icon: MarketIcon
    },
    {
        href: "/earn",
        label: "Earn",
        icon: EarnIcon
    },
    {
        href: "/cx-point",
        label: "CX Points",
        icon: CxPointIcon
    },
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: DashboardIcon
    },
    {
        href: "",
        label: "Aggregator",
        icon: AggregatorIcon,
        badge: "Coming Soon"
    },
]
const bottomMenuLinks = [
    {
        href: "",
        label: "Discord",
        icon: DiscordIcon
    },
    {
        href: "",
        label: "Audit",
        icon: AuditIcon
    },
]




function Drawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void; }) {
    return (
        <div className={cn("fixed z-[100] w-full h-screen duration-300 bg-[#0D0416] top-0 -right-full p-6", isOpen && 'right-0')}>
            <div className="flex justify-end">
                <button onClick={onClose} className="text-white inline-block ml-auto">
                    <CrossIcon className="w-7" />
                </button>
            </div>
            <div className="flex flex-col gap-4 mt-10 mb-10 items-center">
                {
                    menuLinks.map((link, index) => (
                        <SingleLink key={index} {...link} />
                    ))
                }
            </div>
            <BottomMenuItems />
        </div>
    )
}




function BottomMenuItems() {
    return (
        <div className="flex flex-col gap-4 mt-10 mb-10 items-center">
            {
                bottomMenuLinks.map((link, index) => (
                    <SingleLink key={index} {...link} />
                ))
            }
        </div>)
}

function SingleLink({ href, label, badge, icon }: {
    href: string; label: string;
    badge?: string, icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}) {
    const pathname = usePathname()
    const className = cn('text-white relative inline-flex w-full items-center gap-2.5 rounded-md p-3 px-2', pathname === href && 'text-white bg-[#8748FF]');
    const textElement = (
        <>
            <span className={cn('w-[100px] whitespace-nowrap duration-500 overflow-hidden inline-flex',)}>{label} </span>
            {
                badge && <span className='absolute left-[132px] top-2.5 text-[9px] bg-[#8748FF] px-1 pt-0.5 rounded'>{badge}</span>
            }
        </>
    )

    const DynamicIcon = icon


    return (
        <span className={cn('duration-500', 'w-full')}> <Link href={href} className={className}>
            <DynamicIcon className={cn("size-6 relative")} />
            {textElement}
        </Link></span>
    );
}
