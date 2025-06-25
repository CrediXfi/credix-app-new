// src/providers/web3-provider.tsx
"use client";
import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sonic } from "../chains/soniclocal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const projectId = "09c938337738614b6163902900197b85";

export const wagmiConfig = getDefaultConfig({
  appName: "Credix Lending App",
  projectId,
  chains: [sonic],
  ssr: false,
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider modalSize="compact" coolMode>
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
