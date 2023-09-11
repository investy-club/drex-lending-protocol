import * as React from 'react';
import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import '../styles/globals.css';
import { Grommet } from 'grommet';
import { hpe } from 'grommet-theme-hpe';

// Imports
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { useIsMounted } from '../hooks';
import { Chain } from 'wagmi';

export const bitfinity = {
  id: 355113,
  name: 'Bitfinity TestNet',
  network: 'bitfinity',
  nativeCurrency: {
    decimals: 18,
    name: 'Bitfinity',
    symbol: 'BFT',
  },
  rpcUrls: {
    public: { http: ['https://testnet.bitfinity.network/'] },
    default: { http: ['https://testnet.bitfinity.network/'] },
  },
  blockExplorers: {
    etherscan: {
      name: 'BitfinityExplorer',
      url: 'https://explorer.bitfinity.network/',
    },
    default: {
      name: 'BitfinityExplorer',
      url: 'https://explorer.bitfinity.network/',
    },
  },
} as const satisfies Chain;

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [bitfinity, hardhat],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'CreDrex',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains,
});

const configWagmi = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const App = ({ Component, pageProps }: AppProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <Grommet theme={hpe}>
      <WagmiConfig config={configWagmi}>
        <RainbowKitProvider coolMode chains={chains}>
          <NextHead>
            <title>CreDrex App</title>
            <meta name="description" content="Drex Lending Protocol" />
            <link rel="icon" href="/favicon.ico" />
          </NextHead>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </Grommet>
  );
};

export default App;
