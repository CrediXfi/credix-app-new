
import { getIsSidebarExpandedOnServer, getIsWalletConnectedOnServer } from "@/lib/utils/server-cookies";
import type { Metadata } from "next";
import { DM_Sans } from 'next/font/google';
import { SideBar } from "./components/sidebar";
import "./globals.css";
import { DashboardLayoutWrapper } from "./components/dashboard-layout-wrapper";
import { cn } from "@/lib/utils";
import { Header } from "./components/header";
import { BottomHalfMoon } from "./components/bottom-half-moon";
import { Web3Provider } from '../providers/web3-provider';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-dm-sans',
  display: 'swap',
});


export const metadata: Metadata = {
  title: "Credix Crypto",
  description: "Credix Crypto",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isExpanded = await getIsSidebarExpandedOnServer();
  const isConnected = await getIsWalletConnectedOnServer();

  return (
    <html lang="en" className={cn(dmSans.className, 'antialiased overflow-x-hidden')}>
      <body className="bg-gray-950 font-sans relative">
        <Web3Provider>
          <div className="absolute inset-0 z-[-1] w-full h-screen p-10">
            <div className="relative h-full w-full">
              <div className="absolute block top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] bg-[#261536] scale-[1.5]" />
              <div className="absolute block top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[150px] bg-[#261536] opacity-50 scale-[1.5]" />
              <div className="absolute block top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[150px] bg-[#261536] opacity-50 scale-[1.5]" />
            </div>
          </div>
          <div className="fixed left-1/2 bottom-1 sm:-bottom-1 md:-bottom-20 lg:-bottom-[140px] xl:-bottom-[170px] -translate-x-1/2 w-screen z-[10]">
            <div className="bounce-animation relative">
              <BottomHalfMoon className="w-full -mt-full  mx-auto max-w-[1440px]" />
              <span className="absolute w-full bg-[#0D0416] h-[100px]"></span>
            </div>
          </div>
          <div className="relative overflow-x-hidden max-w-screen z-[100]">
            <SideBar isSidebarExpandedServerState={isExpanded} />
            <Header isWalletConnectedServerState={isConnected} />
            <DashboardLayoutWrapper isSidebarExpandedServerState={isExpanded}>
              {children}
            </DashboardLayoutWrapper>
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
