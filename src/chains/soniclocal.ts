// src/chains/soniclocal.ts
import { defineChain, type Chain } from 'viem';

export const sonic: Chain = defineChain({
  id: 146,
  name: 'Sonic',
  network: 'sonic',
  nativeCurrency: {
    name: 'Sonic',
    symbol: 'S',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.soniclabs.com'] },
    public:  { http: ['https://rpc.soniclabs.com'] },
  },
  blockExplorers: {
    default: { name: 'Sonic Scan', url: 'https://sonicscan.org' },
  },
  testnet: true,
});

export const CHAIN_ID = sonic.id;
