'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { setCookie } from '../utils/cookies';

export type IsWalletConnectedType = 'true' | 'false' | undefined;

type Props = {
  isConnected: IsWalletConnectedType;
  setIsConnected: (value: IsWalletConnectedType) => void;
};

const useWalletConnectionStore = create<Props>((set) => ({
  isConnected: undefined,
  setIsConnected: (value: IsWalletConnectedType) => set({ isConnected: value }),
}));

export function useWalletConnection(defaultLayout?: IsWalletConnectedType) {
  const { isConnected, setIsConnected } = useWalletConnectionStore();

  useEffect(() => {
    if (typeof defaultLayout !== 'undefined') {
      setIsConnected(defaultLayout);
    }
  }, []);

  function toggle(toggleTo: boolean) {
    const value = toggleTo ? 'true' : 'false';
    setCookie({
      name: 'walletConnected',
      value,
      path: '/',
    });
    setIsConnected(value);
  }

  return { isConnected, toggle };
}

export function getIsWalletConnectedOnClient(serverState?: IsWalletConnectedType, clientState?: IsWalletConnectedType) {
  const IS_WALLET_CONNECTED = typeof clientState !== 'undefined' ? (clientState === 'true' ? true : false) : serverState === 'true';
  return IS_WALLET_CONNECTED;
}
