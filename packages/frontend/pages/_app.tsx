import * as React from 'react';
import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import '../styles/globals.css';
import { Grommet } from 'grommet';

// Imports
import { createClient, WagmiConfig, configureChains } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { useIsMounted } from '../hooks';
import { Chain } from 'wagmi';

export const bitfinity = {
  id: 355113,
  name: 'Bitfinity TestNet',
  network: 'avalanche',
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

const { chains, provider, webSocketProvider } = configureChains(
  [bitfinity, hardhat],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'CreDrex',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const App = ({ Component, pageProps }: AppProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <Grommet full>
      <WagmiConfig client={wagmiClient}>
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
